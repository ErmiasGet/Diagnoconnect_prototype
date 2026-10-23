import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FieldLabel, TextInput, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, Share2, Trash2, File, Image, FilePlus } from 'lucide-react';

const typeColors = {
  lab_result: 'info',
  imaging: 'warning',
  prescription: 'success',
  clinical_note: 'default',
  report: 'default',
  other: 'muted',
};

export default function MedicalRecordsPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', recordType: 'lab_result', title: '', description: '', tags: '' });
  const [submitting, setSubmitting] = useState(false);

  const isDoctorOrAdmin = user?.role === 'doctor' || user?.role === 'admin';

  const load = () => api.get('/medical-records').then((r) => setRecords(r.data));

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.post('/medical-records', {
      ...form,
      tags: form.tags.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setForm({ patientId: '', recordType: 'lab_result', title: '', description: '', tags: '' });
    setShowForm(false);
    await load();
    setSubmitting(false);
  };

  const remove = async (id) => {
    await api.delete(`/medical-records/${id}`);
    load();
  };

  const share = async (id) => {
    await api.post(`/medical-records/${id}/share`, { doctorIds: [] });
    load();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Health Records"
        title="Medical Records"
        description="Store, view, and manage diagnostic reports, lab results, and clinical documents."
        actions={
          isDoctorOrAdmin && (
            <Button type="button" onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2">
              <FilePlus className="h-4 w-4" /> New Record
            </Button>
          )
        }
      />

      {showForm && (
        <Card>
          <CardHeader icon={FilePlus} title="Upload Medical Record" subtitle="Attach reports, images, or clinical notes." />
          <CardBody>
            <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel>Patient ID</FieldLabel>
                <TextInput className="mt-1.5" required value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Record Type</FieldLabel>
                <SelectInput className="mt-1.5" value={form.recordType} onChange={(e) => setForm({ ...form, recordType: e.target.value })}>
                  <option value="lab_result">Lab Result</option>
                  <option value="imaging">Imaging</option>
                  <option value="prescription">Prescription</option>
                  <option value="clinical_note">Clinical Note</option>
                  <option value="report">Report</option>
                  <option value="other">Other</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Title</FieldLabel>
                <TextInput className="mt-1.5" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <TextInput className="mt-1.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Tags (comma separated)</FieldLabel>
                <TextInput className="mt-1.5" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" loading={submitting}>
                  <Upload className="h-4 w-4" /> Save Record
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader icon={FileText} title="All Records" subtitle={`${records.length} total`} />
        <CardBody className="pt-0 space-y-3">
          {records.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.25) }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                  {r.recordType === 'imaging' ? <Image className="h-5 w-5" /> : <File className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900">{r.title}</p>
                    <Badge variant={typeColors[r.recordType] || 'default'}>{r.recordType?.replace('_', ' ')}</Badge>
                  </div>
                  {r.description && <p className="text-sm text-slate-600 mt-1 line-clamp-1">{r.description}</p>}
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(r.createdAt).toLocaleDateString()} · {r.fileName || 'No file'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {r.fileUrl && (
                  <Button type="button" variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => window.open(r.fileUrl, '_blank')}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                )}
                {isDoctorOrAdmin && (
                  <>
                    <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={() => share(r._id)}>
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs text-red-600" onClick={() => remove(r._id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
          {!records.length && (
            <div className="py-12 text-center text-sm text-slate-500">No medical records yet.</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
