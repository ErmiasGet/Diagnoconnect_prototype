import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { StatCard } from '../components/ui/StatCard.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import MiniBarChart from '../components/ui/MiniBarChart.jsx';
import { motion } from 'framer-motion';
import { Activity, BarChart3, CalendarDays, FileText, Users, Building2, UserCheck, TrendingUp, PieChart, HeartPulse } from 'lucide-react';

export default function AdminReportsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/reports/full').then((r) => setData(r.data)).catch(() => {
      api.get('/reports/summary').then((r) => setData({ overview: r.data }));
    });
  }, []);

  if (!data) {
    return <div className="py-16 text-center text-slate-500 text-sm font-medium animate-pulse">Loading analytics…</div>;
  }

  const ov = data.overview || {};

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Insights"
        title="Admin Analytics"
        description="Complete operational snapshot across the DiagnoConnect platform."
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={ov.totalUsers || 0} gradient="blue" />
        <StatCard icon={Activity} label="Patients" value={ov.totalPatients || 0} delay={0.05} gradient="care" />
        <StatCard icon={UserCheck} label="Doctors" value={ov.totalDoctors || 0} delay={0.1} gradient="brand" />
        <StatCard icon={Building2} label="Hospitals" value={ov.totalHospitals || 0} delay={0.15} gradient="teal" />
        <StatCard icon={Building2} label="Centers" value={ov.totalCenters || 0} delay={0.2} gradient="care" />
        <StatCard icon={FileText} label="Referrals" value={ov.totalReferrals || 0} delay={0.25} gradient="brand" />
        <StatCard icon={CalendarDays} label="Appointments" value={ov.totalAppointments || 0} delay={0.3} gradient="teal" />
        <StatCard icon={TrendingUp} label="Active Users" value={ov.activeUsers || 0} delay={0.35} gradient="blue" />
      </div>

      {data.pending && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="border-amber-200 bg-amber-50/30">
            <CardBody className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Hospital className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Pending Hospitals</p>
                <p className="text-2xl font-bold text-amber-700">{data.pending.hospitals || 0}</p>
              </div>
            </CardBody>
          </Card>
          <Card className="border-amber-200 bg-amber-50/30">
            <CardBody className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Pending Centers</p>
                <p className="text-2xl font-bold text-amber-700">{data.pending.centers || 0}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader icon={BarChart3} title="Referrals by Status" subtitle="Distribution across all referrals" />
          <CardBody><MiniBarChart rows={data.referralStatuses || []} /></CardBody>
        </Card>
        <Card>
          <CardHeader icon={CalendarDays} title="Appointments by Status" subtitle="Operational throughput" />
          <CardBody><MiniBarChart rows={data.appointmentStatuses || []} /></CardBody>
        </Card>
      </div>

      {data.usersByRole && (
        <Card>
          <CardHeader icon={PieChart} title="Users by Role" subtitle="Platform composition" />
          <CardBody>
            <div className="grid gap-3 sm:grid-cols-3">
              {data.usersByRole.map((r) => (
                <div key={r._id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900">{r.count}</p>
                  <p className="text-xs text-slate-500 capitalize mt-1">{r._id?.replace('_', ' ')}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {data.monthlyReferrals && data.monthlyAppointments && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader icon={TrendingUp} title="Monthly Referrals" subtitle="Trend over time" />
            <CardBody><MiniBarChart rows={data.monthlyReferrals} labelKey="_id" /></CardBody>
          </Card>
          <Card>
            <CardHeader icon={CalendarDays} title="Monthly Appointments" subtitle="Trend over time" />
            <CardBody><MiniBarChart rows={data.monthlyAppointments} labelKey="_id" /></CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
