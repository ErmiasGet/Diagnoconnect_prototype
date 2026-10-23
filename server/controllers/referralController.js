import { Referral } from '../models/Referral.js';
import { Doctor } from '../models/Doctor.js';
import { Patient } from '../models/Patient.js';
import { DiagnosticCenter } from '../models/DiagnosticCenter.js';
import { notifyUser } from '../utils/notifications.js';

export async function listReferrals(req, res) {
  let filter = {};
  if (req.user.role === 'doctor') {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.json([]);
    filter = { doctorId: doc._id };
  } else if (req.user.role === 'patient') {
    const p = await Patient.findOne({ userId: req.user._id });
    if (!p) return res.json([]);
    filter = { patientId: p._id };
  } else if (req.user.role === 'admin' || req.user.role === 'hospital_admin') {
    filter = {};
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const list = await Referral.find(filter)
    .populate('patientId')
    .populate('doctorId')
    .populate('recommendedCenterIds')
    .sort({ createdAt: -1 });
  res.json(list);
}

export async function createReferral(req, res) {
  if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only doctors can create referrals' });
  }
  const doc =
    req.user.role === 'doctor'
      ? await Doctor.findOne({ userId: req.user._id })
      : await Doctor.findById(req.body.doctorId);
  if (!doc) return res.status(400).json({ message: 'Doctor profile not found' });

  const {
    patientId,
    diagnosisType,
    recommendedCenterIds,
    diagnosticRequestNotes,
    attachmentUrl,
  } = req.body;

  const ref = await Referral.create({
    patientId,
    doctorId: doc._id,
    diagnosisType,
    recommendedCenterIds: recommendedCenterIds || [],
    diagnosticRequestNotes,
    attachmentUrl,
    referralStatus: 'submitted',
  });

  const patient = await Patient.findById(patientId);
  if (patient) {
    await notifyUser(patient.userId, {
      title: 'New referral',
      message: `A referral was submitted for ${diagnosisType}.`,
      channels: ['in_app', 'email', 'sms'],
    });
  }

  res.status(201).json(await ref.populate(['patientId', 'doctorId', 'recommendedCenterIds']));
}

export async function updateReferral(req, res) {
  const ref = await Referral.findById(req.params.id);
  if (!ref) return res.status(404).json({ message: 'Not found' });

  if (req.user.role === 'doctor') {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc || !ref.doctorId.equals(doc._id)) return res.status(403).json({ message: 'Forbidden' });
  } else if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { referralStatus, diagnosisType, recommendedCenterIds, diagnosticRequestNotes, attachmentUrl } =
    req.body;
  if (referralStatus) ref.referralStatus = referralStatus;
  if (diagnosisType) ref.diagnosisType = diagnosisType;
  if (recommendedCenterIds) ref.recommendedCenterIds = recommendedCenterIds;
  if (diagnosticRequestNotes !== undefined) ref.diagnosticRequestNotes = diagnosticRequestNotes;
  if (attachmentUrl !== undefined) ref.attachmentUrl = attachmentUrl;
  await ref.save();

  const patient = await Patient.findById(ref.patientId);
  if (patient) {
    await notifyUser(patient.userId, {
      title: 'Referral updated',
      message: `Referral status: ${ref.referralStatus}`,
      channels: ['in_app', 'email'],
    });
  }

  res.json(await ref.populate(['patientId', 'doctorId', 'recommendedCenterIds']));
}

export async function recommendCenters(req, res) {
  const { diagnosisType, location } = req.query;
  const filter = { approvalStatus: 'approved' };
  if (location) filter.location = new RegExp(location, 'i');
  let centers = await DiagnosticCenter.find(filter);
  if (diagnosisType) {
    const dt = diagnosisType.toLowerCase();
    centers = centers.filter((c) =>
      c.availableServices.some((s) => s.toLowerCase().includes(dt))
    );
  }
  res.json(centers);
}
