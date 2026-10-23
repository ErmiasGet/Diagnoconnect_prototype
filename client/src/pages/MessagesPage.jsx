import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FieldLabel, TextInput, TextArea } from '../components/ui/FormPrimitives.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Reply, Mail, Paperclip, Inbox, ChevronRight, Clock } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [form, setForm] = useState({ to: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get('/notifications').then(r => setNotifications(r.data)).catch(() => {});
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm({ to: '', subject: '', message: '' });
      setTimeout(() => { setShowCompose(false); setSent(false); }, 2000);
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Communication"
        title="Messages"
        description="Send and receive messages with healthcare providers."
        actions={
          <Button type="button" onClick={() => { setShowCompose(!showCompose); setSelectedMsg(null); }}
            className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4" /> Compose
          </Button>
        }
      />

      <AnimatePresence>
        {showCompose && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card>
              <CardHeader icon={Send} title="Compose Message" subtitle={sent ? 'Message sent!' : 'Fill in the details below.'} />
              <CardBody>
                {sent ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 flex items-center gap-2">
                    <Send className="h-4 w-4" /> Your message has been sent.
                  </div>
                ) : (
                  <form onSubmit={sendMessage} className="space-y-4">
                    <div>
                      <FieldLabel>To</FieldLabel>
                      <TextInput className="mt-1.5" required placeholder="Recipient email or name" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
                    </div>
                    <div>
                      <FieldLabel>Subject</FieldLabel>
                      <TextInput className="mt-1.5" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
                    </div>
                    <div>
                      <FieldLabel>Message</FieldLabel>
                      <TextArea className="mt-1.5" required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                    </div>
                    <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                      <Send className="h-4 w-4" /> Send Message
                    </Button>
                  </form>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader icon={Inbox} title="Inbox" subtitle={`${notifications.filter(n => !n.read).length} unread`} />
          <CardBody className="pt-0 space-y-1 max-h-[500px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n, i) => (
                <motion.button key={n._id} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                  onClick={() => { setSelectedMsg(n); setShowCompose(false); }}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 text-sm transition-all ${
                    selectedMsg?._id === n._id ? 'border-brand-300 bg-brand-50 shadow-sm' :
                    n.read ? 'border-slate-100 bg-white' : 'border-brand-200 bg-brand-50/40'
                  }`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm truncate flex-1 ${n.read ? 'text-slate-700' : 'font-semibold text-slate-900'}`}>{n.title}</p>
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500 mt-1" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                </motion.button>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">No messages yet.</p>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          {selectedMsg ? (
            <>
              <CardHeader icon={MessageSquare} title={selectedMsg.title} subtitle={new Date(selectedMsg.createdAt).toLocaleString()} />
              <CardBody>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedMsg.message}</p>
              </CardBody>
            </>
          ) : (
            <CardBody className="py-16 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-slate-200" />
              <p className="mt-3 text-sm text-slate-500">Select a message to read</p>
              <p className="text-xs text-slate-400 mt-1">Or compose a new message</p>
            </CardBody>
          )}
        </Card>
      </div>
    </div>
  );
}
