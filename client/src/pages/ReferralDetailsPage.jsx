import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { FileText, Stethoscope, MapPin, Calendar, ArrowLeft, AlertCircle, Clock, CheckCircle2, XCircle, User, Activity } from 'lucide-react';

export default function ReferralDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get('/referrals')
      .then(r => {
        const found = r.data.find(ref => ref._id === id);
        setReferral(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center text-sm text-slate-500">Loading...</div>;
  if (!referral) return (
    <div className="py-20 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">Referral not found.</p>
      <Link to="/app/referral-list" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to list
      </Link>
    </div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Referral"
        title="Referral Details"
        description={`Diagnosis: ${referral.diagnosisType}`}
        actions={
          <Button type="button" variant="secondary" onClick={() => navigate('/app/referral-list')} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader icon={FileText} title="Referral Information" />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Diagnosis Type</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{referral.diagnosisType}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Status</p>
                <div className="mt-1">
                  <Badge variant={statusVariant(referral.referralStatus)} className="text-sm">{referral.referralStatus}</Badge>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Created</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{new Date(referral.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Last Updated</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{new Date(referral.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            {referral.diagnosticRequestNotes && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Clinical Notes</p>
                <p className="text-sm text-slate-700 mt-1">{referral.diagnosticRequestNotes}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={Activity} title="Recommended Centers" subtitle={`${referral.recommendedCenterIds?.length || 0} centers`} />
          <CardBody className="space-y-3">
            {referral.recommendedCenterIds?.length > 0 ? (
              referral.recommendedCenterIds.map((c, i) => (
                <motion.div key={c._id || i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{c.centerName || 'Center'}</p>
                    {c.location && <p className="text-xs text-slate-500">{c.location}</p>}
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No centers recommended.</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
