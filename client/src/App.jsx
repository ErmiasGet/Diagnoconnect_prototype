import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import PageLoader from './components/ui/PageLoader.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';
import Landing from './pages/Landing.jsx';
import AppLayout from './components/AppLayout.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
import PatientDashboard from './pages/PatientDashboard.jsx';
import AppointmentsPage from './pages/AppointmentsPage.jsx';
import CentersPage from './pages/CentersPage.jsx';
import DiagnosticCenterDetailsPage from './pages/DiagnosticCenterDetailsPage.jsx';
import ReferralsPage from './pages/ReferralsPage.jsx';
import AmbulancePage from './pages/AmbulancePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import PatientProfilePage from './pages/PatientProfilePage.jsx';
import EditProfilePage from './pages/EditProfilePage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminApprovalsPage from './pages/AdminApprovalsPage.jsx';
import AdminReportsPage from './pages/AdminReportsPage.jsx';
import AdminSettingsPage from './pages/AdminSettingsPage.jsx';
import PatientsPage from './pages/PatientsPage.jsx';
import MedicalRecordsPage from './pages/MedicalRecordsPage.jsx';
import BillingPage from './pages/BillingPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import DoctorsPage from './pages/DoctorsPage.jsx';
import HospitalsPage from './pages/HospitalsPage.jsx';
import PrescriptionsPage from './pages/PrescriptionsPage.jsx';
import BookAppointmentPage from './pages/BookAppointmentPage.jsx';
import AppointmentHistoryPage from './pages/AppointmentHistoryPage.jsx';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage.jsx';
import RescheduleAppointmentPage from './pages/RescheduleAppointmentPage.jsx';
import ReferralListPage from './pages/ReferralListPage.jsx';
import ReferralDetailsPage from './pages/ReferralDetailsPage.jsx';
import ReferralTrackingPage from './pages/ReferralTrackingPage.jsx';
import DiagnosticReportsPage from './pages/DiagnosticReportsPage.jsx';
import DownloadReportsPage from './pages/DownloadReportsPage.jsx';
import RequestAmbulancePage from './pages/RequestAmbulancePage.jsx';
import AmbulanceTrackingPage from './pages/AmbulanceTrackingPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import InvoicePage from './pages/InvoicePage.jsx';
import PaymentHistoryPage from './pages/PaymentHistoryPage.jsx';
import SubscriptionPage from './pages/SubscriptionPage.jsx';
import SubmitFeedbackPage from './pages/SubmitFeedbackPage.jsx';
import ComplaintPage from './pages/ComplaintPage.jsx';
import AccountSettingsPage from './pages/AccountSettingsPage.jsx';
import SecuritySettingsPage from './pages/SecuritySettingsPage.jsx';

/* Doctor Pages */
import DoctorDashboard from './pages/DoctorDashboard.jsx';
import DoctorProfilePage from './pages/DoctorProfilePage.jsx';
import DoctorPatientsPage from './pages/DoctorPatientsPage.jsx';
import PatientMedicalHistoryPage from './pages/PatientMedicalHistoryPage.jsx';
import PatientNotesPage from './pages/PatientNotesPage.jsx';
import DoctorUploadPrescriptionPage from './pages/DoctorUploadPrescriptionPage.jsx';
import DoctorCreateReferralPage from './pages/DoctorCreateReferralPage.jsx';
import UpdateReferralStatusPage from './pages/UpdateReferralStatusPage.jsx';
import ReferralDocumentsPage from './pages/ReferralDocumentsPage.jsx';
import RecommendDiagnosticTestsPage from './pages/RecommendDiagnosticTestsPage.jsx';
import ReferralProgressPage from './pages/ReferralProgressPage.jsx';
import DoctorAppointmentsPage from './pages/DoctorAppointmentsPage.jsx';
import AppointmentOutcomePage from './pages/AppointmentOutcomePage.jsx';
import DoctorDiagnosticResultsPage from './pages/DoctorDiagnosticResultsPage.jsx';
import DoctorDownloadReportsPage from './pages/DoctorDownloadReportsPage.jsx';
import CommunicateWithCentersPage from './pages/CommunicateWithCentersPage.jsx';
import PatientReportsPage from './pages/PatientReportsPage.jsx';
import DiagnosisAnalyticsPage from './pages/DiagnosisAnalyticsPage.jsx';
import { navForRole } from './config/navigation.js';

function Protected({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader label="Preparing your workspace…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/app" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={!loading && user ? <Navigate to="/app" replace /> : <Login />} />
      <Route path="/register" element={!loading && user ? <Navigate to="/app" replace /> : <Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route
        path="/app"
        element={
          <Protected>
            <AppLayout nav={navForRole(user?.role)} />
          </Protected>
        }
      >
        <Route index element={<DashboardHome />} />

        {/* Appointments */}
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="book-appointment" element={<BookAppointmentPage />} />
        <Route path="appointment-history" element={<AppointmentHistoryPage />} />
        <Route path="appointment-details/:id" element={<AppointmentDetailsPage />} />
        <Route path="reschedule-appointment/:id" element={<RescheduleAppointmentPage />} />

        {/* Centers & Diagnostics */}
        <Route path="centers" element={<CentersPage />} />
        <Route path="diagnostic-centers" element={<CentersPage />} />
        <Route path="diagnostic-centers/:id" element={<DiagnosticCenterDetailsPage />} />
        <Route path="hospitals" element={<HospitalsPage />} />
        <Route path="doctors" element={<DoctorsPage />} />

        {/* Referrals */}
        <Route path="referrals" element={<ReferralsPage />} />
        <Route path="referral-list" element={<ReferralListPage />} />
        <Route path="referral-details/:id" element={<ReferralDetailsPage />} />
        <Route path="referral-tracking" element={<ReferralTrackingPage />} />

        {/* Ambulance */}
        <Route path="ambulance" element={<AmbulancePage />} />
        <Route path="request-ambulance" element={<RequestAmbulancePage />} />
        <Route path="ambulance-tracking" element={<AmbulanceTrackingPage />} />

        {/* Medical & Reports */}
        <Route path="patients" element={<Protected roles={['doctor', 'admin']}><PatientsPage /></Protected>} />
        <Route path="records" element={<MedicalRecordsPage />} />
        <Route path="diagnostic-reports" element={<DiagnosticReportsPage />} />
        <Route path="download-reports" element={<DownloadReportsPage />} />
        <Route path="prescriptions" element={<PrescriptionsPage />} />

        {/* Billing & Payments */}
        <Route path="billing" element={<BillingPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="invoices" element={<InvoicePage />} />
        <Route path="payment-history" element={<PaymentHistoryPage />} />
        <Route path="subscription" element={<SubscriptionPage />} />

        {/* Reviews & Feedback */}
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="submit-feedback" element={<SubmitFeedbackPage />} />
        <Route path="complaint" element={<ComplaintPage />} />

        {/* Notifications & Messages */}
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="messages" element={<MessagesPage />} />

        {/* Doctor Dashboard (replaces generic for doctors) */}
        <Route path="doctor-dashboard" element={<Protected roles={['doctor', 'admin']}><DoctorDashboard /></Protected>} />
        <Route path="doctor-profile" element={<Protected roles={['doctor', 'admin']}><DoctorProfilePage /></Protected>} />
        <Route path="doctor-patients" element={<Protected roles={['doctor', 'admin']}><DoctorPatientsPage /></Protected>} />
        <Route path="patient-medical-history/:patientId" element={<Protected roles={['doctor', 'admin']}><PatientMedicalHistoryPage /></Protected>} />
        <Route path="patient-notes/:patientId" element={<Protected roles={['doctor', 'admin']}><PatientNotesPage /></Protected>} />
        <Route path="doctor-upload-prescription" element={<Protected roles={['doctor', 'admin']}><DoctorUploadPrescriptionPage /></Protected>} />
        <Route path="doctor-create-referral" element={<Protected roles={['doctor', 'admin']}><DoctorCreateReferralPage /></Protected>} />
        <Route path="update-referral-status/:id" element={<Protected roles={['doctor', 'admin']}><UpdateReferralStatusPage /></Protected>} />
        <Route path="referral-documents/:id" element={<Protected roles={['doctor', 'admin']}><ReferralDocumentsPage /></Protected>} />
        <Route path="recommend-diagnostic-tests" element={<Protected roles={['doctor', 'admin']}><RecommendDiagnosticTestsPage /></Protected>} />
        <Route path="referral-progress" element={<Protected roles={['doctor', 'admin']}><ReferralProgressPage /></Protected>} />
        <Route path="doctor-appointments" element={<Protected roles={['doctor', 'admin']}><DoctorAppointmentsPage /></Protected>} />
        <Route path="appointment-outcome/:id" element={<Protected roles={['doctor', 'admin']}><AppointmentOutcomePage /></Protected>} />
        <Route path="doctor-diagnostic-results" element={<Protected roles={['doctor', 'admin']}><DoctorDiagnosticResultsPage /></Protected>} />
        <Route path="doctor-download-reports" element={<Protected roles={['doctor', 'admin']}><DoctorDownloadReportsPage /></Protected>} />
        <Route path="communicate-with-centers" element={<Protected roles={['doctor', 'admin']}><CommunicateWithCentersPage /></Protected>} />
        <Route path="patient-reports" element={<Protected roles={['doctor', 'admin']}><PatientReportsPage /></Protected>} />
        <Route path="diagnosis-analytics" element={<Protected roles={['doctor', 'admin']}><DiagnosisAnalyticsPage /></Protected>} />

        {/* Profile & Settings */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="patient-profile" element={<PatientProfilePage />} />
        <Route path="edit-profile" element={<EditProfilePage />} />
        <Route path="account-settings" element={<AccountSettingsPage />} />
        <Route path="security-settings" element={<SecuritySettingsPage />} />

        {/* Admin */}
        <Route path="admin/users" element={<Protected roles={['admin']}><AdminUsersPage /></Protected>} />
        <Route path="admin/approvals" element={<Protected roles={['admin']}><AdminApprovalsPage /></Protected>} />
        <Route path="admin/reports" element={<Protected roles={['admin']}><AdminReportsPage /></Protected>} />
        <Route path="admin/settings" element={<Protected roles={['admin']}><AdminSettingsPage /></Protected>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
