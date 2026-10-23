import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    diagnosisType: { type: String, required: true },
    referralStatus: {
      type: String,
      enum: ['submitted', 'in_progress', 'completed', 'cancelled'],
      default: 'submitted',
    },
    recommendedCenterIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'DiagnosticCenter' }],
    diagnosticRequestNotes: { type: String, default: '' },
    attachmentUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Referral = mongoose.model('Referral', referralSchema);
