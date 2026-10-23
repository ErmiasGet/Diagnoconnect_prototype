import { useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Shield, Lock, Key, Eye, EyeOff, CheckCircle2, Smartphone, History, LogOut, AlertTriangle, Save } from 'lucide-react';

export default function SecuritySettingsPage() {
  const { user } = useAuth();
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  const changePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');
    if (passForm.newPassword !== passForm.confirmPassword) {
      setPassError('Passwords do not match.');
      return;
    }
    if (passForm.newPassword.length < 6) {
      setPassError('Password must be at least 6 characters.');
      return;
    }
    setChangingPass(true);
    try {
      await api.post('/auth/change-password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      setPassSuccess('Password changed successfully.');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password.');
    }
    setChangingPass(false);
  };

  const sessions = [
    { device: 'Chrome on Windows', lastActive: '2 hours ago', current: true, location: 'Addis Ababa, Ethiopia' },
    { device: 'Safari on iPhone', lastActive: '3 days ago', current: false, location: 'Addis Ababa, Ethiopia' },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Security"
        title="Security Settings"
        description="Manage your password, active sessions, and account security."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader icon={Lock} title="Change Password" subtitle="Use a strong password that you don't use elsewhere." />
          <CardBody>
            {passSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> {passSuccess}
              </div>
            )}
            {passError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> {passError}
              </div>
            )}
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <FieldLabel>Current Password</FieldLabel>
                <div className="relative mt-1.5">
                  <TextInput type={showPass ? 'text' : 'password'} required value={passForm.currentPassword}
                    onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })} className="pr-10" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <FieldLabel>New Password</FieldLabel>
                <TextInput className="mt-1.5" type="password" required minLength={6} value={passForm.newPassword}
                  onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Confirm New Password</FieldLabel>
                <TextInput className="mt-1.5" type="password" required minLength={6} value={passForm.confirmPassword}
                  onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })} />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Shield className="h-3.5 w-3.5" />
                Password must be at least 6 characters. Use a mix of letters, numbers, and symbols.
              </div>
              <Button type="submit" loading={changingPass} className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" /> Update Password
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={Shield} title="Security Status" />
          <CardBody className="space-y-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Two-Factor Auth</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm font-semibold text-slate-900">Not Enabled</p>
                <Badge variant="warning">Disabled</Badge>
              </div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Email Verified</p>
              <div className="mt-1"><Badge variant={user?.isVerified ? 'success' : 'warning'}>{user?.isVerified ? 'Yes' : 'No'}</Badge></div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Phone Verified</p>
              <div className="mt-1"><Badge variant={user?.isPhoneVerified ? 'success' : 'muted'}>{user?.isPhoneVerified ? 'Yes' : 'No'}</Badge></div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Password Age</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">Current session</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader icon={Smartphone} title="Active Sessions" subtitle="Devices currently logged into your account" />
        <CardBody className="pt-0 space-y-3">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{s.device}</p>
                    {s.current && <Badge variant="success">Current</Badge>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{s.location} · Active {s.lastActive}</p>
                </div>
              </div>
              {!s.current && (
                <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs text-red-600 inline-flex items-center gap-1">
                  <LogOut className="h-3.5 w-3.5" /> Revoke
                </Button>
              )}
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
