import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Hospital = mongoose.model('Hospital', hospitalSchema);
