import { Patient } from '../models/Patient.js';
import { User } from '../models/User.js';
import { EmergencyContact } from '../models/EmergencyContact.js';
import { MedicalRecord } from '../models/MedicalRecord.js';
import { Referral } from '../models/Referral.js';
import { Appointment } from '../models/Appointment.js';

export async function getMyPatient(req, res) {
  const p = await Patient.findOne({ userId: req.user._id })
    .populate('userId', 'fullName email phone')
    .populate('emergencyContacts');
  if (!p) return res.status(404).json({ message: 'Patient profile not found' });
  res.json(p);
}

export async function updateMyPatient(req, res) {
  const { age, gender, address, medicalHistory, photoUrl, bloodGroup, allergies, chronicConditions } = req.body;
  const p = await Patient.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { age, gender, address, medicalHistory, photoUrl, bloodGroup, allergies, chronicConditions } },
    { new: true }
  ).populate('emergencyContacts');
  if (!p) return res.status(404).json({ message: 'Patient profile not found' });
  if (req.body.fullName || req.body.phone) {
    await User.findByIdAndUpdate(req.user._id, {
      ...(req.body.fullName && { fullName: req.body.fullName }),
      ...(req.body.phone && { phone: req.body.phone }),
    });
  }
  res.json(p);
}

export async function getPatientById(req, res) {
  if (!['admin', 'doctor', 'hospital_admin', 'center_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const p = await Patient.findById(req.params.id)
    .populate('userId', 'fullName email phone')
    .populate('emergencyContacts');
  if (!p) return res.status(404).json({ message: 'Not found' });
  res.json(p);
}

export async function listPatients(req, res) {
  if (req.user.role === 'admin') {
    const list = await Patient.find().populate('userId', 'fullName email phone role').populate('emergencyContacts');
    return res.json(list);
  }
  if (req.user.role === 'doctor') {
    const doc = await (await import('../models/Doctor.js')).Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.json([]);
    const refs = await Referral.distinct('patientId', { doctorId: doc._id });
    const list = await Patient.find({ _id: { $in: refs } }).populate('userId', 'fullName email phone').populate('emergencyContacts');
    return res.json(list);
  }
  return res.status(403).json({ message: 'Forbidden' });
}

export async function getPatientReferrals(req, res) {
  const p = await Patient.findOne({ userId: req.user._id });
  if (!p) return res.json([]);
  const list = await Referral.find({ patientId: p._id })
    .populate('doctorId')
    .populate('recommendedCenterIds')
    .sort({ createdAt: -1 });
  res.json(list);
}

export async function getPatientAppointments(req, res) {
  const p = await Patient.findOne({ userId: req.user._id });
  if (!p) return res.json([]);
  const list = await Appointment.find({ patientId: p._id })
    .populate('centerId')
    .populate('doctorId')
    .sort({ appointmentDate: -1 });
  res.json(list);
}

export async function getPatientRecords(req, res) {
  const p = await Patient.findOne({ userId: req.user._id });
  if (!p) return res.json([]);
  const records = await MedicalRecord.find({ patientId: p._id })
    .populate('doctorId')
    .sort({ createdAt: -1 });
  res.json(records);
}

export async function createEmergencyContact(req, res) {
  const p = await Patient.findOne({ userId: req.user._id });
  if (!p) return res.status(404).json({ message: 'Patient profile not found' });
  const { name, relationship, phone, email, address } = req.body;
  if (!name || !phone) return res.status(400).json({ message: 'Name and phone required' });
  const contact = await EmergencyContact.create({ patientId: p._id, name, relationship, phone, email, address });
  p.emergencyContacts.push(contact._id);
  await p.save();
  res.status(201).json(contact);
}

export async function updateEmergencyContact(req, res) {
  const contact = await EmergencyContact.findByIdAndUpdate(
    req.params.contactId,
    { $set: req.body },
    { new: true }
  );
  if (!contact) return res.status(404).json({ message: 'Not found' });
  res.json(contact);
}

export async function deleteEmergencyContact(req, res) {
  const contact = await EmergencyContact.findByIdAndDelete(req.params.contactId);
  if (!contact) return res.status(404).json({ message: 'Not found' });
  await Patient.findOneAndUpdate(
    { emergencyContacts: contact._id },
    { $pull: { emergencyContacts: contact._id } }
  );
  res.json({ message: 'Deleted' });
}

export async function getPatientMedicalHistory(req, res) {
  const p = await Patient.findOne({ userId: req.user._id });
  if (!p) return res.json({ medicalHistory: [], allergies: [], chronicConditions: [] });
  res.json({
    medicalHistory: p.medicalHistory,
    allergies: p.allergies,
    chronicConditions: p.chronicConditions,
    bloodGroup: p.bloodGroup,
  });
}

export async function uploadPatientPhoto(req, res) {
  const p = await Patient.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { photoUrl: req.body.photoUrl } },
    { new: true }
  );
  if (!p) return res.status(404).json({ message: 'Patient profile not found' });
  res.json(p);
}
