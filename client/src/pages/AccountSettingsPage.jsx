import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, SelectInput, FormGrid } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Save, UserCircle, Bell, Globe, Moon, Sun, Monitor, Phone, Mail, Shield, Palette } from 'lucide-react';

export default function AccountSettingsPage() {
  const { user, refreshMe } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(prev => ({
      ...prev,
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      language: user?.preferences?.language || 'en',
      timezone: user?.preferences?.timezone || 'UTC',
      dateFormat: user?.preferences?.dateFormat || 'MM/DD/YYYY',
      emailNotifications: user?.preferences?.emailNotifications !== false,
      smsNotifications: user?.preferences?.smsNotifications || false,
      pushNotifications: user?.preferences?.pushNotifications !== false,
    }));
  }, [user]);

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.patch('/patients/me', {
        fullName: form.fullName,
        phone: form.phone,
        preferences: {
          language: form.language,
          timezone: form.timezone,
          dateFormat: form.dateFormat,
          emailNotifications: form.emailNotifications,
          smsNotifications: form.smsNotifications,
          pushNotifications: form.pushNotifications,
        },
      });
      await refreshMe();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // handled silently
    }
    setSaving(false);
  };

  const toggleSwitch = (field) => {
    setForm({ ...form, [field]: !form[field] });
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Settings"
        title="Account Settings"
        description="Manage your account preferences and notification settings."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader icon={UserCircle} title="Personal Information" />
          <CardBody>
            {saved && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 flex items-center gap-2">
                <Save className="h-4 w-4" /> Settings saved successfully.
              </div>
            )}
            <form onSubmit={saveSettings} className="space-y-4">
              <FormGrid>
                <div className="sm:col-span-2">
                  <FieldLabel>Full Name</FieldLabel>
                  <TextInput className="mt-1.5" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
                </div>
                <div>
                  <FieldLabel><Phone className="h-3.5 w-3.5 inline mr-1" />Phone</FieldLabel>
                  <TextInput className="mt-1.5" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <FieldLabel><Mail className="h-3.5 w-3.5 inline mr-1" />Email</FieldLabel>
                  <TextInput className="mt-1.5" value={user?.email || ''} disabled />
                </div>
              </FormGrid>
              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3"><Globe className="h-4 w-4" /> Preferences</h3>
                <FormGrid>
                  <div>
                    <FieldLabel>Language</FieldLabel>
                    <SelectInput className="mt-1.5" value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}>
                      <option value="en">English</option>
                      <option value="am">Amharic</option>
                      <option value="om">Oromo</option>
                      <option value="ti">Tigrinya</option>
                    </SelectInput>
                  </div>
                  <div>
                    <FieldLabel>Timezone</FieldLabel>
                    <SelectInput className="mt-1.5" value={form.timezone} onChange={e => setForm({ ...form, timezone: e.target.value })}>
                      <option value="UTC">UTC</option>
                      <option value="Africa/Addis_Ababa">East Africa Time (UTC+3)</option>
                      <option value="America/New_York">Eastern (UTC-5)</option>
                      <option value="Europe/London">London (UTC+0)</option>
                    </SelectInput>
                  </div>
                  <div>
                    <FieldLabel>Date Format</FieldLabel>
                    <SelectInput className="mt-1.5" value={form.dateFormat} onChange={e => setForm({ ...form, dateFormat: e.target.value })}>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </SelectInput>
                  </div>
                </FormGrid>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3"><Bell className="h-4 w-4" /> Notifications</h3>
                <div className="space-y-3">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive updates via text message' },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive in-app notifications' },
                  ].map(item => (
                    <label key={item.key} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/40 px-4 py-3 cursor-pointer">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <button type="button" onClick={() => toggleSwitch(item.key)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${form[item.key] ? 'bg-brand-600' : 'bg-slate-300'}`}>
                        <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${form[item.key] ? 'translate-x-5' : ''}`} />
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" loading={saving} className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Settings
              </Button>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader icon={Shield} title="Account Info" />
          <CardBody className="space-y-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Role</p>
              <p className="text-sm font-semibold text-slate-900 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Email Status</p>
              <div className="mt-1"><Badge variant={user?.isVerified ? 'success' : 'warning'}>{user?.isVerified ? 'Verified' : 'Unverified'}</Badge></div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Phone Status</p>
              <div className="mt-1"><Badge variant={user?.isPhoneVerified ? 'success' : 'muted'}>{user?.isPhoneVerified ? 'Verified' : 'Not Verified'}</Badge></div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Account Status</p>
              <div className="mt-1"><Badge variant={user?.isActive !== false ? 'success' : 'danger'}>{user?.isActive !== false ? 'Active' : 'Inactive'}</Badge></div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3">
              <p className="text-xs text-slate-500">Joined</p>
              <p className="text-sm font-semibold text-slate-900 mt-1">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
