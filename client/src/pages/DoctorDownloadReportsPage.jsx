import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Download, FileText, File, Image, CheckSquare, Square, ArrowLeft, Search, User, Calendar } from 'lucide-react';

export default function DoctorDownloadReportsPage() {
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/medical-records')
      .then(r => setRecords(r.data))
      .finally(() => setLoading(false));
  }, []);

  const recordsWithFiles = records.filter(r => r.fileUrl);

  const filtered = recordsWithFiles.filter(r =>
    !search || r.title?.toLowerCase().includes(search.toLowerCase()) ||
    r.patientId?.userId?.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r._id)));
  };

  const downloadSelected = () => {
    filtered.filter(r => selected.has(r._id)).forEach(r => window.open(r.fileUrl, '_blank'));
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Reports"
        title="Download Reports"
        description="Select and download diagnostic reports and results."
        actions={
          <Link to="/app/doctor-diagnostic-results">
            <Button type="button" variant="secondary" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Results
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader icon={Download} title="Select Reports to Download"
          subtitle={loading ? 'Loading...' : `${recordsWithFiles.length} files available`}
          action={
            filtered.length > 0 && (
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={toggleAll}>
                  {selected.size === filtered.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button type="button" disabled={selected.size === 0} onClick={downloadSelected}
                  className="inline-flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download ({selected.size})
                </Button>
              </div>
            )
          }
        />
        <CardBody>
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm" placeholder="Search by title or patient name..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filtered.map((r, i) => (
              <motion.div key={r._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                  selected.has(r._id) ? 'border-brand-300 bg-brand-50/60 shadow-sm' : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
                }`}
                onClick={() => toggle(r._id)}>
                <div>{selected.has(r._id) ? <CheckSquare className="h-5 w-5 text-brand-600" /> : <Square className="h-5 w-5 text-slate-300" />}</div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                  {r.recordType === 'imaging' ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-500">
                    {r.recordType?.replace('_', ' ')} · {new Date(r.createdAt).toLocaleDateString()}
                    {r.patientId?.userId?.fullName ? ` · ${r.patientId.userId.fullName}` : ''}
                  </p>
                </div>
                <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  <Button type="button" variant="ghost" className="!px-2 !py-1 text-xs"><Download className="h-3.5 w-3.5" /></Button>
                </a>
              </motion.div>
            ))}
            {!filtered.length && (
              <div className="py-8 text-center text-sm text-slate-500">No files available for download.</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
