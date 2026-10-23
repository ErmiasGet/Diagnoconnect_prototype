import mongoose from 'mongoose';

const diagnosticCenterSchema = new mongoose.Schema(
  {
    centerName: { type: String, required: true },
    location: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    availableServices: [{ type: String }],
    adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    scheduleNotes: { type: String, default: '' },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const DiagnosticCenter = mongoose.model('DiagnosticCenter', diagnosticCenterSchema);
