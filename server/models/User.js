import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['admin', 'patient', 'doctor', 'hospital_admin', 'center_admin', 'ambulance'],
      required: true,
    },
    phone: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    phoneOtpCode: { type: String, select: false },
    phoneOtpExpires: { type: Date, select: false },
    otpCode: { type: String, select: false },
    otpExpires: { type: Date, select: false },
    resetToken: { type: String, select: false },
    resetExpires: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    preferences: {
      darkMode: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
