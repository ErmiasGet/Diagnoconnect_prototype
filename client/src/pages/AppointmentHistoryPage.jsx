import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { TextInput, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { CalendarClock, Search, Eye, CalendarX, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function AppointmentHistoryPage() {
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(location.state?.booked || false);

  useEffect(() => {
    api.get('/appointments')
      .then(r => {
        setRows(r.data);
        setFiltered(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = rows;
    if (statusFilter !== 'all') {
      result = result.filter(a => a.status === statusFilter);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(a =>
        a.centerId?.centerName?.toLowerCase().includes(q) ||
        a.serviceType?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [search, statusFilter, rows]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 'cancelled': return <XCircle className="h-3.5 w-3.5" />;
      default: return <Clock className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="History"
        title="Appointment History"
        description="View all your past and upcoming appointments."
      />

      {booked && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          Appointment booked successfully! You can view it below.
        </motion.div>
      )}

      <Card>
        <CardHeader icon={CalendarClock} title="Search & Filter" subtitle={`${filtered.length} of ${rows.length} appointments`} />
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <TextInput className="pl-10" placeholder="Search by center or service..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <SelectInput className="w-full sm:w-44" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rescheduled">Rescheduled</option>
            </SelectInput>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={CalendarClock} title="Appointments" subtitle={loading ? 'Loading...' : `${filtered.length} records`} />
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
                    <td className="p-3">
                      <Badge variant={statusVariant(a.status)} className="inline-flex items-center gap-1">
                        {getStatusIcon(a.status)} {a.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Link to={`/app/appointment-details/${a._id}`}>
                        <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </Link>
                      {(a.status === 'pending' || a.status === 'confirmed') && (
                        <Link to={`/app/reschedule-appointment/${a._id}`}>
                          <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                            <CalendarX className="h-3.5 w-3.5" /> Reschedule
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
