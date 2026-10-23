import mongoose from 'mongoose';

const ambulanceRequestSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', default: null },
    pickupAddress: { type: String, required: true },
    destinationAddress: { type: String, default: '' },
    status: {
      type: String,
      enum: ['requested', 'assigned', 'in_transit', 'completed', 'cancelled'],
      default: 'requested',
    },
    assignedProviderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const AmbulanceRequest = mongoose.model('AmbulanceRequest', ambulanceRequestSchema);
