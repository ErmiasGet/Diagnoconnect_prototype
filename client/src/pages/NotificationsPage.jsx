import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { BellRing, CheckCheck } from 'lucide-react';

export default function NotificationsPage() {
  const [rows, setRows] = useState([]);

  const load = () => api.get('/notifications').then((r) => setRows(r.data));

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    await api.post('/notifications/read-all');
    load();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Alerts"
        title="Notifications"
        description="Appointment reminders, referral updates, and system messages appear here in real time."
        actions={
          <Button type="button" variant="secondary" onClick={markAll} className="inline-flex items-center gap-2">
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      <Card>
        <CardHeader icon={BellRing} title="Inbox" subtitle={`${rows.filter((n) => !n.read).length} unread`} />
        <CardBody className="pt-0 space-y-2">
          {rows.map((n, i) => (
            <motion.div
              key={n._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.2) }}
              className={`rounded-xl border px-4 py-3 ${
                n.read ? 'border-slate-100 bg-white' : 'border-brand-200 bg-brand-50/50 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{n.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                </div>
                {!n.read && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500 mt-1" aria-hidden />}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
            </motion.div>
          ))}
          {!rows.length && <p className="text-sm text-slate-500 py-8 text-center">You are all caught up.</p>}
        </CardBody>
      </Card>
    </div>
  );
}
