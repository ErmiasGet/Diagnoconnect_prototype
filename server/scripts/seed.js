import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Patient } from '../models/Patient.js';
import { Doctor } from '../models/Doctor.js';
import { Hospital } from '../models/Hospital.js';
import { DiagnosticCenter } from '../models/DiagnosticCenter.js';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/diagnoconnect';

async function run() {
  await mongoose.connect(uri);
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@diagnoconnect.local';
  const pass = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  let admin = await User.findOne({ email });
  if (!admin) {
    const hash = await bcrypt.hash(pass, 12);
    admin = await User.create({
      fullName: 'System Admin',
      email,
      password: hash,
      role: 'admin',
      phone: '',
      isVerified: true,
    });
    console.log('Created admin:', email, pass);
  } else {
    console.log('Admin already exists:', email);
  }

  const demoPatientEmail = 'patient@demo.local';
  if (!(await User.findOne({ email: demoPatientEmail }))) {
    const hash = await bcrypt.hash('Demo123!', 12);
    const u = await User.create({
      fullName: 'Demo Patient',
      email: demoPatientEmail,
      password: hash,
      role: 'patient',
      isVerified: true,
    });
    await Patient.create({ userId: u._id, age: 30, gender: 'male', address: 'Addis Ababa' });
    console.log('Demo patient:', demoPatientEmail, 'Demo123!');
  }

  const demoDoctorEmail = 'doctor@demo.local';
  if (!(await User.findOne({ email: demoDoctorEmail }))) {
    const h = await Hospital.create({
      name: 'Demo Hospital',
      location: 'Addis Ababa',
      approvalStatus: 'approved',
    });
    const hash = await bcrypt.hash('Demo123!', 12);
    const u = await User.create({
      fullName: 'Demo Doctor',
      email: demoDoctorEmail,
      password: hash,
      role: 'doctor',
      isVerified: true,
    });
    await Doctor.create({
      userId: u._id,
      specialization: 'General',
      hospitalId: h._id,
      licenseNumber: 'ETH-DEMO-1',
    });
    console.log('Demo doctor:', demoDoctorEmail, 'Demo123!');
  }

  const centerEmail = 'center@demo.local';
  if (!(await User.findOne({ email: centerEmail }))) {
    const hash = await bcrypt.hash('Demo123!', 12);
    const u = await User.create({
      fullName: 'Demo Center Admin',
      email: centerEmail,
      password: hash,
      role: 'center_admin',
      isVerified: true,
    });
    await DiagnosticCenter.create({
      centerName: 'Demo Diagnostic Center',
      location: 'Addis Ababa',
      availableServices: ['Lab', 'X-Ray', 'MRI'],
      adminUserId: u._id,
      approvalStatus: 'approved',
    });
    console.log('Demo center admin:', centerEmail, 'Demo123!');
  }

  const ambEmail = 'ambulance@demo.local';
  if (!(await User.findOne({ email: ambEmail }))) {
    const hash = await bcrypt.hash('Demo123!', 12);
    await User.create({
      fullName: 'Demo Ambulance',
      email: ambEmail,
      password: hash,
      role: 'ambulance',
      isVerified: true,
    });
    console.log('Demo ambulance:', ambEmail, 'Demo123!');
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
