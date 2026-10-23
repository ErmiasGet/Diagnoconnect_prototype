import { Appointment } from '../models/Appointment.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import { DiagnosticCenter } from '../models/DiagnosticCenter.js';
import { notifyUser } from '../utils/notifications.js';

async function resolvePatientId(user) {
  if (user.role === 'patient') {
    const p = await Patient.findOne({ userId: user._id });
    return p?._id;
  }
  return null;
}

export async function listAppointments(req, res) {
  const user = req.user;
  let filter = {};
  if (user.role === 'patient') {
    const pid = await resolvePatientId(user);
    if (!pid) return res.json([]);
    filter = { patientId: pid };
  } else if (user.role === 'doctor') {
    const doc = await Doctor.findOne({ userId: user._id });
    if (!doc) return res.json([]);
    filter = { doctorId: doc._id };
  } else if (user.role === 'center_admin') {
    const c = await DiagnosticCenter.findOne({ adminUserId: user._id });
    if (!c) return res.json([]);
    filter = { centerId: c._id };
  } else if (user.role === 'admin') {
    filter = {};
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const list = await Appointment.find(filter)
    .populate('patientId')
    .populate('doctorId')
    .populate('centerId')
    .sort({ appointmentDate: -1 });
  res.json(list);
}

export async function createAppointment(req, res) {
  const { centerId, appointmentDate, serviceType, notes, patientId: bodyPatientId } = req.body;
  const center = await DiagnosticCenter.findById(centerId);
  if (!center || center.approvalStatus !== 'approved') {
    return res.status(400).json({ message: 'Invalid or unapproved diagnostic center' });
  }

  let patientId = bodyPatientId;
  let doctorId = null;

  if (req.user.role === 'patient') {
    const p = await Patient.findOne({ userId: req.user._id });
    if (!p) return res.status(400).json({ message: 'Patient profile required' });
    patientId = p._id;
  } else if (req.user.role === 'doctor') {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.status(400).json({ message: 'Doctor profile required' });
    doctorId = doc._id;
    if (!patientId) return res.status(400).json({ message: 'patientId required for doctor booking' });
  } else if (req.user.role === 'admin') {
    if (!patientId) return res.status(400).json({ message: 'patientId required' });
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const appt = await Appointment.create({
    patientId,
    doctorId,
    centerId,
    appointmentDate,
    serviceType,
    notes,
    status: 'pending',
  });

  const patientUser = await Patient.findById(patientId);
  if (patientUser) {
    await notifyUser(patientUser.userId, {
      title: 'Appointment booked',
      message: `Appointment scheduled for ${new Date(appointmentDate).toLocaleString()}.`,
      channels: ['in_app', 'email', 'sms'],
    });
  }

  const populated = await appt.populate(['patientId', 'doctorId', 'centerId']);
  res.status(201).json(populated);
}

export async function updateAppointment(req, res) {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: 'Not found' });

  if (req.user.role === 'patient') {
    const p = await Patient.findOne({ userId: req.user._id });
    if (!p || !appt.patientId.equals(p._id)) return res.status(403).json({ message: 'Forbidden' });
  } else if (req.user.role === 'doctor') {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.status(403).json({ message: 'Forbidden' });
    if (!appt.doctorId || !appt.doctorId.equals(doc._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
  } else if (req.user.role === 'center_admin') {
    const c = await DiagnosticCenter.findOne({ adminUserId: req.user._id });
    if (!c || !appt.centerId.equals(c._id)) return res.status(403).json({ message: 'Forbidden' });
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { appointmentDate, status, notes, serviceType } = req.body;
  if (appointmentDate) appt.appointmentDate = appointmentDate;
  if (status) appt.status = status;
  if (notes !== undefined) appt.notes = notes;
  if (serviceType !== undefined) appt.serviceType = serviceType;
  await appt.save();

  const patient = await Patient.findById(appt.patientId);
  if (patient) {
    await notifyUser(patient.userId, {
      title: 'Appointment updated',
      message: `Your appointment was updated (status: ${appt.status}).`,
      channels: ['in_app', 'email'],
    });
  }

  res.json(await appt.populate(['patientId', 'doctorId', 'centerId']));
}

export async function deleteAppointment(req, res) {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: 'Not found' });
  if (req.user.role === 'patient') {
    const p = await Patient.findOne({ userId: req.user._id });
    if (!p || !appt.patientId.equals(p._id)) return res.status(403).json({ message: 'Forbidden' });
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await appt.deleteOne();
  res.json({ message: 'Deleted' });
}
