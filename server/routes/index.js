import { Router } from 'express';
import {
  register,
  registerValidators,
  login,
  loginValidators,
  logout,
  refresh,
  forgotPassword,
  forgotValidators,
  resetPassword,
  resetValidators,
  verifyOtp,
  verifyOtpValidators,
  me,
  sendPhoneOtp,
  verifyPhoneOtp,
  updatePreferences,
} from '../controllers/authController.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';
import { requireRoles } from '../middleware/role.js';
import * as patients from '../controllers/patientController.js';
import * as doctors from '../controllers/doctorController.js';
import * as hospitals from '../controllers/hospitalController.js';
import * as centers from '../controllers/centerController.js';
import * as appointments from '../controllers/appointmentController.js';
import * as referrals from '../controllers/referralController.js';
import * as ambulance from '../controllers/ambulanceController.js';
import * as notifications from '../controllers/notificationController.js';
import * as reports from '../controllers/reportController.js';
import * as admin from '../controllers/adminController.js';
import * as medicalRecords from '../controllers/medicalRecordController.js';
import * as reviews from '../controllers/reviewController.js';
import * as payments from '../controllers/paymentController.js';
import * as search from '../controllers/searchController.js';
import * as prescriptions from '../controllers/prescriptionController.js';

const r = Router();

// ─── Auth ───
r.post('/auth/register', registerValidators, register);
r.post('/auth/login', loginValidators, login);
r.post('/auth/refresh', refresh);
r.post('/auth/forgot-password', forgotValidators, forgotPassword);
r.post('/auth/reset-password', resetValidators, resetPassword);
r.post('/auth/verify-otp', verifyOtpValidators, verifyOtp);
r.get('/auth/me', authMiddleware, me);
r.post('/auth/logout', authMiddleware, logout);
r.post('/auth/send-phone-otp', authMiddleware, sendPhoneOtp);
r.post('/auth/verify-phone-otp', authMiddleware, verifyPhoneOtp);
r.patch('/auth/preferences', authMiddleware, updatePreferences);

// ─── Patients ───
r.get('/patients/me', authMiddleware, requireRoles('patient'), patients.getMyPatient);
r.patch('/patients/me', authMiddleware, requireRoles('patient'), patients.updateMyPatient);
r.post('/patients/me/photo', authMiddleware, requireRoles('patient'), patients.uploadPatientPhoto);
r.get('/patients/me/referrals', authMiddleware, requireRoles('patient'), patients.getPatientReferrals);
r.get('/patients/me/appointments', authMiddleware, requireRoles('patient'), patients.getPatientAppointments);
r.get('/patients/me/records', authMiddleware, requireRoles('patient'), patients.getPatientRecords);
r.get('/patients/me/medical-history', authMiddleware, requireRoles('patient'), patients.getPatientMedicalHistory);
r.post('/patients/me/emergency-contacts', authMiddleware, requireRoles('patient'), patients.createEmergencyContact);
r.patch('/patients/me/emergency-contacts/:contactId', authMiddleware, requireRoles('patient'), patients.updateEmergencyContact);
r.delete('/patients/me/emergency-contacts/:contactId', authMiddleware, requireRoles('patient'), patients.deleteEmergencyContact);
r.get('/patients', authMiddleware, patients.listPatients);
r.get('/patients/:id', authMiddleware, patients.getPatientById);

// ─── Doctors ───
r.get('/doctors/me', authMiddleware, requireRoles('doctor'), doctors.getMyDoctor);
r.patch('/doctors/me', authMiddleware, requireRoles('doctor'), doctors.updateMyDoctor);
r.get('/doctors', authMiddleware, doctors.listDoctors);

// ─── Hospitals ───
r.get('/hospitals', authMiddleware, hospitals.listHospitals);
r.get('/hospitals/me', authMiddleware, requireRoles('hospital_admin'), hospitals.getMyHospital);
r.patch('/hospitals/me', authMiddleware, requireRoles('hospital_admin'), hospitals.updateMyHospital);

// ─── Diagnostic Centers ───
r.get('/centers', authMiddleware, centers.listCenters);
r.get('/centers/me', authMiddleware, requireRoles('center_admin'), centers.getMyCenter);
r.patch('/centers/me', authMiddleware, requireRoles('center_admin'), centers.updateMyCenter);
r.get('/centers/me/appointments', authMiddleware, requireRoles('center_admin'), centers.getCenterAppointments);
r.patch('/centers/me/appointments/:appointmentId', authMiddleware, requireRoles('center_admin'), centers.updateAppointmentStatusForCenter);

// ─── Appointments ───
r.get('/appointments', authMiddleware, appointments.listAppointments);
r.post('/appointments', authMiddleware, appointments.createAppointment);
r.put('/appointments/:id', authMiddleware, appointments.updateAppointment);
r.delete('/appointments/:id', authMiddleware, appointments.deleteAppointment);

// ─── Referrals ───
r.get('/referrals/recommend-centers', authMiddleware, referrals.recommendCenters);
r.get('/referrals', authMiddleware, referrals.listReferrals);
r.post('/referrals', authMiddleware, referrals.createReferral);
r.put('/referrals/:id', authMiddleware, referrals.updateReferral);

// ─── Ambulance ───
r.post('/ambulance', authMiddleware, ambulance.createAmbulanceRequest);
r.get('/ambulance', authMiddleware, ambulance.listAmbulanceRequests);
r.patch('/ambulance/:id', authMiddleware, ambulance.updateAmbulanceRequest);

// ─── Notifications ───
r.get('/notifications', authMiddleware, notifications.listNotifications);
r.post('/notifications/read', authMiddleware, notifications.markRead);
r.post('/notifications/read-all', authMiddleware, notifications.markAllRead);

// ─── Medical Records ───
r.get('/medical-records', authMiddleware, medicalRecords.listRecords);
r.post('/medical-records', authMiddleware, medicalRecords.createRecord);
r.get('/medical-records/:id', authMiddleware, medicalRecords.getRecord);
r.patch('/medical-records/:id', authMiddleware, medicalRecords.updateRecord);
r.delete('/medical-records/:id', authMiddleware, requireRoles('admin', 'doctor'), medicalRecords.deleteRecord);
r.post('/medical-records/:id/share', authMiddleware, medicalRecords.shareRecord);

// ─── Prescriptions ───
r.get('/prescriptions', authMiddleware, prescriptions.listPrescriptions);
r.post('/prescriptions', authMiddleware, prescriptions.createPrescription);
r.get('/prescriptions/:id', authMiddleware, prescriptions.getPrescription);
r.patch('/prescriptions/:id', authMiddleware, prescriptions.updatePrescription);

// ─── Reviews ───
r.get('/reviews', authMiddleware, reviews.listReviews);
r.post('/reviews', authMiddleware, reviews.createReview);
r.get('/reviews/stats', authMiddleware, reviews.getRatingStats);
r.patch('/reviews/:id/approve', authMiddleware, requireRoles('admin'), reviews.approveReview);
r.delete('/reviews/:id', authMiddleware, reviews.deleteReview);

// ─── Payments ───
r.get('/payments', authMiddleware, payments.listPayments);
r.post('/payments', authMiddleware, payments.createPayment);
r.get('/payments/summary', authMiddleware, requireRoles('admin'), payments.getRevenueSummary);
r.get('/payments/:id', authMiddleware, payments.getPayment);
r.patch('/payments/:id/status', authMiddleware, requireRoles('admin'), payments.updatePaymentStatus);
r.post('/payments/:id/process', authMiddleware, payments.processPayment);

// ─── Search ───
r.get('/search', authMiddleware, search.searchAll);
r.get('/search/nearby', authMiddleware, search.searchNearby);

// ─── Reports ───
r.get('/reports/summary', authMiddleware, reports.summary);
r.get('/reports/patient/:patientId', authMiddleware, reports.patientReport);

// ─── Admin ───
r.get('/admin/users', authMiddleware, requireRoles('admin'), admin.listUsers);
r.patch('/admin/users/:id/active', authMiddleware, requireRoles('admin'), admin.setUserActive);
r.patch('/admin/users/:id/role', authMiddleware, requireRoles('admin'), admin.setUserRole);
r.get('/admin/pending-institutions', authMiddleware, requireRoles('admin'), admin.pendingInstitutions);
r.patch('/admin/hospitals/:id/approval', authMiddleware, requireRoles('admin'), admin.approveHospital);
r.patch('/admin/centers/:id/approval', authMiddleware, requireRoles('admin'), admin.approveCenter);
r.get('/admin/settings', authMiddleware, requireRoles('admin'), admin.systemSettings);
r.get('/admin/audit', authMiddleware, requireRoles('admin'), admin.auditLog);
r.get('/admin/reports/full', authMiddleware, requireRoles('admin'), admin.fullReport);

export default r;
