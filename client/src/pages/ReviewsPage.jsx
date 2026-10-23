import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FieldLabel, SelectInput, TextInput, TextArea } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`p-0.5 transition-colors ${star <= value ? 'text-amber-400' : 'text-slate-200'}`}
        >
          <Star className="h-6 w-6" fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ targetType: 'diagnostic_center', targetId: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get('/reviews').then((r) => setReviews(r.data));

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.post('/reviews', form);
    setForm({ targetType: 'diagnostic_center', targetId: '', rating: 5, comment: '' });
    setShowForm(false);
    await load();
    setSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Feedback"
        title="Reviews & Ratings"
        description="Share your experience with healthcare providers and read reviews from others."
        actions={
          <Button type="button" onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2">
            <Star className="h-4 w-4" /> Write Review
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardHeader icon={MessageSquare} title="Write a Review" subtitle="Rate and share your experience." />
          <CardBody>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>Target Type</FieldLabel>
                  <SelectInput className="mt-1.5" value={form.targetType} onChange={(e) => setForm({ ...form, targetType: e.target.value })}>
                    <option value="diagnostic_center">Diagnostic Center</option>
                    <option value="hospital">Hospital</option>
                    <option value="doctor">Doctor</option>
                  </SelectInput>
                </div>
                <div>
                  <FieldLabel>Target ID</FieldLabel>
                  <TextInput className="mt-1.5 font-mono text-xs" required value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })} />
                </div>
              </div>
              <div>
                <FieldLabel>Rating</FieldLabel>
                <div className="mt-1.5">
                  <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
                </div>
              </div>
              <div>
                <FieldLabel>Comment</FieldLabel>
                <TextArea className="mt-1.5" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
              </div>
              <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" /> Submit Review
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader icon={MessageSquare} title="All Reviews" subtitle={`${reviews.length} total`} />
        <CardBody className="pt-0 space-y-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.25) }}
              className="rounded-xl border border-slate-100 bg-slate-50/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{r.userId?.fullName || 'Anonymous'}</p>
                    <Badge variant="default">{r.targetType?.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'text-amber-400' : 'text-slate-200'}`} fill={s <= r.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  {r.comment && <p className="text-sm text-slate-600 mt-2">{r.comment}</p>}
                  <p className="text-xs text-slate-400 mt-2">{new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
                {!r.isApproved && <Badge variant="warning">Pending</Badge>}
              </div>
            </motion.div>
          ))}
          {!reviews.length && <div className="py-12 text-center text-sm text-slate-500">No reviews yet.</div>}
        </CardBody>
      </Card>
    </div>
  );
}
