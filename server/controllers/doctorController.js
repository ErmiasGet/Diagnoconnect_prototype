import { Doctor } from '../models/Doctor.js';
import { User } from '../models/User.js';

export async function getMyDoctor(req, res) {
  const d = await Doctor.findOne({ userId: req.user._id }).populate('hospitalId').populate('userId', 'fullName email phone');
  if (!d) return res.status(404).json({ message: 'Doctor profile not found' });
  res.json(d);
}

export async function updateMyDoctor(req, res) {
  const { specialization, licenseNumber, hospitalId } = req.body;
  const d = await Doctor.findOneAndUpdate(
    { userId: req.user._id },
    { $set: { specialization, licenseNumber, hospitalId } },
    { new: true }
  ).populate('hospitalId');
  if (!d) return res.status(404).json({ message: 'Doctor profile not found' });
  if (req.body.fullName || req.body.phone) {
    await User.findByIdAndUpdate(req.user._id, {
      ...(req.body.fullName && { fullName: req.body.fullName }),
      ...(req.body.phone && { phone: req.body.phone }),
    });
  }
  res.json(d);
}

export async function listDoctors(req, res) {
  const doctors = await Doctor.find()
    .populate('userId', 'fullName email phone')
    .populate('hospitalId');
  res.json(doctors);
}
