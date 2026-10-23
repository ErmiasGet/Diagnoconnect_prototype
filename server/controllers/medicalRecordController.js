import { MedicalRecord } from '../models/MedicalRecord.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';

export async function listRecords(req, res) {
  let filter = {};
  if (req.user.role === 'patient') {
    const p = await Patient.findOne({ userId: req.user._id });
    if (!p) return res.json([]);
    filter = { patientId: p._id };
  } else if (req.user.role === 'doctor') {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.json([]);
    filter = { $or: [{ doctorId: doc._id }, { sharedWith: doc._id }, { isShared: true }] };
  } else if (req.user.role === 'admin') {
    filter = {};
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const records = await MedicalRecord.find(filter)
    .populate('patientId', 'age gender')
    .populate('doctorId')
    .sort({ createdAt: -1 });
  res.json(records);
}

export async function createRecord(req, res) {
  const { patientId, recordType, title, description, fileUrl, fileName, fileSize, mimeType, tags } = req.body;
  let doctorId = null;
  if (req.user.role === 'doctor') {
    const doc = await Doctor.findOne({ userId: req.user._id });
    if (!doc) return res.status(400).json({ message: 'Doctor profile required' });
    doctorId = doc._id;
  }
  if (!patientId) return res.status(400).json({ message: 'patientId required' });
  const record = await MedicalRecord.create({
    patientId,
    doctorId,
    recordType,
    title,
    description,
    fileUrl,
    fileName,
    fileSize,
    mimeType,
    tags: tags || [],
  });
  res.status(201).json(record);
}

export async function getRecord(req, res) {
  const record = await MedicalRecord.findById(req.params.id)
    .populate('patientId')
    .populate('doctorId')
    .populate('sharedWith');
  if (!record) return res.status(404).json({ message: 'Not found' });
  res.json(record);
}

export async function updateRecord(req, res) {
  const record = await MedicalRecord.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Not found' });
  const { title, description, tags, isShared, sharedWith } = req.body;
  if (title !== undefined) record.title = title;
  if (description !== undefined) record.description = description;
  if (tags !== undefined) record.tags = tags;
  if (isShared !== undefined) record.isShared = isShared;
  if (sharedWith !== undefined) record.sharedWith = sharedWith;
  await record.save();
  res.json(record);
}

export async function deleteRecord(req, res) {
  const record = await MedicalRecord.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Not found' });
  await record.deleteOne();
  res.json({ message: 'Deleted' });
}

export async function shareRecord(req, res) {
  const { doctorIds } = req.body;
  const record = await MedicalRecord.findById(req.params.id);
  if (!record) return res.status(404).json({ message: 'Not found' });
  const existing = record.sharedWith.map((id) => id.toString());
  for (const docId of doctorIds || []) {
    if (!existing.includes(docId)) {
      record.sharedWith.push(docId);
    }
  }
  record.isShared = true;
  await record.save();
  res.json(record);
}
