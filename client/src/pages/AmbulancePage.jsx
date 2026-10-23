import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { Truck, Navigation } from 'lucide-react';

export default function AmbulancePage() {
  const { user } = useAuth();
  const uid = user?._id ?? user?.id;
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    pickupAddress: '',
    destinationAddress: '',
    notes: '',
    patientId: '',
  });

  const load = () => api.get('/ambulance').then((r) => setRows(r.data));

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/ambulance', form);
    setForm({ pickupAddress: '', destinationAddress: '', notes: '', patientId: '' });
    load();
  };

  const patch = async (id, status) => {
    await api.patch(`/ambulance/${id}`, { status });
    load();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Transport"
        title="Ambulance coordination"
        description="Request transport for patients and keep everyone aligned with live status updates."
      />

      {(user?.role === 'patient' ||
        user?.role === 'hospital_admin' ||
        user?.role === 'doctor' ||
        user?.role === 'admin') && (
        <Card>
          <CardHeader icon={Truck} title="New transport request" subtitle="Pickup and destination help providers plan routes." />
          <CardBody>
            <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
              {(user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'hospital_admin') && (
                <div className="sm:col-span-2">
                  <FieldLabel>Patient ID (Mongo)</FieldLabel>
                  <TextInput
                    className="mt-1.5 font-mono text-xs"
                    placeholder="Required for staff-initiated requests"
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    required={user?.role !== 'patient'}
                  />
                </div>
              )}
              <div className="sm:col-span-2">
                <FieldLabel>Pickup address</FieldLabel>
                <TextInput
                  className="mt-1.5"
                  value={form.pickupAddress}
                  onChange={(e) => setForm({ ...form, pickupAddress: e.target.value })}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Destination</FieldLabel>
                <TextInput
                  className="mt-1.5"
                  value={form.destinationAddress}
                  onChange={(e) => setForm({ ...form, destinationAddress: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Notes</FieldLabel>
                <TextInput className="mt-1.5" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" className="inline-flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Dispatch request
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader icon={Truck} title="Requests" subtitle="Track assignment and progress" />
        <CardBody className="pt-0 space-y-3">
          {rows.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.25) }}
              className="rounded-2xl border border-slate-100 bg-gradient-to-r from-white to-slate-50 p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
              <div>
                <p className="font-semibold text-slate-900">{r.pickupAddress}</p>
                <p className="text-sm text-slate-600 mt-1">→ {r.destinationAddress || 'Destination TBD'}</p>
                <div className="mt-2">
                  <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {user?.role === 'ambulance' && r.status === 'requested' && (
                  <Button type="button" onClick={() => patch(r._id, 'assigned')}>
                    Accept
                  </Button>
                )}
                {user?.role === 'ambulance' && r.assignedProviderUserId && String(r.assignedProviderUserId) === String(uid) && (
                  <>
                    <Button type="button" variant="secondary" onClick={() => patch(r._id, 'in_transit')}>
                      In transit
                    </Button>
                    <Button type="button" variant="primary" onClick={() => patch(r._id, 'completed')}>
                      Complete
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
          {!rows.length && <p className="text-sm text-slate-500 py-6 text-center">No ambulance requests yet.</p>}
        </CardBody>
      </Card>
    </div>
  );
}
