import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextArea } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { Microscope, Search, User, CheckCircle2, Send, ArrowLeft, Plus, X, FlaskConical, Stethoscope } from 'lucide-react';

const testCategories = {
  'Blood Tests': ['Complete Blood Count (CBC)', 'Basic Metabolic Panel', 'Lipid Profile', 'Liver Function Test', 'Thyroid Function', 'Blood Glucose', 'HbA1c', 'Vitamin D', 'Iron Studies'],
  'Imaging': ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound', 'Mammography', 'Echocardiogram'],
  'Cardiac': ['ECG', 'Stress Test', 'Holter Monitor', 'Echocardiography'],
  'Urine & Stool': ['Urinalysis', 'Urine Culture', 'Stool Analysis', 'Stool Culture'],
  'Other': ['Allergy Test', 'Biopsy', 'Genetic Test', 'Hormone Panel', 'Tumor Markers'],
};

export default function RecommendDiagnosticTestsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get('/patients').then(r => setPatients(r.data)).catch(() => {});
  }, []);

  const filteredPatients = patients.filter(p =>
    !patientSearch || p.userId?.fullName?.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const toggleTest = (test) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter(t => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const submit = async () => {
    if (!selectedPatient || !selectedTests.length) return;
    setSubmitting(true);
    try {
      await api.post('/referrals', {
        patientId: selectedPatient.userId?._id || selectedPatient._id,
        diagnosisType: `Diagnostic Tests: ${selectedTests.join(', ')}`,
        diagnosticRequestNotes: `Recommended Tests:\n${selectedTests.map(t => `- ${t}`).join('\n')}\n\nClinical Notes:\n${clinicalNotes}`,
        recommendedCenterIds: [],
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
        <SectionHeader eyebrow="Tests" title="Tests Recommended" />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Diagnostic Tests Recommended</h2>
            <p className="text-sm text-slate-600 mt-2">{selectedTests.length} test(s) recommended for {selectedPatient?.userId?.fullName}. A referral has been created.</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => { setSuccess(false); setSelectedTests([]); setClinicalNotes(''); setSelectedPatient(null); setPatientSearch(''); }}>Recommend More</Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/app/referral-progress')}>View Referrals</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Diagnostics"
        title="Recommend Diagnostic Tests"
        description="Select and recommend specific diagnostic tests for a patient."
      />

      <Card>
        <CardHeader icon={Search} title="Select Patient" />
        <CardBody>
          {selectedPatient ? (
            <div className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/60 p-3">
              <User className="h-5 w-5 text-brand-600" />
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{selectedPatient.userId?.fullName}</p>
                <p className="text-xs text-slate-500">{selectedPatient.age || ''} yrs · {selectedPatient.gender || ''}</p>
              </div>
              <Button type="button" variant="ghost" onClick={() => { setSelectedPatient(null); setSelectedTests([]); }}>Change</Button>
            </div>
          ) : (
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <TextInput className="pl-10" placeholder="Search patients..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} />
              {patientSearch && (
                <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200 divide-y divide-slate-100">
                  {filteredPatients.map(p => (
                    <button key={p._id} type="button" onClick={() => { setSelectedPatient(p); setPatientSearch(''); }}
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
        <Card>
          <CardHeader icon={FlaskConical} title="Select Tests" subtitle={`${selectedTests.length} test(s) selected`} />
          <CardBody className="space-y-6">
            {Object.entries(testCategories).map(([category, tests]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <Microscope className="h-4 w-4 text-brand-500" /> {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tests.map(test => (
                    <button key={test} type="button" onClick={() => toggleTest(test)}
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                        selectedTests.includes(test)
                          ? 'border-brand-300 bg-brand-50 text-brand-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}>
                      {selectedTests.includes(test) ? <CheckCircle2 className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                      {test}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="border-t border-slate-100 pt-4">
              <FieldLabel>Clinical Notes (optional)</FieldLabel>
              <TextArea className="mt-1.5" rows={4} value={clinicalNotes} onChange={e => setClinicalNotes(e.target.value)}
                placeholder="Add any clinical context or specific instructions for the requested tests..." />
            </div>

            <Button type="button" onClick={submit} loading={submitting} disabled={!selectedTests.length}
              className="inline-flex items-center gap-2">
              <Send className="h-4 w-4" /> Submit Recommendations ({selectedTests.length} tests)
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
