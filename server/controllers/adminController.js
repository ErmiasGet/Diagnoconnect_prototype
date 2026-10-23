import { User } from '../models/User.js';
import { Hospital } from '../models/Hospital.js';
import { DiagnosticCenter } from '../models/DiagnosticCenter.js';
import { notifyUser } from '../utils/notifications.js';

export async function listUsers(req, res) {
  const users = await User.find().select('-password -refreshToken -otpCode -resetToken').sort({ createdAt: -1 });
  res.json(users);
}

export async function setUserActive(req, res) {
  const u = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }).select(
    '-password'
  );
  if (!u) return res.status(404).json({ message: 'Not found' });
  res.json(u);
}

export async function setUserRole(req, res) {
  const { role } = req.body;
  if (!['admin', 'patient', 'doctor', 'hospital_admin', 'center_admin', 'ambulance'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!u) return res.status(404).json({ message: 'Not found' });
  res.json(u);
}

export async function pendingInstitutions(req, res) {
  const hospitals = await Hospital.find({ approvalStatus: 'pending' });
  const centers = await DiagnosticCenter.find({ approvalStatus: 'pending' });
  res.json({ hospitals, centers });
}

export async function approveHospital(req, res) {
  const h = await Hospital.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: req.body.status || 'approved' },
    { new: true }
  );
  if (!h) return res.status(404).json({ message: 'Not found' });
  if (h.adminUserId) {
    await notifyUser(h.adminUserId, {
      title: 'Hospital approval',
      message: `Your hospital "${h.name}" is ${h.approvalStatus}.`,
      channels: ['in_app', 'email'],
    });
  }
  res.json(h);
}

export async function approveCenter(req, res) {
  const c = await DiagnosticCenter.findByIdAndUpdate(
    req.params.id,
    { approvalStatus: req.body.status || 'approved' },
    { new: true }
  );
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (c.adminUserId) {
    await notifyUser(c.adminUserId, {
      title: 'Diagnostic center approval',
      message: `Your center "${c.centerName}" is ${c.approvalStatus}.`,
      channels: ['in_app', 'email'],
    });
  }
  res.json(c);
}

export async function systemSettings(req, res) {
  res.json({
    maintenanceMode: false,
    smsProvider: process.env.SMS_PROVIDER || 'console',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  });
}

export async function auditLog(req, res) {
  res.json({
    message: 'Demo audit log — persist to a collection in production',
    events: [],
  });
}

export async function fullReport(req, res) {
  const { User } = await import('../models/User.js');
  const { Patient } = await import('../models/Patient.js');
  const { Doctor } = await import('../models/Doctor.js');
  const { Hospital } = await import('../models/Hospital.js');
  const { DiagnosticCenter } = await import('../models/DiagnosticCenter.js');
  const { Referral } = await import('../models/Referral.js');
  const { Appointment } = await import('../models/Appointment.js');
  const { Payment } = await import('../models/Payment.js');

  const [
    totalUsers, totalPatients, totalDoctors, totalHospitals, totalCenters,
    totalReferrals, totalAppointments,
    activeUsers, pendingHospitals, pendingCenters,
  ] = await Promise.all([
    User.countDocuments(),
    Patient.countDocuments(),
    Doctor.countDocuments(),
    Hospital.countDocuments(),
    DiagnosticCenter.countDocuments(),
    Referral.countDocuments(),
    Appointment.countDocuments(),
    User.countDocuments({ isActive: true }),
    Hospital.countDocuments({ approvalStatus: 'pending' }),
    DiagnosticCenter.countDocuments({ approvalStatus: 'pending' }),
  ]);

  const referralStatuses = await Referral.aggregate([
    { $group: { _id: '$referralStatus', count: { $sum: 1 } } },
  ]);
  const appointmentStatuses = await Appointment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const usersByRole = await User.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } },
  ]);
  const patientsByGender = await Patient.aggregate([
    { $group: { _id: '$gender', count: { $sum: 1 } } },
  ]);
  const monthlyReferrals = await Referral.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  const monthlyAppointments = await Appointment.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    overview: { totalUsers, totalPatients, totalDoctors, totalHospitals, totalCenters, totalReferrals, totalAppointments, activeUsers },
    pending: { hospitals: pendingHospitals, centers: pendingCenters },
    referralStatuses,
    appointmentStatuses,
    usersByRole,
    patientsByGender,
    monthlyReferrals,
    monthlyAppointments,
  });
}
