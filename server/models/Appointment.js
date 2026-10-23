import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', default: null },
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'DiagnosticCenter', required: true },
    appointmentDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
      default: 'pending',
    },
    serviceType: { type: String, default: '' },
    notes: { type: String, default: '' },
    diagnosticResultUrl: { type: String, default: '' },
    diagnosticResultNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);
