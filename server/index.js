import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import routes from './routes/index.js';
import { connectDB } from './config/db.js';

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'DiagnoConnect API' }));
app.use('/api', routes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.warn('Warning: JWT_SECRET and JWT_REFRESH_SECRET should be set in production');
}
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = 'dev_jwt_secret_change_me';
if (!process.env.JWT_REFRESH_SECRET) process.env.JWT_REFRESH_SECRET = 'dev_jwt_refresh_change_me';

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
  })
  .catch((e) => {
    console.error('DB connection failed', e);
    process.exit(1);
  });
