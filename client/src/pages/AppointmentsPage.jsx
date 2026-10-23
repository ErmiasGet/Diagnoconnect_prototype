import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FieldLabel, TextInput, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { CalendarClock, CalendarPlus, CheckCircle2 } from 'lucide-react';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [centers, setCenters] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    centerId: '',
    appointmentDate: '',
    serviceType: '',
    notes: '',
    patientId: '',
  });

  const load = () => api.get('/appointments').then((r) => setRows(r.data));

  useEffect(() => {
    setLoading(true);
    Promise.all([
      load(),
      api.get('/centers?approvedOnly=true').then((r) => setCenters(r.data)),
      user?.role === 'doctor' || user?.role === 'admin'
        ? api.get('/patients').then((r) => setPatients(r.data)).catch(() => {})
        : Promise.resolve(),
    ]).finally(() => setLoading(false));
  }, [user]);

  const book = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      centerId: form.centerId,
      appointmentDate: form.appointmentDate,
      serviceType: form.serviceType,
      notes: form.notes,
    };
    if (user.role === 'doctor' || user.role === 'admin') payload.patientId = form.patientId;
    await api.post('/appointments', payload);
    setForm({ centerId: '', appointmentDate: '', serviceType: '', notes: '', patientId: '' });
    await load();
    setSubmitting(false);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/appointments/${id}`, { status });
    load();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Scheduling"
        title="Appointments"
        description="Book diagnostic visits at approved centers and track confirmations in real time."
      />

      {(user?.role === 'patient' || user?.role === 'doctor' || user?.role === 'admin') && (
        <Card>
          <CardHeader
            icon={CalendarPlus}
            title="Book a new appointment"
            subtitle="Choose a center, time window, and service type. Staff receive instant notifications."
          />
          <CardBody>
            <form onSubmit={book} className="grid gap-4 sm:grid-cols-2">
              {(user?.role === 'doctor' || user?.role === 'admin') && (
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
              )}
              <div className="sm:col-span-2">
                <FieldLabel>Diagnostic center</FieldLabel>
                <SelectInput
                  className="mt-1.5"
                  required
                  value={form.centerId}
                  onChange={(e) => setForm({ ...form, centerId: e.target.value })}
                >
                  <option value="">Select center</option>
                  {centers.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.centerName}
                    </option>
                  ))}
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Date & time</FieldLabel>
                <TextInput
                  className="mt-1.5"
                  type="datetime-local"
                  required
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                />
              </div>
              <div>
                <FieldLabel>Service type</FieldLabel>
                <TextInput
                  className="mt-1.5"
                  placeholder="e.g. MRI, CBC, ultrasound"
                  value={form.serviceType}
                  onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Notes (optional)</FieldLabel>
                <TextInput className="mt-1.5" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm booking
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader icon={CalendarClock} title="Your appointments" subtitle={loading ? 'Loading…' : `${rows.length} total`} />
        <CardBody className="pt-0">
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-3">When</th>
                  <th className="p-3">Center</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a, i) => (
                  <motion.tr
                    key={a._id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.3) }}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="p-3 font-medium text-slate-900 whitespace-nowrap">
                      {new Date(a.appointmentDate).toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-600">{a.centerId?.centerName || '—'}</td>
                    <td className="p-3">
                      <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                    </td>
                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                      {user?.role === 'patient' && a.status !== 'cancelled' && (
                        <Button type="button" variant="ghost" className="!px-2 text-red-600 hover:text-red-700" onClick={() => updateStatus(a._id, 'cancelled')}>
                          Cancel
                        </Button>
                      )}
                      {user?.role === 'center_admin' && (
                        <>
                          <Button type="button" variant="secondary" className="!px-2" onClick={() => updateStatus(a._id, 'confirmed')}>
                            Confirm
                          </Button>
                          <Button type="button" variant="primary" className="!px-2" onClick={() => updateStatus(a._id, 'completed')}>
                            Complete
                          </Button>
                        </>
                      )}
                      {user?.role === 'admin' && (
                        <Button type="button" variant="secondary" className="!px-2" onClick={() => updateStatus(a._id, 'confirmed')}>
                          Confirm
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {!rows.length && !loading && (
              <div className="p-8 text-center text-sm text-slate-500">No appointments yet.</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
