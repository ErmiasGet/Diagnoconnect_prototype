import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { body, validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import { Hospital } from '../models/Hospital.js';
import { DiagnosticCenter } from '../models/DiagnosticCenter.js';
import { notifyUser } from '../utils/notifications.js';

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

function signAccess(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: ACCESS_TTL,
  });
}

function signRefresh(user) {
  return jwt.sign({ sub: user._id.toString(), type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TTL,
  });
}

export const registerValidators = [
  body('fullName').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['patient', 'doctor', 'hospital_admin', 'center_admin', 'ambulance']),
  body('phone').optional().isString(),
];

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, email, password, role, phone, profile } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ fullName, email, password: hash, role, phone: phone || '' });

  if (role === 'patient') {
    await Patient.create({
      userId: user._id,
      age: profile?.age,
      gender: profile?.gender,
      address: profile?.address,
      medicalHistory: profile?.medicalHistory || [],
    });
  }
  if (role === 'doctor') {
    let hospitalId = profile?.hospitalId;
    if (!hospitalId && profile?.hospitalName) {
      const h = await Hospital.create({
        name: profile.hospitalName,
        location: profile?.hospitalLocation || '',
        approvalStatus: 'pending',
      });
      hospitalId = h._id;
    }
    await Doctor.create({
      userId: user._id,
      specialization: profile?.specialization || '',
      hospitalId: hospitalId || undefined,
      licenseNumber: profile?.licenseNumber || '',
    });
  }
  if (role === 'hospital_admin') {
    await Hospital.create({
      name: profile?.hospitalName || `${fullName}'s Hospital`,
      location: profile?.location || '',
      contactPhone: phone,
      adminUserId: user._id,
      approvalStatus: 'pending',
    });
  }
  if (role === 'center_admin') {
    await DiagnosticCenter.create({
      centerName: profile?.centerName || `${fullName}'s Center`,
      location: profile?.location || '',
      contactPhone: phone,
      availableServices: profile?.availableServices || [],
      adminUserId: user._id,
      approvalStatus: 'pending',
    });
  }

  const otp = String(Math.floor(100000 + Math.random() * 900000));
  user.otpCode = otp;
  user.otpExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  await notifyUser(user._id, {
    title: 'Verify your account',
    message: `Your OTP code is ${otp} (demo; expires in 15 minutes).`,
    channels: ['in_app', 'email'],
  });

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return res.status(201).json({
    message: 'Registered',
    accessToken,
    refreshToken,
    user: { id: user._id, fullName, email, role: user.role },
  });
}

export const loginValidators = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (!user.isActive) return res.status(403).json({ message: 'Account disabled' });

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.json({
    accessToken,
    refreshToken,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  });
}

export async function logout(req, res) {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  res.json({ message: 'Logged out' });
}

export async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Missing refresh token' });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.sub).select('+refreshToken');
    if (!user?.refreshToken || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const accessToken = signAccess(user);
    res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export const forgotValidators = [body('email').isEmail().normalizeEmail()];

export async function forgotPassword(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If the email exists, reset instructions were sent.' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  await notifyUser(user._id, {
    title: 'Password reset',
    message: `Reset link (demo): ${link}`,
    channels: ['in_app', 'email'],
  });

  res.json({ message: 'If the email exists, reset instructions were sent.' });
}

export const resetValidators = [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 }),
];

export async function resetPassword(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { token, password } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetExpires: { $gt: new Date() },
  }).select('+resetToken +resetExpires +password');
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = await bcrypt.hash(password, 12);
  user.resetToken = undefined;
  user.resetExpires = undefined;
  await user.save();

  res.json({ message: 'Password updated' });
}

export const verifyOtpValidators = [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 4, max: 8 }),
];

export async function verifyOtp(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select('+otpCode +otpExpires');
  if (!user || user.otpCode !== otp || !user.otpExpires || user.otpExpires < new Date()) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.json({ message: 'Verified' });
}

export async function me(req, res) {
  const user = await User.findById(req.user._id).lean();
  let profile = null;
  if (user.role === 'patient') profile = await Patient.findOne({ userId: user._id }).populate('emergencyContacts').lean();
  if (user.role === 'doctor') profile = await Doctor.findOne({ userId: user._id }).populate('hospitalId').lean();
  if (user.role === 'hospital_admin') {
    profile = await Hospital.findOne({ adminUserId: user._id }).lean();
  }
  if (user.role === 'center_admin') {
    profile = await DiagnosticCenter.findOne({ adminUserId: user._id }).lean();
  }
  const { password: _pw, ...safe } = user;
  res.json({ user: { ...safe, id: user._id }, profile });
}

export async function sendPhoneOtp(req, res) {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone number required' });
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const user = await User.findById(req.user._id).select('+phoneOtpCode +phoneOtpExpires');
  user.phoneOtpCode = otp;
  user.phoneOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  user.phone = phone;
  await user.save({ validateBeforeSave: false });
  await notifyUser(user._id, {
    title: 'Phone verification',
    message: `Your phone OTP is ${otp} (demo).`,
    channels: ['in_app', 'sms'],
  });
  res.json({ message: 'OTP sent' });
}

export async function verifyPhoneOtp(req, res) {
  const { otp } = req.body;
  const user = await User.findById(req.user._id).select('+phoneOtpCode +phoneOtpExpires');
  if (!user || user.phoneOtpCode !== otp || !user.phoneOtpExpires || user.phoneOtpExpires < new Date()) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  user.isPhoneVerified = true;
  user.phoneOtpCode = undefined;
  user.phoneOtpExpires = undefined;
  await user.save({ validateBeforeSave: false });
  res.json({ message: 'Phone verified' });
}

export async function updatePreferences(req, res) {
  const { darkMode, emailNotifications, smsNotifications } = req.body;
  const update = {};
  if (darkMode !== undefined) update['preferences.darkMode'] = darkMode;
  if (emailNotifications !== undefined) update['preferences.emailNotifications'] = emailNotifications;
  if (smsNotifications !== undefined) update['preferences.smsNotifications'] = smsNotifications;
  const user = await User.findByIdAndUpdate(req.user._id, { $set: update }, { new: true });
  res.json({ preferences: user.preferences });
}
