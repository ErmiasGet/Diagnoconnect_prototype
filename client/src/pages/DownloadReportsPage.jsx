import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Download, FileText, File, Image, CheckSquare, Square, ArrowLeft, DownloadCloud, Archive, AlertCircle } from 'lucide-react';

export default function DownloadReportsPage() {
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/medical-records')
      .then(r => setRecords(r.data))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === recordsWithFiles.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(recordsWithFiles.map(r => r._id)));
    }
  };

  const recordsWithFiles = records.filter(r => r.fileUrl);
  const downloadable = records.filter(r => r.fileUrl && selected.has(r._id));

  const downloadSelected = () => {
    downloadable.forEach(r => {
      window.open(r.fileUrl, '_blank');
    });
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Reports"
        title="Download Reports"
        description="Select and download your diagnostic reports and documents."
        actions={
          <Link to="/app/diagnostic-reports">
            <Button type="button" variant="secondary" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Reports
            </Button>
          </Link>
        }
      />

      <Card>
        <CardHeader icon={DownloadCloud} title="Select Reports to Download"
          subtitle={loading ? 'Loading...' : `${recordsWithFiles.length} files available`}
          action={
            recordsWithFiles.length > 0 && (
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs" onClick={toggleAll}>
                  {selected.size === recordsWithFiles.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button type="button" disabled={downloadable.length === 0} onClick={downloadSelected}
                  className="inline-flex items-center gap-2">
                  <Download className="h-4 w-4" /> Download {downloadable.length > 0 ? `(${downloadable.length})` : ''}
                </Button>
              </div>
            )
          }
        />
        <CardBody className="pt-0 space-y-2">
          {recordsWithFiles.length > 0 ? (
            recordsWithFiles.map((r, i) => (
              <motion.div key={r._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                  selected.has(r._id) ? 'border-brand-300 bg-brand-50/60 shadow-sm' : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
                }`}
                onClick={() => toggle(r._id)}>
                <div className="shrink-0">
                  {selected.has(r._id) ? (
                    <CheckSquare className="h-5 w-5 text-brand-600" />
                  ) : (
                    <Square className="h-5 w-5 text-slate-300" />
                  )}
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                  {r.recordType === 'imaging' ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.recordType?.replace('_', ' ')} · {new Date(r.createdAt).toLocaleDateString()}{r.fileName ? ` · ${r.fileName}` : ''}</p>
                </div>
                <a href={r.fileUrl} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                  <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center">
              <Archive className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm text-slate-500">No files available for download.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
