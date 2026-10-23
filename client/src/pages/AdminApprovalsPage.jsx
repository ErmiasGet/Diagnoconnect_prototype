import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Building2, ClipboardCheck } from 'lucide-react';

export default function AdminApprovalsPage() {
  const [data, setData] = useState({ hospitals: [], centers: [] });

  const load = () => api.get('/admin/pending-institutions').then((r) => setData(r.data));

  useEffect(() => {
    load();
  }, []);

  const approveH = async (id, status = 'approved') => {
    await api.patch(`/admin/hospitals/${id}/approval`, { status });
    load();
  };
  const approveC = async (id, status = 'approved') => {
    await api.patch(`/admin/centers/${id}/approval`, { status });
    load();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Governance"
        title="Institution approvals"
        description="Review hospitals and diagnostic centers before they appear to patients and referring clinicians."
      />

      <Card>
        <CardHeader icon={Building2} title="Pending hospitals" subtitle="Approve access to the coordination network" />
        <CardBody className="pt-0 space-y-3">
          {data.hospitals?.map((h, i) => (
            <motion.div
              key={h._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <div>
                <p className="font-semibold text-slate-900">{h.name}</p>
                <p className="text-sm text-slate-600">{h.location || 'Location pending'}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={() => approveH(h._id)} className="!bg-emerald-600 hover:!bg-emerald-700">
                  Approve
                </Button>
                <Button type="button" variant="secondary" onClick={() => approveH(h._id, 'rejected')}>
                  Reject
                </Button>
              </div>
            </motion.div>
          ))}
          {!data.hospitals?.length && <p className="text-sm text-slate-500 py-6 text-center">No pending hospitals.</p>}
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={Building2} title="Pending diagnostic centers" subtitle="Validate services and coverage areas" />
        <CardBody className="pt-0 space-y-3">
          {data.centers?.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <div>
                <p className="font-semibold text-slate-900">{c.centerName}</p>
                <p className="text-sm text-slate-600">{c.location || 'Location pending'}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={() => approveC(c._id)} className="!bg-emerald-600 hover:!bg-emerald-700">
                  Approve
                </Button>
                <Button type="button" variant="secondary" onClick={() => approveC(c._id, 'rejected')}>
                  Reject
                </Button>
              </div>
            </motion.div>
          ))}
          {!data.centers?.length && <p className="text-sm text-slate-500 py-6 text-center">No pending centers.</p>}
        </CardBody>
      </Card>

      <Card className="border-dashed border-brand-200 bg-brand-50/30">
        <CardBody className="flex gap-3 items-start">
          <ClipboardCheck className="h-5 w-5 text-brand-600 shrink-0" />
          <p className="text-sm text-slate-700">
            Approved institutions immediately appear in patient search and referral recommendations where configured.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
