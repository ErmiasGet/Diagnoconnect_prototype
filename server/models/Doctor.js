import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: String, default: '' },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    licenseNumber: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);
