import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { FileText, Heart, AlertCircle, Droplets, User, Calendar, Activity, Pill, Stethoscope, ArrowLeft, AlertTriangle, File, Image, ClipboardList } from 'lucide-react';

const typeColors = {
  lab_result: 'info', imaging: 'warning', prescription: 'success',
  clinical_note: 'default', report: 'default', other: 'muted',
};

export default function PatientMedicalHistoryPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const patientQuery = patientId?.length === 24 ? { userId: patientId } : { _id: patientId };

  useEffect(() => {
    if (!patientId) return;
    setLoading(true);
    Promise.all([
      api.get('/patients').then(r => {
        const found = r.data.find(p =>
          p.userId?._id === patientId || p._id === patientId
        );
        setPatient(found || null);
      }),
      api.get('/medical-records').then(r => {
        const filtered = r.data.filter(rec =>
          rec.patientId === patientId || rec.patientId?._id === patientId
        );
        setRecords(filtered);
      }),
      api.get('/prescriptions').then(r => {
        const filtered = r.data.filter(p =>
          p.patientId === patientId || p.patientId?._id === patientId
        );
        setPrescriptions(filtered);
      }),
    ]).finally(() => setLoading(false));
  }, [patientId]);

  if (loading) return <div className="py-20 text-center text-sm text-slate-500">Loading patient data...</div>;

  if (!patient) return (
    <div className="py-20 text-center">
      <AlertTriangle className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">Patient not found.</p>
      <Button type="button" variant="secondary" onClick={() => navigate('/app/doctor-patients')} className="mt-4">Back to patients</Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Medical History"
        title={patient.userId?.fullName || 'Patient'}
        description="Comprehensive view of patient medical records, history, and prescriptions."
        actions={
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={() => navigate('/app/doctor-patients')} className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <Link to={`/app/patient-notes/${patientId}`}>
              <Button type="button" className="inline-flex items-center gap-2">
                <ClipboardList className="h-4 w-4" /> Add Notes
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader icon={User} title="Patient Info" />
          <CardBody className="space-y-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Age / Gender</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{patient.age || '—'} yrs · {patient.gender || '—'}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Blood Group</p>
              <p className="text-sm font-semibold text-slate-900 mt-0.5 flex items-center gap-1"><Droplets className="h-4 w-4 text-red-500" /> {patient.bloodGroup || '—'}</p>
            </div>
            {patient.userId?.phone && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <p className="text-xs text-slate-500">Phone</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{patient.userId.phone}</p>
              </div>
            )}
            {patient.userId?.email && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5 truncate">{patient.userId.email}</p>
              </div>
            )}
            {patient.address && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <p className="text-xs text-slate-500">Address</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{patient.address}</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader icon={Heart} title="Medical Conditions" />
          <CardBody className="space-y-4">
            {patient.medicalHistory?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Medical History</p>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory.map((item, i) => (
                    <span key={i} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 border border-brand-100">{item}</span>
                  ))}
                </div>
              </div>
            )}
            {patient.allergies?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((item, i) => (
                    <span key={i} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-100">{item}</span>
                  ))}
                </div>
              </div>
            )}
            {patient.chronicConditions?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Chronic Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {patient.chronicConditions.map((item, i) => (
                    <span key={i} className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-800 border border-purple-100">{item}</span>
                  ))}
                </div>
              </div>
            )}
            {!patient.medicalHistory?.length && !patient.allergies?.length && !patient.chronicConditions?.length && (
              <p className="text-sm text-slate-500 text-center py-6">No medical conditions recorded.</p>
            )}
          </CardBody>
        </Card>
      </div>

      {prescriptions.length > 0 && (
        <Card>
          <CardHeader icon={Pill} title="Prescriptions" subtitle={`${prescriptions.length} total`} />
          <CardBody className="pt-0 space-y-3">
            {prescriptions.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={p.isActive !== false ? 'success' : 'muted'}>{p.isActive !== false ? 'Active' : 'Inactive'}</Badge>
                  <span className="text-xs text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                </div>
                {p.medications?.map((m, mi) => (
                  <div key={mi} className="text-sm text-slate-700 bg-white rounded-lg border border-slate-100 px-3 py-2 mt-2">
                    <span className="font-medium">{m.name}</span>
                    {m.dosage && <span className="text-slate-500"> — {m.dosage}</span>}
                    {m.frequency && <span className="text-slate-500"> · {m.frequency}</span>}
                    {m.duration && <span className="text-slate-500"> · {m.duration}</span>}
                  </div>
                ))}
                {p.notes && <p className="text-xs text-slate-500 mt-2 italic">{p.notes}</p>}
              </motion.div>
            ))}
          </CardBody>
        </Card>
      )}

      {records.length > 0 && (
        <Card>
          <CardHeader icon={FileText} title="Medical Records" subtitle={`${records.length} documents`} />
          <CardBody className="pt-0 space-y-3">
            {records.map((r, i) => (
              <motion.div key={r._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                    {r.recordType === 'imaging' ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                      <Badge variant={typeColors[r.recordType] || 'default'}>{r.recordType?.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {r.fileUrl && (
                  <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button type="button" variant="ghost" className="!px-3 !py-1 text-xs">View</Button>
                  </a>
                )}
              </motion.div>
            ))}
          </CardBody>
        </Card>
      )}

      {!prescriptions.length && !records.length && (
        <Card>
          <CardBody className="py-10 text-center">
            <Activity className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No medical records or prescriptions found for this patient.</p>
            <div className="flex justify-center gap-3 mt-4">
              <Link to={`/app/patient-notes/${patientId}`}>
                <Button type="button" variant="secondary" className="text-xs">Add Clinical Notes</Button>
              </Link>
              <Link to={`/app/doctor-upload-prescription`}>
                <Button type="button" className="text-xs">Write Prescription</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
