import { AmbulanceRequest } from '../models/AmbulanceRequest.js';
import { Patient } from '../models/Patient.js';
import { Hospital } from '../models/Hospital.js';
import { User } from '../models/User.js';
import { notifyUser } from '../utils/notifications.js';

export async function createAmbulanceRequest(req, res) {
  const { pickupAddress, destinationAddress, hospitalId, notes } = req.body;
  let patientId = req.body.patientId;
  if (req.user.role === 'patient') {
    const p = await Patient.findOne({ userId: req.user._id });
    if (!p) return res.status(400).json({ message: 'Patient profile required' });
    patientId = p._id;
  } else if (req.user.role === 'hospital_admin' || req.user.role === 'doctor' || req.user.role === 'admin') {
    if (!patientId) return res.status(400).json({ message: 'patientId required' });
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const reqDoc = await AmbulanceRequest.create({
    patientId,
    hospitalId: hospitalId || null,
    pickupAddress,
    destinationAddress,
    notes,
    status: 'requested',
  });

  const providers = await User.find({ role: 'ambulance', isActive: true });
  for (const u of providers) {
    await notifyUser(u._id, {
      title: 'New ambulance request',
      message: `Pickup: ${pickupAddress}`,
      channels: ['in_app', 'email'],
    });
  }

  res.status(201).json(reqDoc);
}

export async function listAmbulanceRequests(req, res) {
  if (req.user.role === 'ambulance') {
    const all = await AmbulanceRequest.find({
      $or: [{ status: 'requested' }, { assignedProviderUserId: req.user._id }],
    })
      .populate('patientId')
      .populate('hospitalId')
      .sort({ createdAt: -1 });
    return res.json(all);
  }
  if (req.user.role === 'patient') {
    const p = await Patient.findOne({ userId: req.user._id });
    if (!p) return res.json([]);
    const list = await AmbulanceRequest.find({ patientId: p._id })
      .populate('hospitalId')
      .sort({ createdAt: -1 });
    return res.json(list);
  }
  if (req.user.role === 'admin' || req.user.role === 'hospital_admin') {
    let filter = {};
    if (req.user.role === 'hospital_admin') {
      const h = await Hospital.findOne({ adminUserId: req.user._id });
      if (h) filter = { hospitalId: h._id };
    }
    const list = await AmbulanceRequest.find(filter).populate('patientId').populate('hospitalId');
    return res.json(list);
  }
  return res.status(403).json({ message: 'Forbidden' });
}

export async function updateAmbulanceRequest(req, res) {
  const doc = await AmbulanceRequest.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: 'Not found' });

  if (req.user.role === 'ambulance') {
    const { status } = req.body;
    if (status === 'assigned' || status === 'in_transit' || status === 'completed' || status === 'cancelled') {
      if (status === 'assigned' && !doc.assignedProviderUserId) {
        doc.assignedProviderUserId = req.user._id;
      }
      if (doc.assignedProviderUserId && !doc.assignedProviderUserId.equals(req.user._id) && status !== 'cancelled') {
        return res.status(403).json({ message: 'Not assigned to you' });
      }
      doc.status = status;
    }
  } else if (req.user.role === 'admin') {
    if (req.body.status) doc.status = req.body.status;
    if (req.body.assignedProviderUserId) doc.assignedProviderUserId = req.body.assignedProviderUserId;
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await doc.save();
  const patient = await Patient.findById(doc.patientId);
  if (patient) {
    await notifyUser(patient.userId, {
      title: 'Ambulance status',
      message: `Status: ${doc.status}`,
      channels: ['in_app', 'sms'],
    });
  }
  res.json(doc);
}
