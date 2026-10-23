import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import { TextInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Search, Building2, MapPin, Phone, ShieldCheck } from 'lucide-react';

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api.get('/hospitals')
      .then((r) => setHospitals(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = hospitals.filter((h) =>
    !search || h.name?.toLowerCase().includes(search.toLowerCase()) ||
    h.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Network"
        title="Hospitals"
        description="Browse hospitals in the DiagnoConnect network."
        actions={
          <div className="flex w-full max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <TextInput className="pl-10" placeholder="Name or location" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button type="button" onClick={load} loading={loading}>Search</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((h, i) => (
          <motion.div key={h._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="h-full">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 to-cyan-600 text-white shadow-md">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 truncate">{h.name}</p>
                    {h.location && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 shrink-0" /> {h.location}
                      </p>
                    )}
                    {h.contactPhone && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" /> {h.contactPhone}
                      </p>
                    )}
                    <div className="mt-2">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                        h.approvalStatus === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        h.approvalStatus === 'rejected' ? 'bg-red-50 text-red-700' :
                        'bg-amber-50 text-amber-700'
                      }`}>
                        <ShieldCheck className="h-3 w-3" />
                        {h.approvalStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {!filtered.length && !loading && (
        <Card><CardBody className="text-center text-slate-500 py-12">No hospitals found.</CardBody></Card>
      )}
    </div>
  );
}
