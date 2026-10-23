import { Prescription } from '../models/Prescription.js';
import { Doctor } from '../models/Doctor.js';
import { Patient } from '../models/Patient.js';
import { notifyUser } from '../utils/notifications.js';

export async function createPrescription(req, res) {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only doctors can create prescriptions' });
  }
  const doc = req.user.role === 'doctor'
    ? await Doctor.findOne({ userId: req.user._id })
    : await Doctor.findById(req.body.doctorId);
  if (!doc) return res.status(400).json({ message: 'Doctor profile not found' });
  const { patientId, medications, notes } = req.body;
  if (!patientId || !medications?.length) {
    return res.status(400).json({ message: 'patientId and medications required' });
  }
  const prescription = await Prescription.create({ patientId, doctorId: doc._id, medications, notes });
  const patient = await Patient.findById(patientId);
  if (patient) {
    await notifyUser(patient.userId, {
      title: 'New Prescription',
      message: `A new prescription has been created by ${doc._id}.`,
      channels: ['in_app', 'email'],
    });
  }
  res.status(201).json(prescription);
}

export async function listPrescriptions(req, res) {
  let filter = {};
  if (req.user.role === 'patient') {
    const p = await Patient.findOne({ userId: req.user._id });
    if (!p) return res.json([]);
    filter = { patientId: p._id };
  } else if (req.user.role === 'doctor') {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.json([]);
    filter = { doctorId: doc._id };
  }
  const prescriptions = await Prescription.find(filter)
    .populate('patientId', 'age gender')
    .populate('doctorId')
    .sort({ createdAt: -1 });
  res.json(prescriptions);
}

export async function getPrescription(req, res) {
  const prescription = await Prescription.findById(req.params.id)
    .populate('patientId')
    .populate('doctorId');
  if (!prescription) return res.status(404).json({ message: 'Not found' });
  res.json(prescription);
}

export async function updatePrescription(req, res) {
  const prescription = await Prescription.findById(req.params.id);
  if (!prescription) return res.status(404).json({ message: 'Not found' });
  const { medications, notes, isActive } = req.body;
  if (medications) prescription.medications = medications;
  if (notes !== undefined) prescription.notes = notes;
  if (isActive !== undefined) prescription.isActive = isActive;
  await prescription.save();
  res.json(prescription);
}
