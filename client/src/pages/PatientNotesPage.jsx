import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, TextArea, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { ClipboardList, Save, Stethoscope, AlertCircle, ArrowLeft, User, FileText, Clock, Trash2 } from 'lucide-react';

export default function PatientNotesPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ noteType: 'clinical_note', content: '', title: '' });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    Promise.all([
      api.get('/patients').then(r => {
        const found = r.data.find(p => p.userId?._id === patientId || p._id === patientId);
        setPatient(found || null);
      }),
      api.get('/medical-records').then(r => {
        const patientNotes = r.data.filter(rec =>
          (rec.patientId === patientId || rec.patientId?._id === patientId) &&
          rec.recordType === 'clinical_note'
        );
        setNotes(patientNotes);
      }),
    ]).finally(() => setLoading(false));
  }, [patientId]);

  const submitNote = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        patientId: patient?._id || patientId,
        recordType: 'clinical_note',
        title: form.title || `Clinical Note - ${new Date().toLocaleDateString()}`,
        description: form.content,
        tags: [form.noteType],
      };
      const { data } = await api.post('/medical-records', payload);
      setNotes(prev => [...prev, data]);
      setForm({ noteType: 'clinical_note', content: '', title: '' });
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/medical-records/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
    } catch {
      // handled silently
    }
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-500">Loading...</div>;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Clinical Notes"
        title={patient?.userId?.fullName ? `Notes: ${patient.userId.fullName}` : 'Patient Notes'}
        description="Add and manage clinical notes for this patient."
        actions={
          <Button type="button" variant="secondary" onClick={() => navigate(`/app/patient-medical-history/${patientId}`)} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to History
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader icon={ClipboardList} title="New Clinical Note" subtitle="Document your observations and notes." />
          <CardBody>
            <form onSubmit={submitNote} className="space-y-4">
              <div>
                <FieldLabel>Note Type</FieldLabel>
                <SelectInput className="mt-1.5" value={form.noteType} onChange={e => setForm({ ...form, noteType: e.target.value })}>
                  <option value="clinical_note">Clinical Note</option>
                  <option value="follow_up">Follow-up Note</option>
                  <option value="examination">Examination Findings</option>
                  <option value="diagnosis">Diagnosis Note</option>
                  <option value="treatment_plan">Treatment Plan</option>
                  <option value="referral_note">Referral Note</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextInput className="mt-1.5" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder={`Clinical Note - ${new Date().toLocaleDateString()}`} />
              </div>
              <div>
                <FieldLabel>Content</FieldLabel>
                <TextArea className="mt-1.5" required rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                  placeholder="Write your clinical observations, diagnosis, treatment plan, or follow-up instructions..." />
              </div>
              <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Note
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={User} title="Patient Info" />
          <CardBody className="space-y-3">
            {patient ? (
              <>
                <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-sm mb-2">
                    <User className="h-6 w-6" />
                  </div>
                  <p className="font-semibold text-slate-900">{patient.userId?.fullName}</p>
                  <p className="text-xs text-slate-500">{patient.age || '—'} yrs · {patient.gender || '—'}</p>
                </div>
                {patient.bloodGroup && (
                  <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                    <p className="text-xs text-slate-500">Blood Group</p>
                    <p className="text-sm font-semibold text-slate-900">{patient.bloodGroup}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Patient not found.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {notes.length > 0 && (
        <Card>
          <CardHeader icon={FileText} title="Previous Notes" subtitle={`${notes.length} records`} />
          <CardBody className="pt-0 space-y-3">
            {notes.map((n, i) => (
              <motion.div key={n._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-900">{n.title}</p>
                      <Badge variant="default">{n.tags?.[0] || 'clinical_note'}</Badge>
                    </div>
                    {n.description && <p className="text-sm text-slate-600 mt-2 whitespace-pre-wrap">{n.description}</p>}
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" className="!px-2 !py-1 text-red-500 shrink-0" onClick={() => deleteNote(n._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
