import { Review } from '../models/Review.js';
import { DiagnosticCenter } from '../models/DiagnosticCenter.js';
import { Hospital } from '../models/Hospital.js';
import { Doctor } from '../models/Doctor.js';

export async function createReview(req, res) {
  const { targetType, targetId, rating, comment } = req.body;
  if (!targetType || !targetId || !rating) {
    return res.status(400).json({ message: 'targetType, targetId, and rating required' });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be 1-5' });
  }
  const existing = await Review.findOne({ userId: req.user._id, targetType, targetId });
  if (existing) {
    existing.rating = rating;
    existing.comment = comment || existing.comment;
    await existing.save();
    return res.json(existing);
  }
  const review = await Review.create({
    userId: req.user._id,
    targetType,
    targetId,
    rating,
    comment: comment || '',
    isApproved: req.user.role === 'admin',
  });
  res.status(201).json(review);
}

export async function listReviews(req, res) {
  const { targetType, targetId } = req.query;
  const filter = {};
  if (targetType) filter.targetType = targetType;
  if (targetId) filter.targetId = targetId;
  if (req.user.role !== 'admin') filter.isApproved = true;
  const reviews = await Review.find(filter)
    .populate('userId', 'fullName')
    .sort({ createdAt: -1 });
  res.json(reviews);
}

export async function getRatingStats(req, res) {
  const { targetType, targetId } = req.query;
  const match = { isApproved: true };
  if (targetType) match.targetType = targetType;
  if (targetId) match.targetId = targetId;
  const stats = await Review.aggregate([
    { $match: match },
    { $group: { _id: '$targetId', averageRating: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  res.json(stats);
}

export async function approveReview(req, res) {
  const review = await Review.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  );
  if (!review) return res.status(404).json({ message: 'Not found' });
  res.json(review);
}

export async function deleteReview(req, res) {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Not found' });
  await review.deleteOne();
  res.json({ message: 'Deleted' });
}
