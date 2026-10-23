import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import AuthSplitLayout from '../components/layout/AuthSplitLayout.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FieldLabel, TextInput } from '../components/ui/FormPrimitives.jsx';
import api from '../services/api.js';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const token = params.get('token') || '';

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/auth/reset-password', { token, password });
    setMsg('Password updated. Redirecting…');
    setTimeout(() => navigate('/login'), 1500);
    setLoading(false);
  };

  return (
    <AuthSplitLayout title="Choose a new password" subtitle="Use at least 6 characters. Avoid reusing old passwords.">
      <form onSubmit={submit} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft space-y-4">
        {!token && <div className="text-sm text-red-700 bg-red-50 rounded-xl px-4 py-3">Missing token in URL.</div>}
        {msg && <div className="text-sm text-emerald-800 bg-emerald-50 rounded-xl px-4 py-3">{msg}</div>}
        <div>
          <FieldLabel>New password</FieldLabel>
          <TextInput
            className="mt-1.5"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={!token} loading={loading}>
          Update password
        </Button>
        <Link to="/login" className="block text-center text-sm font-semibold text-brand-600">
          Back to sign in
        </Link>
      </form>
    </AuthSplitLayout>
  );
}
