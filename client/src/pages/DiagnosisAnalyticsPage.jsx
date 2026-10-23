import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, PieChart, BarChart3, Stethoscope, ArrowUp, ArrowDown, Users, FileText, CalendarDays, CheckCircle2, Clock } from 'lucide-react';

export default function DiagnosisAnalyticsPage() {
  const [referrals, setReferrals] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/referrals').then(r => setReferrals(r.data)),
      api.get('/appointments').then(r => setAppointments(r.data)),
      api.get('/prescriptions').then(r => setPrescriptions(r.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const diagnosisCounts = referrals.reduce((acc, r) => {
    const type = r.diagnosisType || 'Other';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const sortedDiagnoses = Object.entries(diagnosisCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const totalReferrals = referrals.length;
  const completedReferrals = referrals.filter(r => r.referralStatus === 'completed').length;
  const inProgressReferrals = referrals.filter(r => r.referralStatus === 'in_progress').length;
  const completionRate = totalReferrals > 0 ? Math.round((completedReferrals / totalReferrals) * 100) : 0;

  const monthlyData = [];
  const months = [...new Set(referrals.map(r => {
    const d = new Date(r.createdAt);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }))].sort();

  months.forEach(month => {
    const count = referrals.filter(r => {
      const d = new Date(r.createdAt);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === month;
    }).length;
    monthlyData.push({ month, count });
  });

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Analytics"
        title="Diagnosis Analytics"
        description="View insights and trends from your diagnostic referrals and clinical activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-slate-900">{totalReferrals}</p>
            <p className="text-xs text-slate-500">Total Referrals</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-emerald-600">{completionRate}%</p>
            <p className="text-xs text-slate-500">Completion Rate</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-brand-600">{inProgressReferrals}</p>
            <p className="text-xs text-slate-500">In Progress</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
            <p className="text-xs text-slate-500">Appointments</p>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader icon={PieChart} title="Top Diagnoses" subtitle="Most common diagnosis types" />
          <CardBody className="pt-0">
            {sortedDiagnoses.length > 0 ? (
              <div className="space-y-3">
                {sortedDiagnoses.map(([diagnosis, count], i) => {
                  const maxCount = sortedDiagnoses[0][1];
                  const percentage = Math.round((count / maxCount) * 100);
                  const colors = ['bg-brand-500', 'bg-care-500', 'bg-accent-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500'];
                  return (
                    <div key={diagnosis} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-700 min-w-[140px] truncate">{diagnosis}</span>
                      <div className="flex-1 h-6 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(percentage, 5)}%` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          className={`h-full rounded-full ${colors[i % colors.length]} flex items-center justify-end px-2`}>
                          <span className="text-[10px] font-bold text-white">{count}</span>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No diagnosis data available yet.</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={BarChart3} title="Monthly Referral Trends" subtitle="Referrals over time" />
          <CardBody className="pt-0">
            {monthlyData.length > 0 ? (
              <div className="space-y-3">
                {monthlyData.slice(-6).map((item, i) => {
                  const maxCount = Math.max(...monthlyData.slice(-6).map(m => m.count));
                  const height = maxCount > 0 ? Math.max((item.count / maxCount) * 100, 8) : 8;
                  return (
                    <div key={item.month} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-500 min-w-[70px]">{item.month}</span>
                      <div className="flex-1 h-7 rounded-full bg-slate-100 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${height}%` }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-care-500 flex items-center justify-end px-2">
                          <span className="text-[10px] font-bold text-white">{item.count}</span>
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No trend data available yet.</p>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader icon={Activity} title="Referral Status Breakdown" subtitle="Current distribution" />
          <CardBody className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Submitted', count: referrals.filter(r => r.referralStatus === 'submitted').length, color: 'bg-amber-500', variant: 'warning' },
                { label: 'In Progress', count: inProgressReferrals, color: 'bg-brand-500', variant: 'info' },
                { label: 'Completed', count: completedReferrals, color: 'bg-emerald-500', variant: 'success' },
                { label: 'Cancelled', count: referrals.filter(r => r.referralStatus === 'cancelled').length, color: 'bg-red-500', variant: 'danger' },
              ].map(item => (
                <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 text-center">
                  <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                  <Badge variant={item.variant} className="mt-1">{item.label}</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={TrendingUp} title="Key Metrics" subtitle="Performance indicators" />
          <CardBody className="pt-0 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs text-slate-500">Avg. Referrals / Month</p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {monthlyData.length > 0 ? Math.round(totalReferrals / monthlyData.length) : 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs text-slate-500">Avg. Appointments / Month</p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {monthlyData.length > 0 ? Math.round(appointments.length / Math.max(monthlyData.length, 1)) : 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs text-slate-500">Prescriptions Issued</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{prescriptions.length}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs text-slate-500">Unique Diagnoses</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{Object.keys(diagnosisCounts).length}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
