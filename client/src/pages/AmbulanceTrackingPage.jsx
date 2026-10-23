import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Truck, MapPin, Navigation, Clock, CheckCircle2, XCircle, RefreshCw, AlertCircle, Phone } from 'lucide-react';

const trackSteps = [
  { key: 'requested', label: 'Requested', icon: Clock },
  { key: 'assigned', label: 'Assigned', icon: Truck },
  { key: 'in_transit', label: 'In Transit', icon: Navigation },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

export default function AmbulanceTrackingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/ambulance').then(r => setRows(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const activeRequests = rows.filter(r => r.status !== 'completed' && r.status !== 'cancelled');
  const recentRequests = rows.slice(0, 5);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Transport"
        title="Ambulance Tracking"
        description="Monitor your ambulance requests in real time."
        actions={
          <Button type="button" variant="secondary" onClick={load} className="inline-flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-slate-900">{rows.length}</p>
            <p className="text-sm text-slate-500 mt-1">Total Requests</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-amber-600">{activeRequests.length}</p>
            <p className="text-sm text-slate-500 mt-1">Active</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-emerald-600">{rows.filter(r => r.status === 'completed').length}</p>
            <p className="text-sm text-slate-500 mt-1">Completed</p>
          </CardBody>
        </Card>
      </div>

      {activeRequests.length > 0 ? (
        <div className="space-y-4">
          {activeRequests.map((r, i) => {
            const stepIndex = trackSteps.findIndex(s => s.key === r.status);
            return (
              <motion.div key={r._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className={`border-l-4 ${r.status === 'in_transit' ? 'border-l-care-500' : r.status === 'assigned' ? 'border-l-brand-500' : 'border-l-amber-500'}`}>
                  <CardBody>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-sm">
                            <Truck className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Pickup: {r.pickupAddress}</p>
                            {r.destinationAddress && <p className="text-sm text-slate-500">→ {r.destinationAddress}</p>}
                          </div>
                        </div>
                        <Badge variant={statusVariant(r.status)} className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {r.status.replace('_', ' ')}
                        </Badge>
                        {r.notes && <p className="text-xs text-slate-500">Notes: {r.notes}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        {trackSteps.map((step, si) => {
                          const Icon = step.icon;
                          const isActive = si <= stepIndex;
                          return (
                            <div key={step.key} className="flex items-center gap-1">
                              <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                isActive ? 'bg-gradient-to-br from-brand-500 to-care-500 text-white' : 'bg-slate-100 text-slate-400'
                              }`}>
                                <Icon className="h-3.5 w-3.5" />
                              </div>
                              {si < trackSteps.length - 1 && (
                                <div className={`h-0.5 w-4 ${si < stepIndex ? 'bg-brand-500' : 'bg-slate-200'}`} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-10">
            <Truck className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm text-slate-500">No active ambulance requests.</p>
          </CardBody>
        </Card>
      )}

      {recentRequests.length > 0 && (
        <Card>
          <CardHeader icon={Clock} title="Recent Activity" subtitle="Your recent ambulance requests" />
          <CardBody className="pt-0 space-y-2">
            {recentRequests.map((r, i) => (
              <motion.div key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{r.pickupAddress}</p>
                  <p className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
                <Badge variant={statusVariant(r.status)}>{r.status.replace('_', ' ')}</Badge>
              </motion.div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
