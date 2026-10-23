import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FieldLabel, TextInput, TextArea } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Pill } from 'lucide-react';

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', medications: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }], notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get('/prescriptions').then((r) => setPrescriptions(r.data));
  useEffect(() => { load(); }, []);

  const addMedication = () => {
    setForm({ ...form, medications: [...form.medications, { name: '', dosage: '', frequency: '', duration: '', notes: '' }] });
  };

  const updateMed = (i, field, value) => {
    const meds = [...form.medications];
    meds[i] = { ...meds[i], [field]: value };
    setForm({ ...form, medications: meds });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.post('/prescriptions', { patientId: form.patientId, medications: form.medications, notes: form.notes });
    setForm({ patientId: '', medications: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }], notes: '' });
    setShowForm(false);
    await load();
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Clinical"
        title="Prescriptions"
        description="Create and manage digital prescriptions for your patients."
        actions={
          (user?.role === 'doctor' || user?.role === 'admin') && (
            <Button type="button" onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> New Prescription
            </Button>
          )
        }
      />

      {showForm && (
        <Card>
          <CardHeader icon={ClipboardList} title="Create Prescription" subtitle="Add medications and dosage instructions." />
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <FieldLabel>Patient ID</FieldLabel>
                <TextInput className="mt-1.5" required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} />
              </div>
              {form.medications.map((med, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <p className="text-xs font-semibold text-slate-500">Medication {i + 1}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldLabel>Name</FieldLabel>
                      <TextInput className="mt-1" required value={med.name} onChange={(e) => updateMed(i, 'name', e.target.value)} />
                    </div>
                    <div><FieldLabel>Dosage</FieldLabel><TextInput className="mt-1" value={med.dosage} onChange={(e) => updateMed(i, 'dosage', e.target.value)} placeholder="e.g. 500mg" /></div>
                    <div><FieldLabel>Frequency</FieldLabel><TextInput className="mt-1" value={med.frequency} onChange={(e) => updateMed(i, 'frequency', e.target.value)} placeholder="e.g. Twice daily" /></div>
                    <div><FieldLabel>Duration</FieldLabel><TextInput className="mt-1" value={med.duration} onChange={(e) => updateMed(i, 'duration', e.target.value)} placeholder="e.g. 7 days" /></div>
                    <div className="sm:col-span-2"><FieldLabel>Notes</FieldLabel><TextInput className="mt-1" value={med.notes} onChange={(e) => updateMed(i, 'notes', e.target.value)} /></div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addMedication} className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Medication
              </Button>
              <div>
                <FieldLabel>Prescription Notes</FieldLabel>
                <TextArea className="mt-1.5" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                <ClipboardList className="h-4 w-4" /> Save Prescription
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader icon={Pill} title="Prescription History" subtitle={`${prescriptions.length} total`} />
        <CardBody className="pt-0 space-y-3">
          {prescriptions.map((p, i) => (
            <motion.div
              key={p._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.25) }}
              className="rounded-xl border border-slate-100 bg-slate-50/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">Prescription</p>
                    <Badge variant={p.isActive ? 'success' : 'muted'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{p.medications?.length} medication(s) · {new Date(p.createdAt).toLocaleDateString()}</p>
                  {p.medications?.map((m, mi) => (
                    <div key={mi} className="mt-2 text-sm text-slate-700 bg-white rounded-lg border border-slate-100 px-3 py-2">
                      <span className="font-medium">{m.name}</span>
                      {m.dosage && <span className="text-slate-500"> — {m.dosage}</span>}
                      {m.frequency && <span className="text-slate-500"> · {m.frequency}</span>}
                      {m.duration && <span className="text-slate-500"> · {m.duration}</span>}
                    </div>
                  ))}
                  {p.notes && <p className="text-xs text-slate-500 mt-2 italic">{p.notes}</p>}
                </div>
              </div>
            </motion.div>
          ))}
          {!prescriptions.length && <div className="py-12 text-center text-sm text-slate-500">No prescriptions yet.</div>}
        </CardBody>
      </Card>
    </div>
  );
}
