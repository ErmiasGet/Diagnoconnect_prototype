import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, SelectInput, FormGrid } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Save, ArrowLeft, UserCircle, Heart, AlertCircle, Droplets, Phone, Camera, Calendar, MapPin, Activity } from 'lucide-react';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, profile, refreshMe } = useAuth();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      age: profile?.age || '',
      gender: profile?.gender || '',
      address: profile?.address || '',
      bloodGroup: profile?.bloodGroup || '',
      photoUrl: profile?.photoUrl || '',
      medicalHistory: (profile?.medicalHistory || []).join(', '),
      allergies: (profile?.allergies || []).join(', '),
      chronicConditions: (profile?.chronicConditions || []).join(', '),
    });
  }, [user, profile]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.patch('/patients/me', {
        fullName: form.fullName,
        phone: form.phone,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender,
        address: form.address,
        photoUrl: form.photoUrl,
        bloodGroup: form.bloodGroup,
        medicalHistory: (form.medicalHistory || '').split(',').map(s => s.trim()).filter(Boolean),
        allergies: (form.allergies || '').split(',').map(s => s.trim()).filter(Boolean),
        chronicConditions: (form.chronicConditions || '').split(',').map(s => s.trim()).filter(Boolean),
      });
      await refreshMe();
      setSaved(true);
      setTimeout(() => navigate('/app/patient-profile'), 1500);
    } catch {
      // error handled silently
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Profile"
        title="Edit Profile"
        description="Update your personal and medical information."
        actions={
          <Button type="button" variant="secondary" onClick={() => navigate('/app/patient-profile')} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        }
      />

      <Card>
        <CardHeader icon={UserCircle} title="Personal Details" subtitle="Update your information below." />
        <CardBody>
          {saved && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 flex items-center gap-2">
              <Save className="h-4 w-4" /> Profile saved successfully. Redirecting...
            </div>
          )}
          <form onSubmit={save} className="space-y-4">
            <FormGrid>
              <div className="sm:col-span-2">
                <FieldLabel>Full name</FieldLabel>
                <TextInput className="mt-1.5" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div>
                <FieldLabel><Phone className="h-3.5 w-3.5 inline mr-1" />Phone</FieldLabel>
                <TextInput className="mt-1.5" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <FieldLabel><Camera className="h-3.5 w-3.5 inline mr-1" />Photo URL</FieldLabel>
                <TextInput className="mt-1.5" value={form.photoUrl} onChange={e => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <FieldLabel><Calendar className="h-3.5 w-3.5 inline mr-1" />Age</FieldLabel>
                <TextInput type="number" className="mt-1.5" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
              </div>
              <div>
                <FieldLabel><Heart className="h-3.5 w-3.5 inline mr-1" />Gender</FieldLabel>
                <SelectInput className="mt-1.5" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel><Droplets className="h-3.5 w-3.5 inline mr-1" />Blood Group</FieldLabel>
                <SelectInput className="mt-1.5" value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })}>
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </SelectInput>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel><MapPin className="h-3.5 w-3.5 inline mr-1" />Address</FieldLabel>
                <TextInput className="mt-1.5" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
            </FormGrid>

            <div className="border-t border-slate-100 pt-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Medical Information
              </h3>
              <FormGrid>
                <div className="sm:col-span-2">
                  <FieldLabel>Medical History (comma separated)</FieldLabel>
                  <TextInput className="mt-1.5" value={form.medicalHistory} onChange={e => setForm({ ...form, medicalHistory: e.target.value })} placeholder="e.g. Surgery 2020, Asthma" />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel><AlertCircle className="h-3.5 w-3.5 inline mr-1" />Allergies</FieldLabel>
                  <TextInput className="mt-1.5" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} placeholder="e.g. Penicillin, Peanuts" />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel><AlertCircle className="h-3.5 w-3.5 inline mr-1" />Chronic Conditions</FieldLabel>
                  <TextInput className="mt-1.5" value={form.chronicConditions} onChange={e => setForm({ ...form, chronicConditions: e.target.value })} placeholder="e.g. Diabetes, Hypertension" />
                </div>
              </FormGrid>
            </div>

            <Button type="submit" loading={saving} className="inline-flex items-center gap-2">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
