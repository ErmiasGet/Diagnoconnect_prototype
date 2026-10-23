import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, SelectInput, TextArea, FormGrid } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { CalendarPlus, CheckCircle2, ArrowLeft, Search, MapPin, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [centers, setCenters] = useState([]);
  const [filteredCenters, setFilteredCenters] = useState([]);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    centerId: '',
    appointmentDate: '',
    serviceType: '',
    notes: '',
  });

  useEffect(() => {
    api.get('/centers?approvedOnly=true').then(r => {
      setCenters(r.data);
      setFilteredCenters(r.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFilteredCenters(centers.filter(c =>
      c.centerName?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q) ||
      (c.availableServices || []).some(s => s.toLowerCase().includes(q))
    ));
  }, [search, centers]);

  const selectCenter = (center) => {
    setForm({ ...form, centerId: center._id });
    setStep(2);
  };

  const book = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/appointments', {
        centerId: form.centerId,
        appointmentDate: form.appointmentDate,
        serviceType: form.serviceType,
        notes: form.notes,
      });
      navigate('/app/appointment-history', { state: { booked: true } });
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Scheduling"
        title="Book an Appointment"
        description="Choose a diagnostic center and schedule your visit."
        actions={
          step > 1 ? (
            <Button type="button" variant="secondary" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : null
        }
      />

      {step === 1 && (
        <>
          <Card>
            <CardHeader icon={Search} title="Select a Diagnostic Center" subtitle="Search by name, location, or service type" />
            <CardBody>
              <div className="relative max-w-md mb-6">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <TextInput className="pl-10" placeholder="Search centers..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredCenters.map((c, i) => (
                  <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <button type="button" onClick={() => selectCenter(c)}
                      className="w-full text-left rounded-xl border border-slate-200 bg-white p-4 shadow-soft hover:shadow-glow hover:border-brand-300 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-sm">
                          <Microscope className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{c.centerName}</p>
                          {c.location && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" /> {c.location}
                            </p>
                          )}
                          {(c.availableServices || []).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {c.availableServices.slice(0, 3).map(s => (
                                <span key={s} className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold text-brand-700">{s}</span>
                              ))}
                              {c.availableServices.length > 3 && (
                                <span className="text-[10px] text-slate-400">+{c.availableServices.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
              {!filteredCenters.length && (
                <div className="py-8 text-center text-sm text-slate-500">No centers match your search.</div>
              )}
            </CardBody>
          </Card>
        </>
      )}

      {step === 2 && (
        <Card>
          <CardHeader icon={CalendarPlus} title="Schedule Appointment" subtitle="Choose date, time, and service type." />
          <CardBody>
            <form onSubmit={book} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FieldLabel>Diagnostic Center</FieldLabel>
                <TextInput className="mt-1.5" value={centers.find(c => c._id === form.centerId)?.centerName || ''} disabled />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Date & Time</FieldLabel>
                <TextInput className="mt-1.5" type="datetime-local" required value={form.appointmentDate} onChange={e => setForm({ ...form, appointmentDate: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Service Type</FieldLabel>
                <SelectInput className="mt-1.5" value={form.serviceType} onChange={e => setForm({ ...form, serviceType: e.target.value })} required>
                  <option value="">Select service</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="MRI">MRI</option>
                  <option value="CT Scan">CT Scan</option>
                  <option value="Ultrasound">Ultrasound</option>
                  <option value="ECG">ECG</option>
                  <option value="Urine Test">Urine Test</option>
                  <option value="CBC">CBC</option>
                  <option value="Other">Other</option>
                </SelectInput>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Notes (optional)</FieldLabel>
                <TextArea className="mt-1.5" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any special requirements or information..." />
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Confirm Booking
                </Button>
                <Button type="button" variant="secondary" onClick={() => setStep(1)}>Change Center</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
