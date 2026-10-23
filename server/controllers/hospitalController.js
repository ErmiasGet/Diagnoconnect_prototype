import { Hospital } from '../models/Hospital.js';
import { User } from '../models/User.js';

export async function getMyHospital(req, res) {
  const h = await Hospital.findOne({ adminUserId: req.user._id });
  if (!h) return res.status(404).json({ message: 'Hospital not found' });
  res.json(h);
}

export async function updateMyHospital(req, res) {
  const { name, location, contactPhone } = req.body;
  const h = await Hospital.findOneAndUpdate(
    { adminUserId: req.user._id },
    { $set: { name, location, contactPhone } },
    { new: true }
  );
  if (!h) return res.status(404).json({ message: 'Hospital not found' });
  res.json(h);
}

export async function listHospitals(req, res) {
  const filter = req.user.role === 'admin' ? {} : { approvalStatus: 'approved' };
  const list = await Hospital.find(filter);
  res.json(list);
}
