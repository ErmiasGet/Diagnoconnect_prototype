import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge, statusVariant } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { FileText, Upload, Download, Eye, File, Image, ArrowLeft, CheckCircle2, AlertCircle, Paperclip, Trash2 } from 'lucide-react';

export default function ReferralDocumentsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [referral, setReferral] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get('/referrals')
      .then(r => {
        const found = r.data.find(ref => ref._id === id);
        setReferral(found || null);
        // Attempt to load documents if endpoint exists
        setDocuments(found?.documents || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('referralId', id);
      const { data } = await api.post('/upload', formData);
      const newDoc = { name: file.name, url: data.url || data.fileUrl, type: file.type, uploadedAt: new Date().toISOString() };
      setDocuments(prev => [...prev, newDoc]);
    } catch {
      // handled silently
    }
    setUploading(false);
  };

  if (loading) return <div className="py-20 text-center text-sm text-slate-500">Loading...</div>;
  if (!referral) return (
    <div className="py-20 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />
      <p className="mt-3 text-sm text-slate-500">Referral not found.</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Documents"
        title="Referral Documents"
        description={`${referral.diagnosisType} — Attach and manage documents`}
        actions={
          <Button type="button" variant="secondary" onClick={() => navigate('/app/referral-progress')} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader icon={FileText} title="Referral Info" />
          <CardBody className="space-y-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Diagnosis</p>
              <p className="text-sm font-semibold text-slate-900">{referral.diagnosisType}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Status</p>
              <div className="mt-1"><Badge variant={statusVariant(referral.referralStatus)}>{referral.referralStatus}</Badge></div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Patient</p>
              <p className="text-sm font-semibold text-slate-900">{referral.patientId?.userId?.fullName || '—'}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader icon={Paperclip} title="Attached Documents" subtitle={`${documents.length} file(s)`} />
          <CardBody className="space-y-4">
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white px-4 py-2.5 text-sm font-semibold hover:from-brand-700 hover:to-brand-600 shadow-lg transition-all">
                <Upload className="h-4 w-4" /> {uploading ? 'Uploading...' : 'Upload Document'}
                <input type="file" className="hidden" accept=".pdf,.jpg,.png,.doc,.docx,.xls,.xlsx" onChange={handleFile} disabled={uploading} />
              </label>
              <p className="text-xs text-slate-400 mt-2">Accepted: PDF, JPG, PNG, DOC, XLS</p>
            </div>

            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                        {doc.type?.startsWith('image/') ? <Image className="h-4 w-4" /> : <File className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{doc.name || 'Document'}</p>
                        <p className="text-xs text-slate-400">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : ''}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Button type="button" variant="ghost" className="!px-2 !py-1 text-xs"><Eye className="h-3.5 w-3.5" /></Button>
                      </a>
                      <a href={doc.url} download>
                        <Button type="button" variant="ghost" className="!px-2 !py-1 text-xs"><Download className="h-3.5 w-3.5" /></Button>
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">No documents attached yet.</p>
                <p className="text-xs text-slate-400 mt-1">Upload referral documents, reports, or supporting files.</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
