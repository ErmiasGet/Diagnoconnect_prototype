import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import { TextInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { MapPin, Microscope, Search } from 'lucide-react';

const IMAGES = [
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1530497610245-94d3f16b28b5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
];

export default function CentersPage() {
  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get(`/centers?search=${encodeURIComponent(search)}&approvedOnly=true`)
      .then((r) => setCenters(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Network"
        title="Diagnostic centers"
        description="Search approved labs and imaging partners. Each card highlights location and available services."
        actions={
          <div className="flex w-full max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <TextInput className="pl-10" placeholder="Name or city" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Button type="button" variant="primary" onClick={load} loading={loading}>
              Search
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {centers.map((c, i) => (
          <motion.div
            key={c._id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: (i % 6) * 0.05 }}
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={IMAGES[i % IMAGES.length]}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 text-white">
                  <Microscope className="h-5 w-5 shrink-0" />
                  <span className="font-semibold line-clamp-2">{c.centerName}</span>
                </div>
              </div>
              <CardBody className="flex-1 flex flex-col">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 shrink-0 text-brand-500 mt-0.5" />
                  <span>{c.location || 'Location on file'}</span>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Services</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(c.availableServices || []).length ? (
                      c.availableServices.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 border border-brand-100"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">Services listed on request</span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {!centers.length && !loading && (
        <Card>
          <CardBody className="text-center text-slate-500 py-12">No centers match your search.</CardBody>
        </Card>
      )}
    </div>
  );
}
