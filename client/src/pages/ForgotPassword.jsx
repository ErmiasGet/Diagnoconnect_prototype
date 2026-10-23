import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthSplitLayout from '../components/layout/AuthSplitLayout.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FieldLabel, TextInput } from '../components/ui/FormPrimitives.jsx';
import api from '../services/api.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/auth/forgot-password', { email });
    setMsg('If the email exists, reset instructions were sent. Check notifications when logged in, or your inbox if email is configured.');
    setLoading(false);
  };

  return (
    <AuthSplitLayout title="Reset your password" subtitle="We will send a secure reset link to your account email.">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft space-y-4">
        {msg && <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">{msg}</div>}
        <div>
          <FieldLabel>Email</FieldLabel>
          <TextInput className="mt-1.5" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          Send reset link
        </Button>
        <Link to="/login" className="block text-center text-sm font-semibold text-brand-600">
          Back to sign in
        </Link>
      </form>
    </AuthSplitLayout>
  );
}
