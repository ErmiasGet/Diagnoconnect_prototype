import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, SelectInput, TextInput, TextArea } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { AlertTriangle, Send, CheckCircle2, Shield, AlertCircle, Scale, UserX, Clock } from 'lucide-react';

const complaintCategories = [
  { value: 'service', label: 'Service Issue', icon: AlertCircle },
  { value: 'billing', label: 'Billing Dispute', icon: Scale },
  { value: 'staff', label: 'Staff Conduct', icon: UserX },
  { value: 'delay', label: 'Delay/No-Show', icon: Clock },
  { value: 'other', label: 'Other', icon: Shield },
];

export default function ComplaintPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ category: 'service', subject: '', description: '', relatedId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const desc = `[${form.category}] ${form.subject}\n\n${form.description}${form.relatedId ? `\n\nRelated ID: ${form.relatedId}` : ''}`;
      await api.post('/contact', { to: 'support@diagnoconnect.com', subject: `Complaint: ${form.subject}`, message: desc });
      setSuccess(true);
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="space-y-8">
        <SectionHeader eyebrow="Support" title="Complaint Filed" />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-care-500 text-white shadow-lg mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Complaint Registered</h2>
            <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
              Your complaint has been received. Our support team will review and respond within 48 hours. A confirmation has been sent to your notifications.
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => { setSuccess(false); setForm({ category: 'service', subject: '', description: '', relatedId: '' }); }}>
                File Another
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/app')}>
                Back to Dashboard
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
        eyebrow="Support"
        title="File a Complaint"
        description="We take your concerns seriously. Submit a complaint and our team will address it promptly."
      />

      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-white">
        <CardBody className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <p className="text-sm text-red-800">
            For urgent or critical issues, please contact support directly. This form is for non-urgent complaints and will be reviewed within 48 hours.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={Shield} title="Complaint Details" subtitle="Provide as much detail as possible to help us resolve your issue." />
        <CardBody>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <FieldLabel>Category</FieldLabel>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                {complaintCategories.map(cat => {
                  const Icon = cat.icon;
                  return (
                    <button key={cat.value} type="button" onClick={() => setForm({ ...form, category: cat.value })}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                        form.category === cat.value ? 'border-red-500 bg-red-50 text-red-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}>
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px]">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <FieldLabel>Subject</FieldLabel>
              <TextInput className="mt-1.5" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Brief summary of your complaint" />
            </div>

            <div>
              <FieldLabel>Description</FieldLabel>
              <TextArea className="mt-1.5" required rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Please describe what happened in detail. Include dates, names, and any relevant information..." />
            </div>

            <div>
              <FieldLabel>Related ID (optional)</FieldLabel>
              <TextInput className="mt-1.5 font-mono text-xs" value={form.relatedId} onChange={e => setForm({ ...form, relatedId: e.target.value })}
                placeholder="Appointment ID, invoice number, or referral ID if applicable" />
            </div>

            <Button type="submit" loading={submitting} variant="danger" className="inline-flex items-center gap-2">
              <Send className="h-4 w-4" /> Submit Complaint
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
