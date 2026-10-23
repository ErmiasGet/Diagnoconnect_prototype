import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { CalendarClock, MapPin, Microscope, FileText, Clock, ArrowLeft, CalendarX, CheckCircle2, XCircle, AlertCircle, Phone, Mail, User } from 'lucide-react';

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  { key: 'cancelled', label: 'Cancelled', icon: XCircle },
];

export default function AppointmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/appointments`)
      .then(r => {
        const found = r.data.find(a => a._id === id);
        setAppt(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="py-20 text-center text-sm text-slate-500">Loading...</div>;
  if (!appt) return (
    <div className="py-20 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">Appointment not found.</p>
      <Link to="/app/appointment-history" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to history
      </Link>
    </div>
  );

  const currentStepIndex = statusSteps.findIndex(s => s.key === appt.status);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Appointment"
        title="Appointment Details"
        description={`Ref: ${String(appt._id).slice(-8).toUpperCase()}`}
        actions={
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/app/appointment-history')} className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            {(appt.status === 'pending' || appt.status === 'confirmed') && (
              <Link to={`/app/reschedule-appointment/${appt._id}`}>
                <Button type="button" variant="secondary" className="inline-flex items-center gap-2">
                  <CalendarX className="h-4 w-4" /> Reschedule
                </Button>
              </Link>
            )}
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader icon={CalendarClock} title="Appointment Information" />
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Date & Time</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">
                  {new Date(appt.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-slate-600">{new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Status</p>
                <div className="mt-1">
                  <Badge variant={statusVariant(appt.status)} className="text-sm">{appt.status}</Badge>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Service Type</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{appt.serviceType || 'Not specified'}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Created</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{new Date(appt.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            {appt.notes && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-medium text-slate-500">Notes</p>
                <p className="text-sm text-slate-700 mt-1">{appt.notes}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={Microscope} title="Diagnostic Center" />
          <CardBody className="space-y-3">
            {appt.centerId ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-sm">
                    <Microscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{appt.centerId.centerName}</p>
                    {appt.centerId.location && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {appt.centerId.location}
                      </p>
                    )}
                  </div>
                </div>
                {appt.centerId.availableServices?.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-semibold text-slate-500 mb-2">Available Services</p>
                    <div className="flex flex-wrap gap-1">
                      {appt.centerId.availableServices.map(s => (
                        <span key={s} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">Center information not available.</p>
            )}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader icon={Clock} title="Status Timeline" />
        <CardBody>
          <div className="flex items-center gap-2">
            {statusSteps.map((step, i) => {
              const isActive = i <= currentStepIndex && appt.status !== 'cancelled';
              const isCancelled = appt.status === 'cancelled';
              const Icon = step.icon;
              return (
                <div key={step.key} className={`flex-1 relative ${i < statusSteps.length - 1 ? 'after:absolute after:left-[60%] after:top-5 after:h-0.5 after:w-[80%] after:bg-slate-200' : ''}`}>
                  <div className="flex flex-col items-center text-center">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isCancelled && step.key === 'cancelled' ? 'bg-red-100 text-red-600' :
                      isActive ? 'bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-md' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className={`mt-2 text-xs font-semibold ${
                      isActive && !isCancelled ? 'text-brand-700' : 'text-slate-400'
                    }`}>{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
