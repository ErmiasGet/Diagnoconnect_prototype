import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { SelectInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { FileText, Eye, Search, Filter, Stethoscope } from 'lucide-react';

export default function ReferralListPage() {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/referrals')
      .then(r => {
        setRows(r.data);
        setFiltered(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFiltered(rows);
    } else {
      setFiltered(rows.filter(r => r.referralStatus === statusFilter));
    }
  }, [statusFilter, rows]);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Clinical Workflow"
        title="My Referrals"
        description="View and track all your diagnostic referrals."
      />

      <Card>
        <CardHeader icon={Filter} title="Filter by Status" />
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
        <CardHeader icon={FileText} title="Referral List" subtitle={loading ? 'Loading...' : `${filtered.length} referrals`} />
        <CardBody className="pt-0 space-y-3">
          {filtered.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.25) }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-sm">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900">{r.diagnosisType}</p>
                  {r.diagnosticRequestNotes && (
                    <p className="text-sm text-slate-600 mt-0.5 line-clamp-1">{r.diagnosticRequestNotes}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(r.createdAt).toLocaleDateString()} · {r.recommendedCenterIds?.length || 0} centers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant={statusVariant(r.referralStatus)}>{r.referralStatus}</Badge>
                <Link to={`/app/referral-details/${r._id}`}>
                  <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> Details
                  </Button>
                </Link>
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
