import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, TextArea } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { CalendarClock, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react';

export default function RescheduleAppointmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appt, setAppt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!id) return;
    api.get('/appointments')
      .then(r => {
        const found = r.data.find(a => a._id === id);
        setAppt(found || null);
        if (found) {
          setNewDate(found.appointmentDate ? new Date(found.appointmentDate).toISOString().slice(0, 16) : '');
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const reschedule = async (e) => {
    e.preventDefault();
    if (!newDate) return;
    setSubmitting(true);
    try {
      await api.put(`/appointments/${id}`, {
        appointmentDate: newDate,
        status: 'rescheduled',
        notes: reason ? `Rescheduled: ${reason}` : 'Rescheduled',
      });
      navigate(`/app/appointment-details/${id}`);
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-500">Loading...</div>;
  if (!appt) return (
    <div className="py-20 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">Appointment not found.</p>
      <Button type="button" variant="secondary" onClick={() => navigate('/app/appointment-history')} className="mt-4">
        Back to history
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Scheduling"
        title="Reschedule Appointment"
        description="Change the date and time of your appointment."
        actions={
          <Button type="button" variant="secondary" onClick={() => navigate(`/app/appointment-details/${id}`)} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader icon={CalendarClock} title="Current Appointment" />
          <CardBody>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <p className="text-xs text-slate-500">Date & Time</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                  {new Date(appt.appointmentDate).toLocaleDateString()} {new Date(appt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <p className="text-xs text-slate-500">Center</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{appt.centerId?.centerName || '—'}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <p className="text-xs text-slate-500">Service</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{appt.serviceType || 'Not specified'}</p>
              </div>
              <div>
                <Badge variant={statusVariant(appt.status)}>{appt.status}</Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader icon={RefreshCw} title="Choose New Date & Time" subtitle="Select a new appointment slot." />
          <CardBody>
            <form onSubmit={reschedule} className="space-y-4">
              <div>
                <FieldLabel>New Date & Time</FieldLabel>
                <TextInput className="mt-1.5" type="datetime-local" required value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
              <div>
                <FieldLabel>Reason for rescheduling (optional)</FieldLabel>
                <TextArea className="mt-1.5" value={reason} onChange={e => setReason(e.target.value)} placeholder="Let the center know why you're rescheduling..." />
              </div>
              <div className="flex gap-3">
                <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" /> Confirm Reschedule
                </Button>
                <Button type="button" variant="secondary" onClick={() => navigate(`/app/appointment-details/${id}`)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
