import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, SelectInput, FormGrid } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { UserCircle, Save, Stethoscope, Award, Building2, Phone, Mail, FileText, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DoctorProfilePage() {
  const { user, profile, refreshMe } = useAuth();
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  useEffect(() => {
    setForm({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      specialization: profile?.specialization || '',
      licenseNumber: profile?.licenseNumber || '',
      hospitalName: profile?.hospitalId?.name || profile?.hospitalName || '',
      hospitalLocation: profile?.hospitalId?.location || '',
      credentials: profile?.credentials || '',
      bio: profile?.bio || '',
      education: profile?.education || '',
      yearsOfExperience: profile?.yearsOfExperience || '',
    });
  }, [user, profile]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.patch('/doctors/me', {
        fullName: form.fullName,
        phone: form.phone,
        specialization: form.specialization,
        licenseNumber: form.licenseNumber,
        credentials: form.credentials,
        bio: form.bio,
        education: form.education,
        yearsOfExperience: form.yearsOfExperience ? Number(form.yearsOfExperience) : undefined,
      });
      await refreshMe();
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch {
      // handled silently
    }
    setSaving(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadMsg('Uploading...');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'credential');
    try {
      const { data } = await api.post('/upload', formData);
      setForm({ ...form, credentials: data.url || data.fileUrl });
      setUploadMsg('Uploaded successfully');
      setTimeout(() => setUploadMsg(''), 3000);
    } catch {
      setUploadMsg('Upload failed');
    }
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Profile"
        title="Doctor Profile"
        description="Manage your professional information and credentials."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-brand-600 via-brand-500 to-care-500" />
          <CardBody className="-mt-12 relative text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg ring-4 ring-white">
              <UserCircle className="h-10 w-10 text-brand-600" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">Dr. {user?.fullName}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="mt-3 flex justify-center gap-2 flex-wrap">
              <Badge variant="info">Doctor</Badge>
              {profile?.specialization && <Badge variant="default">{profile.specialization}</Badge>}
              {user?.isVerified && <Badge variant="success">Verified</Badge>}
            </div>
            {profile?.licenseNumber && (
              <p className="mt-3 text-xs text-slate-400">License: {profile.licenseNumber}</p>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader icon={Stethoscope} title="Professional Details" subtitle="Update your medical profile and credentials." />
          <CardBody>
            {saved && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 flex items-center gap-2">
                <Save className="h-4 w-4" /> Profile saved successfully.
              </div>
            )}
            <form onSubmit={save} className="space-y-4">
              <FormGrid>
                <div className="sm:col-span-2">
                  <FieldLabel>Full Name</FieldLabel>
                  <TextInput className="mt-1.5" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
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
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Medical Information</h3>
                <FormGrid>
                  <div className="sm:col-span-2">
                    <FieldLabel>Specialization</FieldLabel>
                    <SelectInput className="mt-1.5" value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}>
                      <option value="">Select specialization</option>
                      <option value="General Practice">General Practice</option>
                      <option value="Internal Medicine">Internal Medicine</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="ENT">ENT</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Radiology">Radiology</option>
                      <option value="Pathology">Pathology</option>
                      <option value="Anesthesiology">Anesthesiology</option>
                      <option value="Surgery">Surgery</option>
                      <option value="Emergency Medicine">Emergency Medicine</option>
                      <option value="Other">Other</option>
                    </SelectInput>
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel><Award className="h-3.5 w-3.5 inline mr-1" />License Number</FieldLabel>
                    <TextInput className="mt-1.5" value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })} placeholder="Medical license number" />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel><Building2 className="h-3.5 w-3.5 inline mr-1" />Hospital / Affiliation</FieldLabel>
                    <TextInput className="mt-1.5" value={form.hospitalName} onChange={e => setForm({ ...form, hospitalName: e.target.value })} placeholder="Hospital name or practice" />
                  </div>
                  <div className="sm:col-span-2">
                    <FieldLabel>Education & Training</FieldLabel>
                    <TextInput className="mt-1.5" value={form.education} onChange={e => setForm({ ...form, education: e.target.value })} placeholder="e.g. MD, University of Addis Ababa, 2015" />
                  </div>
                  <div>
                    <FieldLabel>Years of Experience</FieldLabel>
                    <TextInput type="number" className="mt-1.5" value={form.yearsOfExperience} onChange={e => setForm({ ...form, yearsOfExperience: e.target.value })} />
                  </div>
                </FormGrid>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Bio</h3>
                <TextInput className="mt-1.5" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short professional biography..." />
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2"><Upload className="h-4 w-4" /> Credentials Upload</h3>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
                    <Upload className="h-4 w-4" /> Choose File
                    <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={handleUpload} />
                  </label>
                  {form.credentials && (
                    <span className="text-xs text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> File uploaded</span>
                  )}
                  {uploadMsg && <span className="text-xs text-slate-500">{uploadMsg}</span>}
                </div>
                <p className="text-xs text-slate-400 mt-2">Upload medical license, certifications, or diplomas (PDF, JPG, PNG).</p>
              </div>

              <Button type="submit" loading={saving} className="inline-flex items-center gap-2">
                <Save className="h-4 w-4" /> Save Profile
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
