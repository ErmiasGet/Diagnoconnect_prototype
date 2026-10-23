import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FieldLabel, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { FileText, Download, File, Image, FileSpreadsheet, Eye, Search, Filter } from 'lucide-react';

const typeColors = {
  lab_result: 'info',
  imaging: 'warning',
  prescription: 'success',
  clinical_note: 'default',
  report: 'default',
  other: 'muted',
};

export default function DiagnosticReportsPage() {
  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
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
    if (typeFilter === 'all') {
      setFiltered(records);
    } else {
      setFiltered(records.filter(r => r.recordType === typeFilter));
    }
  }, [typeFilter, records]);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Reports"
        title="Diagnostic Reports"
        description="Access your lab results, imaging reports, and clinical documents."
        actions={
          <Link to="/app/download-reports">
            <Button type="button" variant="secondary" className="inline-flex items-center gap-2">
              <Download className="h-4 w-4" /> Download Reports
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader icon={Filter} title="Filter by Type" />
        <CardBody>
          <SelectInput className="w-full sm:w-56" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="lab_result">Lab Results</option>
            <option value="imaging">Imaging</option>
            <option value="prescription">Prescriptions</option>
            <option value="clinical_note">Clinical Notes</option>
            <option value="report">Reports</option>
            <option value="other">Other</option>
          </SelectInput>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={FileText} title="Reports" subtitle={loading ? 'Loading...' : `${filtered.length} documents`} />
        <CardBody className="pt-0 space-y-3">
          {filtered.map((r, i) => (
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
                  {r.description && <p className="text-sm text-slate-600 mt-0.5 line-clamp-1">{r.description}</p>}
                  <p className="text-xs text-slate-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}{r.fileName ? ` · ${r.fileName}` : ''}</p>
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
                      <Download className="h-3.5 w-3.5" /> Download
                    </Button>
                  </a>
                )}
              </div>
            </motion.div>
          ))}
          {!filtered.length && !loading && (
            <div className="py-12 text-center">
              <FileSpreadsheet className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No reports yet.</p>
              <p className="text-xs text-slate-400 mt-1">Reports will appear here once tests are completed.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
