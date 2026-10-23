import { DiagnosticCenter } from '../models/DiagnosticCenter.js';
import { User } from '../models/User.js';

export async function listCenters(req, res) {
  const { search, approvedOnly } = req.query;
  const filter = {};
  if (approvedOnly !== 'false') filter.approvalStatus = 'approved';
  if (search) {
    filter.$or = [
      { centerName: new RegExp(search, 'i') },
      { location: new RegExp(search, 'i') },
    ];
  }
  const centers = await DiagnosticCenter.find(filter).populate('adminUserId', 'fullName email phone');
  res.json(centers);
}

export async function getMyCenter(req, res) {
  const c = await DiagnosticCenter.findOne({ adminUserId: req.user._id });
  if (!c) return res.status(404).json({ message: 'Center not found' });
  res.json(c);
}

export async function updateMyCenter(req, res) {
  const { centerName, location, contactPhone, availableServices, scheduleNotes } = req.body;
  const c = await DiagnosticCenter.findOneAndUpdate(
    { adminUserId: req.user._id },
    { $set: { centerName, location, contactPhone, availableServices, scheduleNotes } },
    { new: true }
  );
  if (!c) return res.status(404).json({ message: 'Center not found' });
  res.json(c);
}

export async function updateAppointmentStatusForCenter(req, res) {
  const center = await DiagnosticCenter.findOne({ adminUserId: req.user._id });
  if (!center) return res.status(404).json({ message: 'Center not found' });
  const { Appointment } = await import('../models/Appointment.js');
  const appt = await Appointment.findOne({ _id: req.params.appointmentId, centerId: center._id });
  if (!appt) return res.status(404).json({ message: 'Appointment not found' });
  const { status, diagnosticResultUrl, diagnosticResultNotes } = req.body;
  if (status) appt.status = status;
  if (diagnosticResultUrl !== undefined) appt.diagnosticResultUrl = diagnosticResultUrl;
  if (diagnosticResultNotes !== undefined) appt.diagnosticResultNotes = diagnosticResultNotes;
  await appt.save();
  const { notifyUser } = await import('../utils/notifications.js');
  const patient = await import('../models/Patient.js').then((m) => m.Patient.findById(appt.patientId));
  if (patient) {
    await notifyUser(patient.userId, {
      title: 'Appointment update',
      message: `Your appointment status is now ${appt.status}.`,
      channels: ['in_app', 'email'],
    });
  }
  res.json(appt);
}

export async function getCenterAppointments(req, res) {
  const center = await DiagnosticCenter.findOne({ adminUserId: req.user._id });
  if (!center) return res.status(404).json({ message: 'Center not found' });
  const { Appointment } = await import('../models/Appointment.js');
  const list = await Appointment.find({ centerId: center._id })
    .populate('patientId')
    .populate('doctorId')
    .sort({ appointmentDate: -1 });
  res.json(list);
}
