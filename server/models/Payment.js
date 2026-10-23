import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'ETB' },
    paymentMethod: {
      type: String,
      enum: ['telebirr', 'mobile_banking', 'bank_transfer', 'card', 'cash'],
      default: 'telebirr',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    reference: { type: String, default: '' },
    description: { type: String, default: '' },
    invoiceNumber: { type: String, default: '' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
