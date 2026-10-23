import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
    address: { type: String, default: '' },
    medicalHistory: [{ type: String }],
    photoUrl: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    emergencyContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EmergencyContact' }],
  },
  { timestamps: true }
);

export const Patient = mongoose.model('Patient', patientSchema);
