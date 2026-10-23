import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, TextArea } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Truck, Navigation, MapPin, Map, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function RequestAmbulancePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ pickupAddress: '', destinationAddress: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post('/ambulance', form);
      setRequestId(data._id || data.request?._id || '');
      setSuccess(true);
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="space-y-8">
        <SectionHeader eyebrow="Transport" title="Request Submitted" description="Your ambulance request has been dispatched." />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-care-500 text-white shadow-lg mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Request Submitted Successfully</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Your ambulance request has been received. A provider will be assigned shortly. Track your request in real time.
            </p>
            {requestId && (
              <p className="text-xs text-slate-400 mt-2 font-mono">Request ID: {requestId.slice(-8).toUpperCase()}</p>
            )}
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => navigate('/app/ambulance-tracking')} className="inline-flex items-center gap-2">
                <Map className="h-4 w-4" /> Track Ambulance
              </Button>
              <Button type="button" variant="secondary" onClick={() => { setSuccess(false); setForm({ pickupAddress: '', destinationAddress: '', notes: '' }); }}>
                Request Another
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Emergency"
        title="Request Ambulance"
        description="Fill in the details below to request emergency medical transport."
      />

      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-white">
        <CardBody className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800">
            For life-threatening emergencies, please call emergency services directly. This form is for non-emergency medical transport requests.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={Truck} title="Transport Details" subtitle="Provide pickup and destination information." />
        <CardBody>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel><MapPin className="h-3.5 w-3.5 inline mr-1" />Pickup Address</FieldLabel>
              <TextInput className="mt-1.5" value={form.pickupAddress} onChange={e => setForm({ ...form, pickupAddress: e.target.value })} required placeholder="Street, city, landmark..." />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel><Map className="h-3.5 w-3.5 inline mr-1" />Destination (optional)</FieldLabel>
              <TextInput className="mt-1.5" value={form.destinationAddress} onChange={e => setForm({ ...form, destinationAddress: e.target.value })} placeholder="Hospital or facility destination..." />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Special Notes</FieldLabel>
              <TextArea className="mt-1.5" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Patient condition, mobility needs, special requirements..." />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                <Navigation className="h-4 w-4" /> Dispatch Request
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
