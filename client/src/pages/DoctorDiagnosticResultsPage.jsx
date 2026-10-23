import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { SelectInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { Microscope, FileText, Download, Eye, Filter, Search, File, Image, User, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

const typeColors = {
  lab_result: 'info', imaging: 'warning', prescription: 'success',
  clinical_note: 'default', report: 'default', other: 'muted',
};

export default function DoctorDiagnosticResultsPage() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/medical-records')
      .then(r => {
        setRecords(r.data);
        setFiltered(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = records;
    if (typeFilter !== 'all') result = result.filter(r => r.recordType === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.patientId?.userId?.fullName?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [typeFilter, search, records]);

  const diagnosticRecords = filtered.filter(r => ['lab_result', 'imaging', 'report'].includes(r.recordType));

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Diagnostics"
        title="Diagnostic Results"
        description="View lab results, imaging reports, and diagnostic findings."
        actions={
          <Link to="/app/doctor-download-reports">
            <Button type="button" variant="secondary" className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> Download Reports
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-slate-900">{records.filter(r => r.recordType === 'lab_result').length}</p><p className="text-xs text-slate-500">Lab Results</p></CardBody></Card>
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-amber-600">{records.filter(r => r.recordType === 'imaging').length}</p><p className="text-xs text-slate-500">Imaging</p></CardBody></Card>
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-brand-600">{records.filter(r => r.recordType === 'report').length}</p><p className="text-xs text-slate-500">Reports</p></CardBody></Card>
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-emerald-600">{records.filter(r => r.fileUrl).length}</p><p className="text-xs text-slate-500">With Files</p></CardBody></Card>
      </div>

      <Card>
        <CardHeader icon={Search} title="Search & Filter" subtitle={`${diagnosticRecords.length} diagnostic records`} />
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm" placeholder="Search by title, patient name..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <SelectInput className="w-full sm:w-48" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="lab_result">Lab Results</option>
              <option value="imaging">Imaging</option>
              <option value="report">Reports</option>
              <option value="clinical_note">Clinical Notes</option>
              <option value="prescription">Prescriptions</option>
            </SelectInput>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={Microscope} title="Results" subtitle={loading ? 'Loading...' : `${diagnosticRecords.length} records`} />
        <CardBody className="pt-0 space-y-3">
          {diagnosticRecords.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.25) }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                  {r.recordType === 'imaging' ? <Image className="h-5 w-5" /> : <File className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900">{r.title}</p>
                    <Badge variant={typeColors[r.recordType] || 'default'}>{r.recordType?.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    {r.patientId?.userId?.fullName && (
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {r.patientId.userId.fullName}</span>
                    )}
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.description && <p className="text-sm text-slate-600 mt-1 line-clamp-2">{r.description}</p>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {r.fileUrl && (
                  <a href={r.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button type="button" variant="secondary" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </a>
                )}
                {r.fileUrl && (
                  <a href={r.fileUrl} download>
                    <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {!diagnosticRecords.length && !loading && (
            <div className="py-12 text-center">
              <Microscope className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No diagnostic results available.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
