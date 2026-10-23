import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { TextInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { HeartPulse, Mail, User, Phone, Droplets, AlertCircle, Search, Users } from 'lucide-react';

export default function PatientsPage() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/patients').then((r) => setRows(r.data));
  }, []);

  const filtered = rows.filter((p) =>
    !search || p.userId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    p.userId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Care Team"
        title="Patients"
        description="Patients linked to your referrals with medical profile information."
        actions={
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <TextInput className="pl-10" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="h-full">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-care-500 to-brand-600 text-white shadow-md">
                    <HeartPulse className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate flex items-center gap-2">
                      {p.userId?.fullName || 'Patient'}
                      {p.bloodGroup && <Badge variant="info">{p.bloodGroup}</Badge>}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                      <Mail className="h-3.5 w-3.5 shrink-0" /> {p.userId?.email}
                    </p>
                    {p.userId?.phone && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Phone className="h-3.5 w-3.5" /> {p.userId.phone}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <User className="h-3 w-3" /> {p.age ?? '—'} yrs · {p.gender || '—'}
                      </span>
                    </div>
                    {p.allergies?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        <AlertCircle className="h-3 w-3 text-amber-500" />
                        {p.allergies.slice(0, 3).map((a) => (
                          <span key={a} className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">{a}</span>
                        ))}
                      </div>
                    )}
                    {p.medicalHistory?.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.medicalHistory.slice(0, 3).map((h) => (
                          <span key={h} className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {!filtered.length && (
        <Card>
          <CardBody className="flex flex-col items-center gap-3 py-12 text-slate-500">
            <Users className="h-8 w-8" />
            <p className="text-sm">No patients found.</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
