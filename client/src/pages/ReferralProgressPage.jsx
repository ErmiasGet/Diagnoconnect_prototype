import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { SelectInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { Stethoscope, Clock, CheckCircle2, XCircle, Send, Eye, TrendingUp, FileText, ArrowRight, Filter, User, Activity } from 'lucide-react';

export default function ReferralProgressPage() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/referrals').then(r => { setReferrals(r.data); setFiltered(r.data); }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (statusFilter === 'all') setFiltered(referrals);
    else setFiltered(referrals.filter(r => r.referralStatus === statusFilter));
  }, [statusFilter, referrals]);

  const total = referrals.length;
  const submitted = referrals.filter(r => r.referralStatus === 'submitted').length;
  const inProgress = referrals.filter(r => r.referralStatus === 'in_progress').length;
  const completed = referrals.filter(r => r.referralStatus === 'completed').length;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Referrals"
        title="Referral Progress"
        description="Monitor and track all your diagnostic referrals."
        actions={
          <Link to="/app/doctor-create-referral">
            <Button type="button" className="inline-flex items-center gap-2">
              <FileText className="h-4 w-4" /> New Referral
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-slate-900">{total}</p><p className="text-xs text-slate-500">Total</p></CardBody></Card>
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-amber-600">{submitted}</p><p className="text-xs text-slate-500">Submitted</p></CardBody></Card>
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-brand-600">{inProgress}</p><p className="text-xs text-slate-500">In Progress</p></CardBody></Card>
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-emerald-600">{completed}</p><p className="text-xs text-slate-500">Completed</p></CardBody></Card>
      </div>

      <Card>
        <CardHeader icon={Filter} title="Filter" />
        <CardBody>
          <SelectInput className="w-full sm:w-56" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Referrals</option>
            <option value="submitted">Submitted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </SelectInput>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={TrendingUp} title="Referral Progress" subtitle={loading ? 'Loading...' : `${filtered.length} referrals`} />
        <CardBody className="pt-0 space-y-3">
          {filtered.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.25) }}
              className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-sm">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900">{r.diagnosisType}</p>
                      <Badge variant={statusVariant(r.referralStatus)}>{r.referralStatus}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {r.patientId?.userId?.fullName || 'Patient'}</span>
                      <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> {new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {['submitted', 'in_progress', 'completed'].map((step, si) => {
                      const stepIndex = ['submitted', 'in_progress', 'completed'].indexOf(r.referralStatus);
                      return (
                        <div key={step} className="flex items-center">
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                            si <= stepIndex ? 'bg-gradient-to-br from-brand-500 to-care-500 text-white' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {si === 0 ? <Send className="h-3 w-3" /> : si === 1 ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                          </div>
                          {si < 2 && <div className={`h-0.5 w-3 ${si < stepIndex ? 'bg-brand-500' : 'bg-slate-200'}`} />}
                        </div>
                      );
                    })}
                  </div>
                  <Link to={`/app/update-referral-status/${r._id}`}>
                    <Button type="button" variant="secondary" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                      Update <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                  <Link to={`/app/referral-documents/${r._id}`}>
                    <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs">Docs</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          {!filtered.length && !loading && (
            <div className="py-12 text-center text-sm text-slate-500">No referrals found.</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
