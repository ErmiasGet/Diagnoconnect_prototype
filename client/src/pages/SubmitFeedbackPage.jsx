import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, SelectInput, TextArea } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp, Send, CheckCircle2, Lightbulb, Bug, Heart } from 'lucide-react';

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button" onClick={() => onChange(star)}
          className={`p-0.5 transition-colors ${star <= value ? 'text-amber-400' : 'text-slate-200'}`}>
          <Star className="h-8 w-8" fill={star <= value ? 'currentColor' : 'none'} />
        </button>
      ))}
    </div>
  );
}

const feedbackTypes = [
  { value: 'suggestion', label: 'Suggestion', icon: Lightbulb },
  { value: 'bug_report', label: 'Bug Report', icon: Bug },
  { value: 'compliment', label: 'Compliment', icon: Heart },
  { value: 'improvement', label: 'Improvement Idea', icon: ThumbsUp },
  { value: 'other', label: 'Other', icon: MessageSquare },
];

export default function SubmitFeedbackPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ feedbackType: 'suggestion', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reviews', { targetType: 'diagnostic_center', targetId: 'general', rating: form.rating, comment: `[${form.feedbackType}] ${form.comment}` });
      setSuccess(true);
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="space-y-8">
        <SectionHeader eyebrow="Feedback" title="Thank You!" />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-care-500 text-white shadow-lg mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Feedback Submitted</h2>
            <p className="text-sm text-slate-600 mt-2">Thank you for sharing your thoughts. We appreciate your input and use it to improve our services.</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => { setSuccess(false); setForm({ feedbackType: 'suggestion', rating: 5, comment: '' }); }}>
                Submit Another
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/app')}>
                Back to Dashboard
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
        eyebrow="Feedback"
        title="Submit Feedback"
        description="We value your opinion. Let us know how we can improve your experience."
      />

      <Card>
        <CardHeader icon={MessageSquare} title="Share Your Thoughts" subtitle="Your feedback helps us serve you better." />
        <CardBody>
          <form onSubmit={submit} className="space-y-6">
            <div>
              <FieldLabel>Feedback Type</FieldLabel>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                {feedbackTypes.map(ft => {
                  const Icon = ft.icon;
                  return (
                    <button key={ft.value} type="button" onClick={() => setForm({ ...form, feedbackType: ft.value })}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                        form.feedbackType === ft.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}>
                      <Icon className="h-5 w-5" />
                      <span className="text-[10px]">{ft.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <FieldLabel>Rating</FieldLabel>
              <div className="mt-2">
                <StarRating value={form.rating} onChange={r => setForm({ ...form, rating: r })} />
              </div>
            </div>

            <div>
              <FieldLabel>Your Comments</FieldLabel>
              <TextArea className="mt-1.5" required rows={5} value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })}
                placeholder="Tell us about your experience, suggestions, or any issues you encountered..." />
            </div>

            <Button type="submit" loading={submitting} className="inline-flex items-center gap-2">
              <Send className="h-4 w-4" /> Submit Feedback
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
