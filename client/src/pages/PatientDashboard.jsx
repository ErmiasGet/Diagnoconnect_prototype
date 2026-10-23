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
  CalendarDays, FileText, HeartPulse, Activity, Clock, ArrowRight,
  Microscope, Building2, Stethoscope, ClipboardList, CreditCard,
  MessageSquare, Ambulance as AmbulanceIcon, Bell, ChevronRight,
  AlertCircle, CheckCircle2, XCircle, Pill
} from 'lucide-react';

const quickLinks = [
  { to: '/app/book-appointment', label: 'Book Appointment', icon: CalendarDays, color: 'from-brand-500 to-care-500', desc: 'Schedule a diagnostic visit' },
  { to: '/app/diagnostic-centers', label: 'Diagnostic Centers', icon: Microscope, color: 'from-accent-500 to-cyan-600', desc: 'Browse approved centers' },
  { to: '/app/appointment-history', label: 'Appointment History', icon: Clock, color: 'from-care-500 to-teal-500', desc: 'View past appointments' },
  { to: '/app/diagnostic-reports', label: 'My Reports', icon: FileText, color: 'from-purple-500 to-violet-500', desc: 'Access test results' },
  { to: '/app/request-ambulance', label: 'Request Ambulance', icon: AmbulanceIcon, color: 'from-red-500 to-rose-500', desc: 'Emergency transport' },
  { to: '/app/billing', label: 'Billing & Payments', icon: CreditCard, color: 'from-emerald-500 to-green-500', desc: 'Payments & invoices' },
];

export default function PatientDashboard() {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });

  useEffect(() => {
    api.get('/appointments').then(r => {
      const data = r.data;
      setAppointments(data.slice(0, 5));
      setStats({
        total: data.length,
        upcoming: data.filter(a => a.status === 'confirmed' || a.status === 'pending').length,
        completed: data.filter(a => a.status === 'completed').length,
        cancelled: data.filter(a => a.status === 'cancelled').length,
      });
    }).catch(() => {});
    api.get('/referrals').then(r => setReferrals(r.data.slice(0, 5))).catch(() => {});
    api.get('/medical-records').then(r => setReports(r.data.slice(0, 3))).catch(() => {});
    api.get('/prescriptions').then(r => setPrescriptions(r.data.slice(0, 3))).catch(() => {});
  }, []);

  const bloodGroupBadge = profile?.bloodGroup
    ? { A: 'bg-red-50 text-red-700', B: 'bg-blue-50 text-blue-700', AB: 'bg-purple-50 text-purple-700', O: 'bg-green-50 text-green-700' }
        [profile.bloodGroup.slice(0, -1)] || 'bg-slate-50 text-slate-700'
    : '';

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Patient Portal"
        title={`Welcome back, ${user?.fullName?.split(' ')[0] || 'there'}`}
        description="Manage your appointments, referrals, diagnostic reports, and health records from one place."
      />

      {profile?.bloodGroup && (
        <Card className="bg-gradient-to-r from-brand-500/5 to-care-500/5 border-brand-100/50">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-md">
                <HeartPulse className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{user?.fullName}</span>
                  {profile?.age && <span> · {profile.age} years</span>}
                  {profile?.gender && <span> · {profile.gender}</span>}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${bloodGroupBadge}`}>
                    Blood: {profile.bloodGroup}
                  </span>
                  {profile?.allergies?.length > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      <AlertCircle className="h-3 w-3" /> {profile.allergies.length} allergies
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Upcoming" value={stats.upcoming} hint="Confirmed appointments" gradient="brand" />
        <StatCard icon={CheckCircle2} label="Completed" value={stats.completed} hint="Visits done" gradient="care" />
        <StatCard icon={FileText} label="Referrals" value={referrals.length} hint="Active referrals" gradient="teal" />
        <StatCard icon={Activity} label="Reports" value={reports.length} hint="Medical records" gradient="blue" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {quickLinks.map(l => (
          <Link key={l.to} to={l.to}>
            <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-soft hover:shadow-glow transition-all text-center h-full">
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${l.color} text-white shadow-sm`}>
                <l.icon className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-700">{l.label}</p>
              <p className="mt-0.5 text-[10px] text-slate-400">{l.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader icon={CalendarDays} title="Upcoming Appointments" subtitle="Your scheduled visits" action={
            <Link to="/app/appointment-history" className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          } />
          <CardBody className="pt-0">
            {appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed').length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed').slice(0, 3).map((a, i) => (
                  <motion.li key={a._id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{new Date(a.appointmentDate).toLocaleDateString()} · {new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-xs text-slate-500">{a.centerId?.centerName || 'Center'} {a.serviceType ? `· ${a.serviceType}` : ''}</p>
                    </div>
                    <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No upcoming appointments</p>
                <Link to="/app/book-appointment" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
                  Book now <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={FileText} title="Recent Referrals" subtitle="Clinical progress" action={
            <Link to="/app/referral-list" className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          } />
          <CardBody className="pt-0">
            {referrals.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {referrals.slice(0, 3).map((r, i) => (
                  <motion.li key={r._id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{r.diagnosisType}</p>
                      {r.diagnosticRequestNotes && <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{r.diagnosticRequestNotes}</p>}
                    </div>
                    <Badge variant={statusVariant(r.referralStatus)}>{r.referralStatus}</Badge>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No referrals yet</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {prescriptions.length > 0 && (
          <Card>
            <CardHeader icon={Pill} title="Active Prescriptions" subtitle="Current medications" />
            <CardBody className="pt-0 space-y-3">
              {prescriptions.filter(p => p.isActive !== false).slice(0, 3).map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                  <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()} · {p.medications?.length} medication(s)</p>
                  {p.medications?.slice(0, 2).map((m, mi) => (
                    <p key={mi} className="text-sm font-medium text-slate-900 mt-1">{m.name}{m.dosage ? ` — ${m.dosage}` : ''}</p>
                  ))}
                  {p.medications?.length > 2 && <p className="text-xs text-slate-400 mt-1">+{p.medications.length - 2} more</p>}
                </motion.div>
              ))}
            </CardBody>
          </Card>
        )}

        {reports.length > 0 && (
          <Card>
            <CardHeader icon={ClipboardList} title="Latest Reports" subtitle="Recent diagnostic results" />
            <CardBody className="pt-0 space-y-3">
              {reports.slice(0, 4).map((r, i) => (
                <motion.div key={r._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                    <p className="text-xs text-slate-500">{r.recordType?.replace('_', ' ')} · {new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  {r.fileUrl && (
                    <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:text-brand-700">
                      <FileText className="h-4 w-4" />
                    </a>
                  )}
                </motion.div>
              ))}
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
