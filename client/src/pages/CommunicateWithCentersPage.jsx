import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, TextArea, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Microscope, Search, CheckCircle2, Phone, Mail, Building2, Clock } from 'lucide-react';

export default function CommunicateWithCentersPage() {
  const [centers, setCenters] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedReferral, setSelectedReferral] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [centerSearch, setCenterSearch] = useState('');

  useEffect(() => {
    api.get('/centers?approvedOnly=true').then(r => setCenters(r.data)).catch(() => {});
    api.get('/referrals').then(r => setReferrals(r.data)).catch(() => {});
  }, []);

  const filteredCenters = centerSearch
    ? centers.filter(c => c.centerName?.toLowerCase().includes(centerSearch.toLowerCase()))
    : centers;

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedCenter || !message) return;
    setSubmitting(true);
    try {
      const center = centers.find(c => c._id === selectedCenter);
      const ref = selectedReferral ? referrals.find(r => r._id === selectedReferral) : null;
      await api.post('/contact', {
        to: center?.contactPhone || center?.email || 'center',
        subject: subject || `Communication regarding ${ref?.diagnosisType || 'patient'}`,
        message: `To: ${center?.centerName}\nReferral: ${ref?.diagnosisType || 'N/A'}\n\n${message}`,
      });
      setSuccess(true);
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="space-y-8">
        <SectionHeader eyebrow="Communication" title="Message Sent" />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-900">Message Sent Successfully</h2>
            <p className="text-sm text-slate-600 mt-2">Your message has been sent to the diagnostic center. They will respond shortly.</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => { setSuccess(false); setSubject(''); setMessage(''); setSelectedReferral(''); }}>
                Send Another
              </Button>
              <Button type="button" variant="secondary" onClick={() => { setSuccess(false); setSelectedCenter(''); setSubject(''); setMessage(''); setCenterSearch(''); }}>
                New Conversation
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Communication"
        title="Communicate with Centers"
        description="Send messages to diagnostic centers regarding referrals and patient results."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader icon={Microscope} title="Diagnostic Centers" subtitle={`${centers.length} available`} />
          <CardBody className="space-y-2 max-h-[400px] overflow-y-auto">
            <input className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm mb-2"
              placeholder="Search centers..." value={centerSearch} onChange={e => setCenterSearch(e.target.value)} />
            {filteredCenters.map(c => (
              <button key={c._id} type="button" onClick={() => { setSelectedCenter(c._id); setCenterSearch(''); }}
                className={`w-full text-left rounded-xl border p-3 transition-all ${
                  selectedCenter === c._id ? 'border-brand-300 bg-brand-50 shadow-sm' : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50'
                }`}>
                <p className="text-sm font-semibold text-slate-900">{c.centerName}</p>
                {c.location && <p className="text-xs text-slate-500 mt-0.5">{c.location}</p>}
                {c.contactPhone && <p className="text-xs text-slate-400 mt-0.5">{c.contactPhone}</p>}
              </button>
            ))}
            {!filteredCenters.length && <p className="text-sm text-slate-500 text-center py-4">No centers found.</p>}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader icon={MessageSquare} title="Compose Message" subtitle="Send a message to the selected center." />
          <CardBody>
            {selectedCenter ? (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <FieldLabel>Center</FieldLabel>
                  <TextInput className="mt-1.5" value={centers.find(c => c._id === selectedCenter)?.centerName || ''} disabled />
                </div>
                <div>
                  <FieldLabel>Related Referral (optional)</FieldLabel>
                  <SelectInput className="mt-1.5" value={selectedReferral} onChange={e => setSelectedReferral(e.target.value)}>
                    <option value="">No specific referral</option>
                    {referrals.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.diagnosisType} — {r.patientId?.userId?.fullName || 'Patient'}
                      </option>
                    ))}
                  </SelectInput>
                </div>
                <div>
                  <FieldLabel>Subject</FieldLabel>
                  <TextInput className="mt-1.5" value={subject} onChange={e => setSubject(e.target.value)}
                    placeholder={selectedReferral ? `Regarding referral - ${referrals.find(r => r._id === selectedReferral)?.diagnosisType || ''}` : 'Message subject...'} />
                </div>
                <div>
                  <FieldLabel>Message</FieldLabel>
                  <TextArea className="mt-1.5" required rows={6} value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Write your message here. Include relevant patient information, questions about results, or coordination details..." />
                </div>
                <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </form>
            ) : (
              <div className="py-16 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-slate-200" />
                <p className="mt-3 text-sm text-slate-500">Select a diagnostic center from the left panel</p>
                <p className="text-xs text-slate-400 mt-1">Choose a center to start composing a message</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
