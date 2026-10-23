import { Notification } from '../models/Notification.js';

export async function listNotifications(req, res) {
  const list = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(200);
  res.json(list);
}

export async function markRead(req, res) {
  await Notification.updateMany(
    { userId: req.user._id, _id: { $in: req.body.ids || [] } },
    { $set: { read: true } }
  );
  res.json({ message: 'Updated' });
}

export async function markAllRead(req, res) {
  await Notification.updateMany({ userId: req.user._id }, { $set: { read: true } });
  res.json({ message: 'Updated' });
}
