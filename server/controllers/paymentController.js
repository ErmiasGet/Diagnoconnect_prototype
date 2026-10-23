import { Payment } from '../models/Payment.js';

function generateInvoice() {
  return 'INV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export async function createPayment(req, res) {
  const { amount, paymentMethod, description, reference } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
  const payment = await Payment.create({
    userId: req.user._id,
    amount,
    paymentMethod: paymentMethod || 'telebirr',
    description: description || '',
    reference: reference || '',
    status: 'pending',
    invoiceNumber: generateInvoice(),
  });
  res.status(201).json(payment);
}

export async function listPayments(req, res) {
  let filter = {};
  if (req.user.role === 'patient' || req.user.role === 'doctor' || req.user.role === 'hospital_admin' || req.user.role === 'center_admin') {
    filter = { userId: req.user._id };
  }
  const payments = await Payment.find(filter).sort({ createdAt: -1 });
  res.json(payments);
}

export async function getPayment(req, res) {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Not found' });
  if (payment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(payment);
}

export async function updatePaymentStatus(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const { status, reference } = req.body;
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    { $set: { status, reference } },
    { new: true }
  );
  if (!payment) return res.status(404).json({ message: 'Not found' });
  res.json(payment);
}

export async function getRevenueSummary(req, res) {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  const summary = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
  ]);
  const byMethod = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);
  const monthly = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  res.json({ summary: summary[0] || { totalRevenue: 0, count: 0 }, byMethod, monthly });
}

export async function processPayment(req, res) {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Not found' });
  if (payment.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  payment.status = 'completed';
  payment.reference = 'TXR-' + Date.now();
  await payment.save();
  res.json(payment);
}
