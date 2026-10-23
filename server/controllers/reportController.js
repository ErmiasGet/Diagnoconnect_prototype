import { Referral } from '../models/Referral.js';
import { Appointment } from '../models/Appointment.js';
import { Patient } from '../models/Patient.js';
import { User } from '../models/User.js';
import { DiagnosticCenter } from '../models/DiagnosticCenter.js';

export async function summary(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const [users, patients, referrals, appointments, centers] = await Promise.all([
    User.countDocuments(),
    Patient.countDocuments(),
    Referral.countDocuments(),
    Appointment.countDocuments(),
    DiagnosticCenter.countDocuments({ approvalStatus: 'approved' }),
  ]);

  const referralsByStatus = await Referral.aggregate([
    { $group: { _id: '$referralStatus', count: { $sum: 1 } } },
  ]);

  const appointmentsByStatus = await Appointment.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json({
    users,
    patients,
    referrals,
    appointments,
    approvedCenters: centers,
    referralsByStatus,
    appointmentsByStatus,
  });
}

export async function patientReport(req, res) {
  if (!['admin', 'doctor'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  const { patientId } = req.params;
  const { Patient } = await import('../models/Patient.js');
  const p = await Patient.findById(patientId).populate('userId');
  if (!p) return res.status(404).json({ message: 'Not found' });
  const refs = await Referral.find({ patientId }).populate('doctorId');
  const apps = await Appointment.find({ patientId }).populate('centerId');
  res.json({ patient: p, referrals: refs, appointments: apps });
}
