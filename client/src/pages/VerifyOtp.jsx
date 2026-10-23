import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthSplitLayout from '../components/layout/AuthSplitLayout.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FieldLabel, TextInput } from '../components/ui/FormPrimitives.jsx';
import api from '../services/api.js';
import { ShieldCheck } from 'lucide-react';

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(state?.email || '');
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await api.post('/auth/verify-otp', { email, otp });
    setMsg('Verified. You can continue to the app.');
    setTimeout(() => navigate('/app'), 1000);
    setLoading(false);
  };

  return (
    <AuthSplitLayout
      title="Verify your email"
      subtitle="Enter the one-time code we sent you. In demo mode, the code also appears in your in-app notifications."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft space-y-4">
        <div className="flex items-center gap-2 text-brand-600">
          <ShieldCheck className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">OTP verification</span>
        </div>
        {msg && <div className="text-sm text-emerald-800 bg-emerald-50 rounded-xl px-4 py-3">{msg}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <FieldLabel>Email</FieldLabel>
            <TextInput className="mt-1.5" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <FieldLabel>One-time code</FieldLabel>
            <TextInput className="mt-1.5 tracking-widest" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" loading={loading}>
            Verify & continue
          </Button>
        </form>
        <Link to="/app" className="block text-center text-sm font-semibold text-slate-500 hover:text-slate-800">
          Skip to app (already verified)
        </Link>
      </div>
    </AuthSplitLayout>
  );
}
