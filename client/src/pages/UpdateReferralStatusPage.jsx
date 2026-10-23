import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, SelectInput, TextArea } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Stethoscope, Send, ArrowLeft, AlertCircle, CheckCircle2, Upload, FileText } from 'lucide-react';

export default function UpdateReferralStatusPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [referral, setReferral] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get('/referrals').then(r => {
      const found = r.data.find(ref => ref._id === id);
      setReferral(found || null);
      if (found) setStatus(found.referralStatus);
    }).finally(() => setLoading(false));
  }, [id]);

  const update = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { status, diagnosticRequestNotes: notes || referral?.diagnosticRequestNotes };
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/upload', formData);
        payload.attachmentUrl = data.url || data.fileUrl;
      }
      await api.put(`/referrals/${id}`, payload);
      setSuccess(true);
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-500">Loading...</div>;
  if (!referral) return (
    <div className="py-20 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">Referral not found.</p>
      <Button type="button" variant="secondary" onClick={() => navigate('/app/referral-progress')} className="mt-4">Back</Button>
    </div>
  );

  if (success) {
    return (
      <div className="space-y-8">
        <SectionHeader eyebrow="Referral" title="Status Updated" />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Referral Status Updated</h2>
            <p className="text-sm text-slate-600 mt-2">{referral.diagnosisType} is now <strong>{status}</strong>.</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => navigate('/app/referral-progress')}>View Progress</Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/app/doctor-create-referral')}>New Referral</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Referral"
        title="Update Referral Status"
        description={`${referral.diagnosisType} — ${referral.patientId?.userId?.fullName || 'Patient'}`}
        actions={
          <Button type="button" variant="secondary" onClick={() => navigate('/app/referral-progress')} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader icon={FileText} title="Current Status" />
          <CardBody className="space-y-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Diagnosis</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{referral.diagnosisType}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Patient</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{referral.patientId?.userId?.fullName || '—'}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Current Status</p>
              <div className="mt-1"><Badge variant={statusVariant(referral.referralStatus)}>{referral.referralStatus}</Badge></div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Created</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{new Date(referral.createdAt).toLocaleDateString()}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader icon={Send} title="Update Status" subtitle="Change the referral status and add notes." />
          <CardBody>
            <form onSubmit={update} className="space-y-4">
              <div>
                <FieldLabel>New Status</FieldLabel>
                <SelectInput className="mt-1.5" value={status} onChange={e => setStatus(e.target.value)} required>
                  <option value="submitted">Submitted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Notes / Update</FieldLabel>
                <TextArea className="mt-1.5" rows={5} value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Add update notes, results summary, or comments about this referral..." />
              </div>
              <div>
                <FieldLabel>Attach Document (optional)</FieldLabel>
                <label className="mt-1.5 cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                  <Upload className="h-4 w-4" /> {file ? file.name : 'Choose File'}
                  <input type="file" className="hidden" accept=".pdf,.jpg,.png,.doc,.docx" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                <Send className="h-4 w-4" /> Update Status
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
