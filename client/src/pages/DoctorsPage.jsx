import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import { TextInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Search, Stethoscope, Mail, Phone, Building2 } from 'lucide-react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/doctors')
      .then((r) => setDoctors(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = doctors.filter((d) =>
    !search || d.userId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Care Team"
        title="Doctors"
        description="Browse registered doctors, their specializations, and affiliated hospitals."
        actions={
          <div className="flex w-full max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <TextInput className="pl-10" placeholder="Name or specialization" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button type="button" variant="primary" onClick={load} loading={loading}>Refresh</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((d, i) => (
          <motion.div key={d._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="h-full">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-md">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{d.userId?.fullName || 'Doctor'}</p>
                    <p className="text-xs text-brand-600 font-medium mt-0.5">{d.specialization || 'General'}</p>
                    {d.userId?.email && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1.5 truncate">
                        <Mail className="h-3 w-3 shrink-0" /> {d.userId.email}
                      </p>
                    )}
                    {d.userId?.phone && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" /> {d.userId.phone}
                      </p>
                    )}
                    {d.hospitalId && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Building2 className="h-3 w-3" /> {d.hospitalId.name || 'Hospital'}
                      </p>
                    )}
                    {d.licenseNumber && (
                      <p className="text-[10px] text-slate-400 mt-1.5">License: {d.licenseNumber}</p>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {!filtered.length && !loading && (
        <Card><CardBody className="text-center text-slate-500 py-12">No doctors found.</CardBody></Card>
      )}
    </div>
  );
}
