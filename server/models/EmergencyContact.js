import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    name: { type: String, required: true },
    relationship: { type: String, default: '' },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { timestamps: true }
);

export const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);
