import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, TextArea, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { ClipboardList, Plus, Pill, CheckCircle2, Trash2, Search, User } from 'lucide-react';

export default function DoctorUploadPrescriptionPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form, setForm] = useState({
    patientId: '',
    medications: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }],
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/patients').then(r => setPatients(r.data)).catch(() => {});
  }, []);

  const filteredPatients = patients.filter(p =>
    !patientSearch || p.userId?.fullName?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.userId?.phone?.includes(patientSearch)
  );

  const selectPatient = (p) => {
    setSelectedPatient(p);
    setForm({ ...form, patientId: p.userId?._id || p._id });
    setPatientSearch(p.userId?.fullName || '');
  };

  const addMedication = () => {
    setForm({ ...form, medications: [...form.medications, { name: '', dosage: '', frequency: '', duration: '', notes: '' }] });
  };

  const updateMed = (i, field, value) => {
    const meds = [...form.medications];
    meds[i] = { ...meds[i], [field]: value };
    setForm({ ...form, medications: meds });
  };

  const removeMed = (i) => {
    if (form.medications.length <= 1) return;
    setForm({ ...form, medications: form.medications.filter((_, idx) => idx !== i) });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.patientId) return;
    setSubmitting(true);
    try {
      await api.post('/prescriptions', {
        patientId: form.patientId,
        medications: form.medications,
        notes: form.notes,
      });
      setSuccess(true);
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="space-y-8">
        <SectionHeader eyebrow="Prescription" title="Prescription Created" />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-care-500 text-white shadow-lg mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Prescription Issued Successfully</h2>
            <p className="text-sm text-slate-600 mt-2">Prescription with {form.medications.length} medication(s) has been issued to {selectedPatient?.userId?.fullName || 'the patient'}.</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => { setSuccess(false); setForm({ patientId: '', medications: [{ name: '', dosage: '', frequency: '', duration: '', notes: '' }], notes: '' }); setSelectedPatient(null); setPatientSearch(''); }}>
                Write Another
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/app/doctor-patients')}>
                Back to Patients
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
        eyebrow="Prescriptions"
        title="Upload Prescription"
        description="Create a digital prescription for a patient with medication details."
      />

      <Card>
        <CardHeader icon={Pill} title="Select Patient" subtitle="Search and select a patient to prescribe medication." />
        <CardBody>
          {selectedPatient ? (
            <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-sm">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{selectedPatient.userId?.fullName}</p>
                <p className="text-xs text-slate-500">{selectedPatient.bloodGroup ? `${selectedPatient.bloodGroup} · ` : ''}{selectedPatient.age || ''} yrs · {selectedPatient.gender || ''}</p>
              </div>
              <Button type="button" variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => { setSelectedPatient(null); setForm({ ...form, patientId: '' }); }}>
                Change
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput className="pl-10" placeholder="Search patients by name or phone..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} />
              </div>
              {patientSearch && (
                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {filteredPatients.map(p => (
                    <button key={p._id} type="button" onClick={() => selectPatient(p)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors">
                      <p className="text-sm font-medium text-slate-900">{p.userId?.fullName || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{p.userId?.phone || '—'} · {p.bloodGroup || '—'}</p>
                    </button>
                  ))}
                  {!filteredPatients.length && <p className="p-4 text-sm text-slate-500 text-center">No patients found.</p>}
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {selectedPatient && (
        <Card>
          <CardHeader icon={ClipboardList} title="Prescription Details" subtitle="Add medications and dosage instructions." />
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
              {form.medications.map((med, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">Medication {i + 1}</p>
                    {form.medications.length > 1 && (
                      <Button type="button" variant="ghost" className="!px-2 !py-1 text-red-500" onClick={() => removeMed(i)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <FieldLabel>Medication Name</FieldLabel>
                      <TextInput className="mt-1" required value={med.name} onChange={e => updateMed(i, 'name', e.target.value)} placeholder="e.g. Amoxicillin" />
                    </div>
                    <div>
                      <FieldLabel>Dosage</FieldLabel>
                      <TextInput className="mt-1" value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)} placeholder="e.g. 500mg" />
                    </div>
                    <div>
                      <FieldLabel>Frequency</FieldLabel>
                      <TextInput className="mt-1" value={med.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)} placeholder="e.g. Twice daily" />
                    </div>
                    <div>
                      <FieldLabel>Duration</FieldLabel>
                      <TextInput className="mt-1" value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)} placeholder="e.g. 7 days" />
                    </div>
                    <div className="sm:col-span-2">
                      <FieldLabel>Instructions</FieldLabel>
                      <TextInput className="mt-1" value={med.notes} onChange={e => updateMed(i, 'notes', e.target.value)} placeholder="e.g. Take after meals" />
                    </div>
                  </div>
                </motion.div>
              ))}

              <Button type="button" variant="secondary" onClick={addMedication} className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Medication
              </Button>

              <div>
                <FieldLabel>Additional Notes</FieldLabel>
                <TextArea className="mt-1.5" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="General prescription notes or instructions..." />
              </div>

              <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                <ClipboardList className="h-4 w-4" /> Issue Prescription
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
