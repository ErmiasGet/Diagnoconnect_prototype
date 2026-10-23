import { DiagnosticCenter } from '../models/DiagnosticCenter.js';
import { Hospital } from '../models/Hospital.js';
import { Doctor } from '../models/Doctor.js';
import { User } from '../models/User.js';

export async function searchAll(req, res) {
  const { q, type, location, serviceType, page = 1, limit = 20 } = req.query;
  const skip = (Math.max(1, page) - 1) * Math.min(limit, 50);
  const maxLimit = Math.min(limit, 50);
  const results = { centers: [], hospitals: [], doctors: [] };

  if (!type || type === 'centers' || type === 'all') {
    const filter = { approvalStatus: 'approved' };
    if (q) {
      filter.$or = [
        { centerName: new RegExp(q, 'i') },
        { location: new RegExp(q, 'i') },
        { availableServices: new RegExp(q, 'i') },
      ];
    }
    if (location) filter.location = new RegExp(location, 'i');
    if (serviceType) filter.availableServices = new RegExp(serviceType, 'i');
    results.centers = await DiagnosticCenter.find(filter)
      .limit(maxLimit)
      .skip(skip)
      .lean();
  }

  if (!type || type === 'hospitals' || type === 'all') {
    const filter = { approvalStatus: 'approved' };
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { location: new RegExp(q, 'i') },
      ];
    }
    results.hospitals = await Hospital.find(filter)
      .limit(maxLimit)
      .skip(skip)
      .lean();
  }

  if (!type || type === 'doctors' || type === 'all') {
    const filter = {};
    if (q) {
      const users = await User.find({
        role: 'doctor',
        $or: [
          { fullName: new RegExp(q, 'i') },
          { email: new RegExp(q, 'i') },
        ],
      }).select('_id');
      const userIds = users.map((u) => u._id);
      filter.$or = [
        { userId: { $in: userIds } },
        { specialization: new RegExp(q, 'i') },
      ];
    }
    results.doctors = await Doctor.find(filter)
      .populate('userId', 'fullName email phone')
      .populate('hospitalId', 'name location')
      .limit(maxLimit)
      .skip(skip)
      .lean();
  }

  res.json(results);
}

export async function searchNearby(req, res) {
  const { lat, lng, maxDistance = 10000, type } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: 'lat and lng required' });
  const results = {};
  if (!type || type === 'centers') {
    results.centers = await DiagnosticCenter.find({ approvalStatus: 'approved' }).lean();
  }
  if (!type || type === 'hospitals') {
    results.hospitals = await Hospital.find({ approvalStatus: 'approved' }).lean();
  }
  res.json(results);
}
