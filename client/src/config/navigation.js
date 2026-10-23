export function navForRole(role) {
  const base = [
    { to: '/app', label: 'Dashboard', end: true, icon: 'LayoutDashboard' },
    { to: '/app/notifications', label: 'Notifications', icon: 'Bell' },
    { to: '/app/profile', label: 'Profile', icon: 'UserCircle' },
    { to: '/app/records', label: 'Medical Records', icon: 'FileText' },
    { to: '/app/reviews', label: 'Reviews', icon: 'MessageSquare' },
  ];

  if (role === 'patient') {
    return [
      { to: '/app', label: 'Dashboard', end: true, icon: 'LayoutDashboard' },
      { to: '/app/book-appointment', label: 'Book Appointment', icon: 'CalendarPlus' },
      { to: '/app/appointment-history', label: 'Appointments', icon: 'CalendarCheck' },
      { to: '/app/diagnostic-centers', label: 'Diagnostic Centers', icon: 'Microscope' },
      { to: '/app/hospitals', label: 'Hospitals', icon: 'Building2' },
      { to: '/app/doctors', label: 'Doctors', icon: 'Stethoscope' },
      { to: '/app/diagnostic-reports', label: 'My Reports', icon: 'FileText' },
      { to: '/app/referral-list', label: 'Referrals', icon: 'Stethoscope' },
      { to: '/app/referral-tracking', label: 'Referral Tracking', icon: 'Activity' },
      { to: '/app/ambulance', label: 'Ambulance', icon: 'Ambulance' },
      { to: '/app/ambulance-tracking', label: 'Ambulance Tracking', icon: 'Navigation' },
      { to: '/app/payment-history', label: 'Payments', icon: 'CreditCard' },
      { to: '/app/subscription', label: 'Subscription', icon: 'Crown' },
      { to: '/app/invoices', label: 'Invoices', icon: 'Receipt' },
      { to: '/app/messages', label: 'Messages', icon: 'MessageSquare' },
      { to: '/app/submit-feedback', label: 'Feedback', icon: 'Star' },
      { to: '/app/patient-profile', label: 'My Profile', icon: 'UserCircle' },
      { to: '/app/account-settings', label: 'Settings', icon: 'Settings' },
      { to: '/app/notifications', label: 'Notifications', icon: 'Bell' },
    ];
  }
  if (role === 'doctor') {
    return [
      { to: '/app/doctor-dashboard', label: 'Dashboard', end: false, icon: 'LayoutDashboard' },
      { to: '/app/doctor-patients', label: 'Patients', icon: 'Users' },
      { to: '/app/patient-reports', label: 'Patient Reports', icon: 'FileText' },
      { to: '/app/doctor-create-referral', label: 'New Referral', icon: 'FilePlus' },
      { to: '/app/referral-progress', label: 'Referral Progress', icon: 'Stethoscope' },
      { to: '/app/doctor-appointments', label: 'Appointments', icon: 'CalendarDays' },
      { to: '/app/doctor-upload-prescription', label: 'Prescriptions', icon: 'ClipboardList' },
      { to: '/app/doctor-diagnostic-results', label: 'Diagnostic Results', icon: 'Microscope' },
      { to: '/app/recommend-diagnostic-tests', label: 'Recommend Tests', icon: 'FlaskConical' },
      { to: '/app/communicate-with-centers', label: 'Contact Centers', icon: 'MessageSquare' },
      { to: '/app/diagnosis-analytics', label: 'Analytics', icon: 'BarChart3' },
      { to: '/app/doctor-profile', label: 'My Profile', icon: 'UserCircle' },
      { to: '/app/account-settings', label: 'Settings', icon: 'Settings' },
      { to: '/app/notifications', label: 'Notifications', icon: 'Bell' },
    ];
  }
  if (role === 'center_admin') {
    return [
      { to: '/app', label: 'Dashboard', end: true, icon: 'LayoutDashboard' },
      { to: '/app/appointments', label: 'Appointments', icon: 'CalendarCheck2' },
      { to: '/app/profile', label: 'Center Profile', icon: 'Building2' },
      { to: '/app/notifications', label: 'Notifications', icon: 'Bell' },
      { to: '/app/records', label: 'Records', icon: 'FileText' },
      { to: '/app/reviews', label: 'Reviews', icon: 'MessageSquare' },
    ];
  }
  if (role === 'hospital_admin') {
    return [
      { to: '/app', label: 'Dashboard', end: true, icon: 'LayoutDashboard' },
      { to: '/app/ambulance', label: 'Ambulance', icon: 'Ambulance' },
      { to: '/app/doctors', label: 'Doctors', icon: 'Stethoscope' },
      { to: '/app/referrals', label: 'Referrals', icon: 'FileText' },
      { to: '/app/profile', label: 'Hospital Profile', icon: 'Landmark' },
      { to: '/app/notifications', label: 'Notifications', icon: 'Bell' },
      { to: '/app/billing', label: 'Billing', icon: 'CreditCard' },
    ];
  }
  if (role === 'ambulance') {
    return [
      { to: '/app', label: 'Dashboard', end: true, icon: 'LayoutDashboard' },
      { to: '/app/ambulance', label: 'Requests', icon: 'Zap' },
      { to: '/app/notifications', label: 'Notifications', icon: 'Bell' },
    ];
  }
  if (role === 'admin') {
    return [
      { to: '/app', label: 'Dashboard', end: true, icon: 'LayoutDashboard' },
      { to: '/app/admin/users', label: 'Users', icon: 'UsersRound' },
      { to: '/app/admin/approvals', label: 'Approvals', icon: 'ClipboardCheck' },
      { to: '/app/admin/reports', label: 'Reports', icon: 'BarChart3' },
      { to: '/app/admin/settings', label: 'Settings', icon: 'Settings' },
      { to: '/app/appointments', label: 'All Appointments', icon: 'CalendarRange' },
      { to: '/app/referrals', label: 'All Referrals', icon: 'Layers' },
      { to: '/app/centers', label: 'Centers', icon: 'Building2' },
      { to: '/app/hospitals', label: 'Hospitals', icon: 'Hospital' },
      { to: '/app/doctors', label: 'Doctors', icon: 'Stethoscope' },
      { to: '/app/patients', label: 'Patients', icon: 'Users' },
      { to: '/app/records', label: 'Medical Records', icon: 'FileText' },
      { to: '/app/billing', label: 'Billing', icon: 'CreditCard' },
      { to: '/app/reviews', label: 'Reviews', icon: 'MessageSquare' },
      { to: '/app/notifications', label: 'Notifications', icon: 'Bell' },
    ];
  }
  return base;
}
