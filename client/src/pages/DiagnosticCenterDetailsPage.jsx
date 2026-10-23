import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Microscope, MapPin, Phone, Mail, Clock, CalendarPlus, ArrowLeft, Star, Shield, ChevronRight, AlertCircle } from 'lucide-react';

export default function DiagnosticCenterDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get('/centers?approvedOnly=true')
      .then(r => {
        const found = r.data.find(c => c._id === id);
        setCenter(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center text-sm text-slate-500">Loading...</div>;
  if (!center) return (
    <div className="py-20 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">Center not found.</p>
      <Link to="/app/diagnostic-centers" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to centers
      </Link>
    </div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Diagnostic Center"
        title={center.centerName}
        description={center.location || 'Location on file'}
        actions={
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/app/diagnostic-centers')} className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Link to="/app/book-appointment">
              <Button type="button" className="inline-flex items-center gap-2">
                <CalendarPlus className="h-4 w-4" /> Book Appointment
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader icon={Microscope} title="About" subtitle="Center information and services" />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {center.location && (
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                  <MapPin className="h-5 w-5 shrink-0 text-brand-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Location</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{center.location}</p>
                  </div>
                </div>
              )}
              {center.contactPhone && (
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                  <Phone className="h-5 w-5 shrink-0 text-brand-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Phone</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{center.contactPhone}</p>
                  </div>
                </div>
              )}
              {center.email && (
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                  <Mail className="h-5 w-5 shrink-0 text-brand-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Email</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{center.email}</p>
                  </div>
                </div>
              )}
              {center.scheduleNotes && (
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                  <Clock className="h-5 w-5 shrink-0 text-brand-500 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500">Schedule</p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">{center.scheduleNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={Shield} title="Verification" />
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Status</span>
                <Badge variant={center.approvalStatus === 'approved' ? 'success' : 'warning'}>{center.approvalStatus || 'Pending'}</Badge>
              </div>
              {center.approvalStatus === 'approved' && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-3 text-center">
                  <Shield className="mx-auto h-8 w-8 text-emerald-500" />
                  <p className="text-sm font-semibold text-emerald-800 mt-1">Verified Center</p>
                  <p className="text-xs text-emerald-600 mt-0.5">This center is approved and active</p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader icon={Star} title="Available Services" subtitle={`${center.availableServices?.length || 0} services offered`} />
        <CardBody>
          {(center.availableServices || []).length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {center.availableServices.map((s, i) => (
                <motion.div key={s} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">{s}</span>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No services listed.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
