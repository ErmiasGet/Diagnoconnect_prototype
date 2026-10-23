import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Stethoscope, Clock, CheckCircle2, XCircle, Eye, ArrowRight, Send, Search } from 'lucide-react';

const trackSteps = [
  { key: 'submitted', label: 'Submitted', icon: Send, desc: 'Referral has been submitted' },
  { key: 'in_progress', label: 'In Progress', icon: Clock, desc: 'Being processed by the center' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, desc: 'Diagnostics completed' },
  { key: 'cancelled', label: 'Cancelled', icon: XCircle, desc: 'Referral was cancelled' },
];

export default function ReferralTrackingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/referrals')
      .then(r => setRows(r.data))
      .finally(() => setLoading(false));
  }, []);

  const activeReferrals = rows.filter(r => r.referralStatus !== 'cancelled');
  const completedReferrals = rows.filter(r => r.referralStatus === 'completed');

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Tracking"
        title="Referral Tracking"
        description="Monitor the progress of your diagnostic referrals in real time."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-slate-900">{rows.length}</p>
            <p className="text-sm text-slate-500 mt-1">Total Referrals</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-amber-600">{activeReferrals.length}</p>
            <p className="text-sm text-slate-500 mt-1">Active</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-emerald-600">{completedReferrals.length}</p>
            <p className="text-sm text-slate-500 mt-1">Completed</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader icon={Stethoscope} title="Active Referrals" subtitle={loading ? 'Loading...' : `${activeReferrals.length} in progress`} />
        <CardBody className="pt-0 space-y-4">
          {activeReferrals.map((r, i) => {
            const stepIndex = trackSteps.findIndex(s => s.key === r.referralStatus);
            return (
              <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-semibold text-slate-900">{r.diagnosisType}</p>
                    <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={statusVariant(r.referralStatus)}>{r.referralStatus}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  {trackSteps.filter(s => s.key !== 'cancelled').map((step, si) => {
                    const isActive = si <= (stepIndex >= 0 ? stepIndex : -1) && r.referralStatus !== 'cancelled';
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className={`flex-1 relative ${si < 2 ? 'after:absolute after:left-[60%] after:top-4 after:h-0.5 after:w-[80%] after:bg-slate-200' : ''}`}>
                        <div className="flex flex-col items-center text-center">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isActive ? 'bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-sm' : 'bg-slate-100 text-slate-400'
                          }`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className={`mt-1 text-[10px] font-medium ${isActive ? 'text-brand-700' : 'text-slate-400'}`}>{step.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
          {!activeReferrals.length && !loading && (
            <p className="text-sm text-slate-500 text-center py-6">No active referrals.</p>
          )}
        </CardBody>
      </Card>

      {completedReferrals.length > 0 && (
        <Card>
          <CardHeader icon={CheckCircle2} title="Completed Referrals" subtitle={`${completedReferrals.length} finished`} />
          <CardBody className="pt-0 space-y-2">
            {completedReferrals.map((r, i) => (
              <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.diagnosisType}</p>
                  <p className="text-xs text-slate-500">{new Date(r.updatedAt).toLocaleDateString()}</p>
                </div>
                <Link to={`/app/referral-details/${r._id}`}>
                  <Button type="button" variant="ghost" className="!px-3 !py-1 text-xs inline-flex items-center gap-1">
                    View <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
