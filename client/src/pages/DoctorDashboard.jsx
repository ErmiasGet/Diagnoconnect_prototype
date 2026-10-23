import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import {
  Users, CalendarDays, FileText, Stethoscope, ClipboardList, Activity,
  ArrowRight, ChevronRight, Pill, Microscope, UserPlus, TrendingUp, Bell,
  Clock, CheckCircle2, AlertCircle, Ambulance as AmbulanceIcon
} from 'lucide-react';

const quickActions = [
  { to: '/app/doctor-patients', label: 'Search Patients', icon: Users, color: 'from-brand-500 to-care-500', desc: 'Find and manage patients' },
  { to: '/app/doctor-create-referral', label: 'New Referral', icon: FileText, color: 'from-accent-500 to-cyan-600', desc: 'Create diagnostic referral' },
  { to: '/app/doctor-appointments', label: 'Appointments', icon: CalendarDays, color: 'from-care-500 to-teal-500', desc: 'Manage schedule' },
  { to: '/app/doctor-upload-prescription', label: 'Prescribe', icon: Pill, color: 'from-purple-500 to-violet-500', desc: 'Write prescription' },
  { to: '/app/doctor-diagnostic-results', label: 'Test Results', icon: Microscope, color: 'from-emerald-500 to-green-500', desc: 'View lab results' },
  { to: '/app/referral-progress', label: 'Referral Progress', icon: TrendingUp, color: 'from-amber-500 to-orange-500', desc: 'Track referrals' },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    api.get('/patients').then(r => setPatients(r.data)).catch(() => {});
    api.get('/appointments').then(r => setAppointments(r.data)).catch(() => {});
    api.get('/referrals').then(r => setReferrals(r.data)).catch(() => {});
    api.get('/prescriptions').then(r => setPrescriptions(r.data)).catch(() => {});
  }, []);

  const todayAppts = appointments.filter(a => {
    const d = new Date(a.appointmentDate);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const pendingReferrals = referrals.filter(r => r.referralStatus === 'submitted');

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Doctor Portal"
        title={`Welcome, Dr. ${user?.fullName?.split(' ')[0] || 'there'}`}
        description="Manage patients, referrals, appointments, and prescriptions from your clinical dashboard."
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Patients" value={patients.length} hint="Registered patients" gradient="brand" />
        <StatCard icon={CalendarDays} label="Today's Appointments" value={todayAppts.length} hint={todayAppts.length > 0 ? `${todayAppts.filter(a => a.status === 'confirmed').length} confirmed` : 'No schedule'} gradient="care" />
        <StatCard icon={FileText} label="Active Referrals" value={referrals.filter(r => r.referralStatus !== 'completed' && r.referralStatus !== 'cancelled').length} hint={`${pendingReferrals.length} pending action`} gradient="teal" />
        <StatCard icon={ClipboardList} label="Prescriptions" value={prescriptions.length} hint="Total issued" gradient="blue" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {quickActions.map(l => (
          <Link key={l.to} to={l.to}>
            <motion.div whileHover={{ y: -2 }}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-soft hover:shadow-glow transition-all text-center h-full">
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
          <CardHeader icon={CalendarDays} title="Today's Appointments" subtitle={todayAppts.length > 0 ? `${todayAppts.length} scheduled` : 'No appointments today'}
            action={<Link to="/app/doctor-appointments"><Button type="button" variant="ghost" className="!px-3 !py-1 text-xs">View All</Button></Link>} />
          <CardBody className="pt-0">
            {todayAppts.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {todayAppts.slice(0, 5).map((a, i) => (
                  <motion.li key={a._id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between gap-2 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-xs text-slate-500">{a.centerId?.centerName || '—'} {a.serviceType ? `· ${a.serviceType}` : ''}</p>
                      </div>
                    </div>
                    <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <CalendarDays className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No appointments today</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={FileText} title="Pending Referrals" subtitle={`${pendingReferrals.length} need attention`}
            action={<Link to="/app/referral-progress"><Button type="button" variant="ghost" className="!px-3 !py-1 text-xs">View All</Button></Link>} />
          <CardBody className="pt-0">
            {pendingReferrals.length > 0 ? (
              <ul className="divide-y divide-slate-100">
                {pendingReferrals.slice(0, 5).map((r, i) => (
                  <motion.li key={r._id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{r.diagnosisType}</p>
                      <p className="text-xs text-slate-500">{r.patientId?.userId?.fullName || 'Patient'} · {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant="warning">Submitted</Badge>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No pending referrals</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader icon={Users} title="Recent Patients" subtitle={`${patients.length} total patients`} />
          <CardBody className="pt-0">
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr><th className="p-3">Name</th><th className="p-3">Blood</th><th className="p-3">Gender</th><th className="p-3 text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {patients.slice(0, 5).map((p, i) => (
                    <motion.tr key={p._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      className="border-t border-slate-100 hover:bg-slate-50/60">
                      <td className="p-3 font-medium text-slate-900">{p.userId?.fullName || '—'}</td>
                      <td className="p-3 text-slate-600">{p.bloodGroup || '—'}</td>
                      <td className="p-3 text-slate-600 capitalize">{p.gender || '—'}</td>
                      <td className="p-3 text-right">
                        <Link to={`/app/patient-medical-history/${p.userId?._id || p._id}`}>
                          <Button type="button" variant="ghost" className="!px-3 !py-1 text-xs">View</Button>
                        </Link>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {!patients.length && <div className="p-6 text-center text-sm text-slate-500">No patients yet.</div>}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={Activity} title="Recent Activity" subtitle="Latest clinical actions" />
          <CardBody className="pt-0 space-y-2">
            {prescriptions.slice(0, 3).map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-50 to-violet-50 text-purple-600">
                  <Pill className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">Prescription issued</p>
                  <p className="text-xs text-slate-500">{p.medications?.length} medications · {new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
            {referrals.filter(r => r.referralStatus === 'completed').slice(0, 2).map((r, i) => (
              <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{r.diagnosisType} — Completed</p>
                  <p className="text-xs text-slate-500">{new Date(r.updatedAt).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
            {!prescriptions.length && !referrals.filter(r => r.referralStatus === 'completed').length && (
              <p className="text-sm text-slate-500 text-center py-6">No recent activity.</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
