import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { SelectInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, CheckCircle2, Eye, Filter, Calendar, ChevronRight, User, MapPin } from 'lucide-react';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments')
      .then(r => {
        setAppointments(r.data);
        setFiltered(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') setFiltered(appointments);
    else setFiltered(appointments.filter(a => a.status === statusFilter));
  }, [statusFilter, appointments]);

  const todayAppts = appointments.filter(a => {
    const d = new Date(a.appointmentDate);
    return d.toDateString() === new Date().toDateString();
  });

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Schedule"
        title="Consultation Schedule"
        description="Manage your appointments and consultation schedules."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-slate-900">{appointments.length}</p>
            <p className="text-xs text-slate-500">Total Appointments</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-brand-600">{todayAppts.length}</p>
            <p className="text-xs text-slate-500">Today</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-2xl font-bold text-amber-600">{appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length}</p>
            <p className="text-xs text-slate-500">Upcoming</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader icon={Filter} title="Filter by Status" />
        <CardBody>
          <SelectInput className="w-full sm:w-56" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </SelectInput>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={CalendarDays} title="Appointments" subtitle={loading ? 'Loading...' : `${filtered.length} records`} />
        <CardBody className="pt-0">
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[600px] text-sm">
              <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Center</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <motion.tr key={a._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                    className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="p-3 font-medium text-slate-900 whitespace-nowrap">
                      {new Date(a.appointmentDate).toLocaleDateString()}
                      <span className="text-slate-500 ml-1">{new Date(a.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="p-3 text-slate-600">{a.centerId?.centerName || '—'}</td>
                    <td className="p-3 text-slate-600">{a.serviceType || '—'}</td>
                    <td className="p-3"><Badge variant={statusVariant(a.status)}>{a.status}</Badge></td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Link to={`/app/appointment-details/${a._id}`}>
                        <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </Link>
                      {(a.status === 'confirmed' || a.status === 'pending') && (
                        <Link to={`/app/appointment-outcome/${a._id}`}>
                          <Button type="button" variant="primary" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1 ml-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                          </Button>
                        </Link>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && !loading && (
              <div className="p-8 text-center text-sm text-slate-500">No appointments found.</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
