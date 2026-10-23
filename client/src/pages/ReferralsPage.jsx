import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, SelectInput, TextInput, TextArea } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { Sparkles, Stethoscope, Send } from 'lucide-react';

export default function ReferralsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [centers, setCenters] = useState([]);
  const [recs, setRecs] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    patientId: '',
    doctorId: '',
    diagnosisType: '',
    diagnosticRequestNotes: '',
    recommendedCenterIds: [],
  });

  const load = () => api.get('/referrals').then((r) => setRows(r.data));

  useEffect(() => {
    load();
    if (user?.role === 'doctor' || user?.role === 'admin') {
      api.get('/patients').then((r) => setPatients(r.data)).catch(() => {});
      api.get('/centers?approvedOnly=true').then((r) => setCenters(r.data));
    }
    if (user?.role === 'admin') {
      api.get('/doctors').then((r) => setDoctors(r.data)).catch(() => {});
    }
  }, [user]);

  const recommend = () => {
    api
      .get(`/referrals/recommend-centers?diagnosisType=${encodeURIComponent(form.diagnosisType || 'lab')}`)
      .then((r) => setRecs(r.data));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      patientId: form.patientId,
      diagnosisType: form.diagnosisType,
      diagnosticRequestNotes: form.diagnosticRequestNotes,
      recommendedCenterIds: form.recommendedCenterIds,
    };
    if (user.role === 'admin') payload.doctorId = form.doctorId;
    await api.post('/referrals', payload);
    setForm({
      patientId: '',
      doctorId: '',
      diagnosisType: '',
      diagnosticRequestNotes: '',
      recommendedCenterIds: [],
    });
    await load();
    setSubmitting(false);
  };

  const toggleCenter = (id) => {
    const sid = String(id);
    const set = new Set(form.recommendedCenterIds.map(String));
    if (set.has(sid)) set.delete(sid);
    else set.add(sid);
    setForm({ ...form, recommendedCenterIds: [...set] });
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Clinical workflow"
        title="Referrals"
        description="Submit structured referrals, attach clinical context, and suggest diagnostic centers for faster routing."
      />

      {(user?.role === 'doctor' || user?.role === 'admin') && (
        <Card>
          <CardHeader
            icon={Stethoscope}
            title="New referral"
            subtitle="Patients receive notifications when referrals are created or updated."
          />
          <CardBody>
            <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
              {user?.role === 'admin' && (
                <div className="sm:col-span-2">
                  <FieldLabel>Doctor</FieldLabel>
                  <SelectInput
                    className="mt-1.5"
                    required
                    value={form.doctorId}
                    onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  >
                    <option value="">Select doctor profile</option>
                    {doctors.map((d) => (
                      <option key={d._id} value={d._id}>
                        {(d.userId && d.userId.fullName) || d._id} — {d.specialization || 'Doctor'}
                      </option>
                    ))}
                  </SelectInput>
                </div>
              )}
              <div className="sm:col-span-2">
                <FieldLabel>Patient</FieldLabel>
                <SelectInput
                  className="mt-1.5"
                  required
                  value={form.patientId}
                  onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                >
                  <option value="">Select patient</option>
                  {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                      {(p.userId && p.userId.fullName) || p._id}
                    </option>
                  ))}
                </SelectInput>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Diagnosis / test type</FieldLabel>
                <TextInput
                  className="mt-1.5"
                  value={form.diagnosisType}
                  onChange={(e) => setForm({ ...form, diagnosisType: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Clinical notes</FieldLabel>
                <TextArea
                  className="mt-1.5"
                  value={form.diagnosticRequestNotes}
                  onChange={(e) => setForm({ ...form, diagnosticRequestNotes: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Recommend centers</FieldLabel>
                <div className="mt-2 flex flex-wrap gap-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                  {centers.map((c) => (
                    <label
                      key={c._id}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm cursor-pointer hover:border-brand-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-brand-600"
                        checked={form.recommendedCenterIds.map(String).includes(String(c._id))}
                        onChange={() => toggleCenter(c._id)}
                      />
                      {c.centerName}
                    </label>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <Button type="button" variant="secondary" onClick={recommend} className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Smart match centers
                </Button>
                <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Submit referral
                </Button>
              </div>
              {recs.length > 0 && (
                <div className="sm:col-span-2 rounded-xl border border-brand-100 bg-brand-50/60 px-4 py-3 text-sm text-brand-900">
                  <span className="font-semibold">Suggested:</span> {recs.map((c) => c.centerName).join(', ')}
                </div>
              )}
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader icon={Stethoscope} title="Referral activity" subtitle="Statuses update as diagnostics progress" />
        <CardBody className="pt-0 space-y-3">
          {rows.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.25) }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/40 px-4 py-3"
            >
              <div>
                <p className="font-semibold text-slate-900">{r.diagnosisType}</p>
                {r.diagnosticRequestNotes && (
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{r.diagnosticRequestNotes}</p>
                )}
              </div>
              <Badge variant={statusVariant(r.referralStatus)}>{r.referralStatus}</Badge>
            </motion.div>
          ))}
          {!rows.length && <p className="text-sm text-slate-500 py-6 text-center">No referrals to show yet.</p>}
        </CardBody>
      </Card>
    </div>
  );
}
