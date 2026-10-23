import nodemailer from 'nodemailer';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
  return transporter;
}

export async function notifyUser(userId, { title, message, channels = ['in_app'] }) {
  const results = [];
  if (channels.includes('in_app')) {
    const n = await Notification.create({
      userId,
      title,
      message,
      channel: 'in_app',
    });
    results.push({ channel: 'in_app', id: n._id });
  }
  if (channels.includes('sms')) {
    console.log(`[SMS stub] to user ${userId}: ${title} — ${message}`);
    results.push({ channel: 'sms', ok: true });
  }
  if (channels.includes('email')) {
    const tp = getTransporter();
    const user = await User.findById(userId);
    if (tp && user?.email) {
      try {
        await tp.sendMail({
          from: process.env.SMTP_FROM || 'noreply@diagnoconnect.local',
          to: user.email,
          subject: title,
          text: message,
        });
        results.push({ channel: 'email', ok: true });
      } catch (e) {
        console.error('Email send failed', e.message);
        results.push({ channel: 'email', ok: false });
      }
    } else {
      console.log(`[Email stub] ${user?.email || userId}: ${title} — ${message}`);
      results.push({ channel: 'email', stub: true });
    }
  }
  return results;
}
