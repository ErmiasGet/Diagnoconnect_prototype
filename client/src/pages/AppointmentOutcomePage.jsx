import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextArea, SelectInput, FormGrid } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { CheckCircle2, ArrowLeft, CalendarClock, Stethoscope, FileText, Save, AlertCircle } from 'lucide-react';

export default function AppointmentOutcomePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appt, setAppt] = useState(null);
  const [outcome, setOutcome] = useState('completed');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prescription, setPrescription] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get('/appointments')
      .then(r => {
        const found = r.data.find(a => a._id === id);
        setAppt(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const notes = [
        `Outcome: ${outcome}`,
        diagnosis ? `Diagnosis: ${diagnosis}` : '',
        treatment ? `Treatment: ${treatment}` : '',
        prescription ? `Prescription: ${prescription}` : '',
        followUp ? `Follow-up: ${followUp}` : '',
      ].filter(Boolean).join('\n');

      await api.put(`/appointments/${id}`, { status: outcome, notes });
      setSuccess(true);
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
      <Button type="button" variant="secondary" onClick={() => navigate('/app/doctor-appointments')} className="mt-4">Back</Button>
    </div>
  );

  if (success) {
    return (
      <div className="space-y-8">
        <SectionHeader eyebrow="Outcome" title="Appointment Completed" />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Appointment Outcome Recorded</h2>
            <p className="text-sm text-slate-600 mt-2">The appointment has been marked as <strong>{outcome}</strong> with all clinical notes saved.</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => navigate('/app/doctor-appointments')}>Back to Schedule</Button>
              <Button type="button" variant="secondary" onClick={() => navigate(`/app/appointment-details/${id}`)}>View Details</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Outcome"
        title="Update Appointment Outcome"
        description={`${new Date(appt.appointmentDate).toLocaleDateString()} · ${appt.centerId?.centerName || '—'} · ${appt.serviceType || '—'}`}
        actions={
          <Button type="button" variant="secondary" onClick={() => navigate('/app/doctor-appointments')} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader icon={CalendarClock} title="Appointment Info" />
          <CardBody className="space-y-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Date & Time</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{new Date(appt.appointmentDate).toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Center</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{appt.centerId?.centerName || '—'}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Service</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{appt.serviceType || '—'}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Current Status</p>
              <div className="mt-1"><Badge variant={statusVariant(appt.status)}>{appt.status}</Badge></div>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader icon={Stethoscope} title="Clinical Outcome" subtitle="Document the results of this consultation." />
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
              <FormGrid>
                <div className="sm:col-span-2">
                  <FieldLabel>Outcome</FieldLabel>
                  <SelectInput className="mt-1.5" value={outcome} onChange={e => setOutcome(e.target.value)}>
                    <option value="completed">Completed — Consultation done</option>
                    <option value="cancelled">Cancelled — Did not take place</option>
                    <option value="rescheduled">Rescheduled — Needs new appointment</option>
                  </SelectInput>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel><Stethoscope className="h-3.5 w-3.5 inline mr-1" />Diagnosis</FieldLabel>
                  <TextArea className="mt-1.5" rows={3} value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                    placeholder="Primary diagnosis and findings..." />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel><FileText className="h-3.5 w-3.5 inline mr-1" />Treatment Plan</FieldLabel>
                  <TextArea className="mt-1.5" rows={3} value={treatment} onChange={e => setTreatment(e.target.value)}
                    placeholder="Treatment plan, procedures performed, or recommendations..." />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Prescription Notes</FieldLabel>
                  <TextArea className="mt-1.5" rows={2} value={prescription} onChange={e => setPrescription(e.target.value)}
                    placeholder="Medications prescribed, dosages, and instructions..." />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Follow-up</FieldLabel>
                  <TextInput className="mt-1.5" value={followUp} onChange={e => setFollowUp(e.target.value)}
                    placeholder="e.g. Follow-up in 2 weeks, Refer to specialist..." />
                </div>
              </FormGrid>
              <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Outcome
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
