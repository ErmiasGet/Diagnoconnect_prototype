import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import {
  Activity,
  CalendarDays,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Users,
  Zap,
  Bell,
  Search,
  CreditCard,
  MessageSquare,
  Microscope,
  Building2,
  Stethoscope,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';

const quickLinks = [
  { to: '/app/centers', label: 'Diagnostic Centers', icon: Microscope, color: 'from-brand-500 to-care-500' },
  { to: '/app/hospitals', label: 'Hospitals', icon: Building2, color: 'from-accent-500 to-cyan-600' },
  { to: '/app/doctors', label: 'Doctors', icon: Stethoscope, color: 'from-care-500 to-teal-500' },
  { to: '/app/records', label: 'Medical Records', icon: ClipboardList, color: 'from-purple-500 to-violet-500' },
  { to: '/app/billing', label: 'Billing', icon: CreditCard, color: 'from-emerald-500 to-green-500' },
  { to: '/app/reviews', label: 'Reviews', icon: MessageSquare, color: 'from-amber-500 to-orange-500' },
];

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/reports/summary').then((r) => setStats(r.data)).catch(() => {});
    }
    if (['patient', 'doctor', 'center_admin', 'admin'].includes(user?.role)) {
      api
        .get('/appointments')
        .then((r) => setAppointments(r.data.slice(0, 5)))
        .catch(() => {});
    }
    if (['patient', 'doctor', 'admin', 'hospital_admin'].includes(user?.role)) {
      api
        .get('/referrals')
        .then((r) => setReferrals(r.data.slice(0, 5)))
        .catch(() => {});
    }
  }, [user]);

  const roleLabel = user?.role?.replace('_', ' ');

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Overview"
        title={`${roleLabel ? roleLabel + ' · ' : ''}Welcome back, ${user?.fullName?.split(' ')[0] || 'there'}`}
        description={
          profile?.centerName
            ? `Managing ${profile.centerName}. Track appointments, referrals, and updates from one place.`
            : profile?.name
              ? `${profile.name} — coordinate referrals and ambulance activity from your dashboard.`
              : 'Your care coordination hub — appointments, referrals, and notifications at a glance.'
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickLinks.map((l) => (
          <Link key={l.to} to={l.to}>
            <motion.div
              whileHover={{ y: -2 }}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-soft hover:shadow-glow transition-all text-center"
            >
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${l.color} text-white shadow-sm`}>
                <l.icon className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-700">{l.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-brand-500/5 to-care-500/5 border-brand-100/50">
        <CardBody>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-brand-500" />
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Quick search:</span> Use the navigation sidebar to explore
              appointments, referrals, centers, doctors, hospitals, medical records, billing, and reviews.
            </p>
          </div>
        </CardBody>
      </Card>

      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Users" value={stats.users} delay={0} gradient="blue" />
          <StatCard icon={HeartPulse} label="Patients" value={stats.patients} delay={0.05} gradient="care" />
          <StatCard icon={FileText} label="Referrals" value={stats.referrals} delay={0.1} gradient="brand" />
          <StatCard icon={CalendarDays} label="Appointments" value={stats.appointments} delay={0.15} gradient="teal" />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {appointments.length > 0 && (
          <Card>
            <CardHeader icon={CalendarDays} title="Recent appointments" subtitle="Latest updates on your schedule" />
            <CardBody className="pt-0">
              <ul className="divide-y divide-slate-100">
                {appointments.map((a, i) => (
                  <motion.li
                    key={a._id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-wrap items-center justify-between gap-2 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {new Date(a.appointmentDate).toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500">ID {String(a._id).slice(-6)}</p>
                    </div>
                    <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                  </motion.li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        {referrals.length > 0 && (
          <Card>
            <CardHeader icon={FileText} title="Recent referrals" subtitle="Clinical requests and progress" />
            <CardBody className="pt-0">
              <ul className="divide-y divide-slate-100">
                {referrals.map((r, i) => (
                  <motion.li
                    key={r._id}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex flex-wrap items-center justify-between gap-2 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{r.diagnosisType}</p>
                      {r.diagnosticRequestNotes && (
                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{r.diagnosticRequestNotes}</p>
                      )}
                    </div>
                    <Badge variant={statusVariant(r.referralStatus)}>{r.referralStatus}</Badge>
                  </motion.li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}
      </div>

      {user?.role === 'ambulance' && (
        <Card className="border-care-200 bg-gradient-to-r from-care-50 to-white">
          <CardBody className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-care-500 to-emerald-500 text-white shadow-md">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Ambulance queue</h3>
              <p className="text-sm text-slate-600 mt-1">
                Open the <strong>Requests</strong> page to accept transports and update live status for hospitals and patients.
              </p>
            </div>
          </CardBody>
        </Card>
      )}

      {!appointments.length && !referrals.length && user?.role !== 'admin' && (
        <Card>
          <CardBody className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-care-50 text-brand-600 shadow-sm">
              <Bell className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">All clear</h3>
              <p className="text-sm text-slate-600 mt-1">
                Use the sidebar to book diagnostics, follow referrals, or manage your institution profile.
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
