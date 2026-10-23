import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, TextArea, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Stethoscope, Send, Sparkles, Search, User, Microscope, CheckCircle2, Plus, X } from 'lucide-react';

export default function DoctorCreateReferralPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [centers, setCenters] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [recs, setRecs] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    diagnosisType: '',
    diagnosticRequestNotes: '',
    recommendedCenterIds: [],
    testRecommendations: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/patients').then(r => setPatients(r.data)).catch(() => {});
    api.get('/centers?approvedOnly=true').then(r => setCenters(r.data)).catch(() => {});
  }, []);

  const filteredPatients = patients.filter(p =>
    !patientSearch || p.userId?.fullName?.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const selectPatient = (p) => {
    setSelectedPatient(p);
    setForm({ ...form, patientId: p.userId?._id || p._id });
    setPatientSearch(p.userId?.fullName || '');
  };

  const toggleCenter = (id) => {
    const sid = String(id);
    const set = new Set(form.recommendedCenterIds.map(String));
    if (set.has(sid)) set.delete(sid);
    else set.add(sid);
    setForm({ ...form, recommendedCenterIds: [...set] });
  };

  const recommend = () => {
    api.get(`/referrals/recommend-centers?diagnosisType=${encodeURIComponent(form.diagnosisType || 'lab')}`)
      .then(r => setRecs(r.data)).catch(() => {});
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.patientId || !form.diagnosisType) return;
    setSubmitting(true);
    try {
      await api.post('/referrals', {
        patientId: form.patientId,
        diagnosisType: form.diagnosisType,
        diagnosticRequestNotes: `[Tests: ${form.testRecommendations.join(', ')}]\n${form.diagnosticRequestNotes}`,
        recommendedCenterIds: form.recommendedCenterIds,
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
        <SectionHeader eyebrow="Referral" title="Referral Created" />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Referral Submitted Successfully</h2>
            <p className="text-sm text-slate-600 mt-2">Referral for {selectedPatient?.userId?.fullName} ({form.diagnosisType}) has been created and sent to the recommended centers.</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => { setSuccess(false); setForm({ patientId: '', diagnosisType: '', diagnosticRequestNotes: '', recommendedCenterIds: [], testRecommendations: [] }); setSelectedPatient(null); setPatientSearch(''); }}>
                Create Another
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/app/referral-progress')}>
                View Progress
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
        eyebrow="Referral"
        title="Create Referral"
        description="Submit a structured diagnostic referral for a patient."
      />

      <Card>
        <CardHeader icon={Search} title="Select Patient" subtitle="Choose the patient for this referral." />
        <CardBody>
          {selectedPatient ? (
            <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-sm">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{selectedPatient.userId?.fullName}</p>
                <p className="text-xs text-slate-500">{selectedPatient.age || ''} yrs · {selectedPatient.gender || ''} · {selectedPatient.bloodGroup || '—'}</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => { setSelectedPatient(null); setForm({ ...form, patientId: '' }); }}>Change</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput className="pl-10" placeholder="Search patients..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} />
              </div>
              {patientSearch && (
                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {filteredPatients.map(p => (
                    <button key={p._id} type="button" onClick={() => selectPatient(p)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors">
                      <p className="text-sm font-medium text-slate-900">{p.userId?.fullName || 'Unknown'}</p>
                      <p className="text-xs text-slate-500">{p.userId?.phone || '—'}</p>
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
        <>
          <Card>
            <CardHeader icon={Stethoscope} title="Referral Details" subtitle="Diagnosis and clinical context." />
            <CardBody>
              <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldLabel>Diagnosis / Test Type</FieldLabel>
                  <TextInput className="mt-1.5" required value={form.diagnosisType} onChange={e => setForm({ ...form, diagnosisType: e.target.value })} placeholder="e.g. MRI Brain, Complete Blood Count, Ultrasound" />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Recommended Diagnostic Tests</FieldLabel>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['Blood Test', 'X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'ECG', 'Urine Test', 'CBC', 'Lipid Profile', 'Liver Function'].map(test => (
                      <button key={test} type="button" onClick={() => {
                        const set = new Set(form.testRecommendations);
                        if (set.has(test)) set.delete(test); else set.add(test);
                        setForm({ ...form, testRecommendations: [...set] });
                      }}
                        className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          form.testRecommendations.includes(test)
                            ? 'border-brand-300 bg-brand-50 text-brand-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}>
                        {form.testRecommendations.includes(test) ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                        {test}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Clinical Notes</FieldLabel>
                  <TextArea className="mt-1.5" value={form.diagnosticRequestNotes} onChange={e => setForm({ ...form, diagnosticRequestNotes: e.target.value })} placeholder="Relevant clinical information, symptoms, and reason for referral..." />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel>Recommend Diagnostic Centers</FieldLabel>
                  <div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                    {centers.map(c => (
                      <label key={c._id} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm cursor-pointer hover:border-brand-300 transition-colors">
                        <input type="checkbox" className="rounded border-slate-300 text-brand-600"
                          checked={form.recommendedCenterIds.map(String).includes(String(c._id))}
                          onChange={() => toggleCenter(c._id)} />
                        <Microscope className="h-3.5 w-3.5 text-brand-500" /> {c.centerName}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="sm:col-span-2 flex flex-wrap gap-3">
                  <Button type="button" variant="secondary" onClick={recommend} className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Smart Match Centers
                  </Button>
                  <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                    <Send className="h-4 w-4" /> Submit Referral
                  </Button>
                </div>
                {recs.length > 0 && (
                  <div className="sm:col-span-2 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-brand-900">
                    <span className="font-semibold">Suggested:</span> {recs.map(c => c.centerName).join(', ')}
                  </div>
                )}
              </form>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
