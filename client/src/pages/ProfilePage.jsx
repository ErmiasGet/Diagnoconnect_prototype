import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, SelectInput, TextArea, FormGrid } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { UserCircle, Save, Phone, Camera, Heart, AlertCircle, Users, Plus, Trash2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, refreshMe } = useAuth();
  const [form, setForm] = useState({});
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');

  useEffect(() => {
    setForm({
      fullName: user?.fullName,
      phone: user?.phone,
      age: profile?.age,
      gender: profile?.gender,
      address: profile?.address,
      medicalHistory: (profile?.medicalHistory || []).join(', '),
      allergies: (profile?.allergies || []).join(', '),
      chronicConditions: (profile?.chronicConditions || []).join(', '),
      bloodGroup: profile?.bloodGroup,
      photoUrl: profile?.photoUrl,
      specialization: profile?.specialization,
      licenseNumber: profile?.licenseNumber,
      centerName: profile?.centerName,
      location: profile?.location,
      scheduleNotes: profile?.scheduleNotes,
      name: profile?.name,
      contactPhone: profile?.contactPhone,
    });
    if (profile?.emergencyContacts) {
      setEmergencyContacts(profile.emergencyContacts);
    }
  }, [user, profile]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const body = {};
    if (user.role === 'patient') {
      Object.assign(body, {
        fullName: form.fullName, phone: form.phone, age: form.age, gender: form.gender,
        address: form.address, photoUrl: form.photoUrl, bloodGroup: form.bloodGroup,
        medicalHistory: (form.medicalHistory || '').split(',').map((s) => s.trim()).filter(Boolean),
        allergies: (form.allergies || '').split(',').map((s) => s.trim()).filter(Boolean),
        chronicConditions: (form.chronicConditions || '').split(',').map((s) => s.trim()).filter(Boolean),
      });
      await api.patch('/patients/me', body);
    } else if (user.role === 'doctor') {
      await api.patch('/doctors/me', { fullName: form.fullName, phone: form.phone, specialization: form.specialization, licenseNumber: form.licenseNumber });
    } else if (user.role === 'center_admin') {
      await api.patch('/centers/me', { centerName: form.centerName, location: form.location, contactPhone: form.contactPhone, scheduleNotes: form.scheduleNotes });
    } else if (user.role === 'hospital_admin') {
      await api.patch('/hospitals/me', { name: form.name, location: form.location, contactPhone: form.contactPhone });
    }
    await refreshMe();
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 4000);
  };

  const sendPhoneOtp = async () => {
    await api.post('/auth/send-phone-otp', { phone: form.phone });
    setPhoneOtpSent(true);
  };

  const verifyPhone = async () => {
    await api.post('/auth/verify-phone-otp', { otp: phoneOtp });
    await refreshMe();
    setPhoneOtpSent(false);
    setPhoneOtp('');
  };

  const addEmergencyContact = async () => {
    const name = prompt('Contact name:');
    if (!name) return;
    const phone = prompt('Contact phone:');
    if (!phone) return;
    const { data } = await api.post('/patients/me/emergency-contacts', { name, phone, relationship: prompt('Relationship:') || '' });
    setEmergencyContacts([...emergencyContacts, data]);
  };

  const removeEmergencyContact = async (id) => {
    await api.delete(`/patients/me/emergency-contacts/${id}`);
    setEmergencyContacts(emergencyContacts.filter((c) => c._id !== id));
  };

  const canEdit = ['patient', 'doctor', 'center_admin', 'hospital_admin'].includes(user?.role);

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="Account" title="Profile & Organization" description="Manage your personal details, medical information, and emergency contacts." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-brand-600 via-brand-500 to-care-500 relative">
            {form.photoUrl && (
              <img src={form.photoUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            )}
          </div>
          <CardBody className="-mt-12 relative text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg ring-4 ring-white overflow-hidden">
              {form.photoUrl ? (
                <img src={form.photoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <UserCircle className="h-10 w-10 text-brand-600" />
              )}
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">{user?.fullName}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="mt-3 flex justify-center gap-2 flex-wrap">
              <Badge variant="info" className="capitalize">{user?.role?.replace('_', ' ')}</Badge>
              {user?.isPhoneVerified && <Badge variant="success">Phone Verified</Badge>}
              {user?.isVerified && <Badge variant="success">Email Verified</Badge>}
            </div>
            {profile?.approvalStatus && (
              <p className="mt-3 text-xs text-slate-500">Institution: <span className="font-semibold text-slate-700">{profile.approvalStatus}</span></p>
            )}
            {form.photoUrl && (
              <p className="mt-2 text-[10px] text-slate-400 truncate px-2">{form.photoUrl}</p>
            )}
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader icon={UserCircle} title="Details" subtitle={canEdit ? 'Update your information below.' : 'View-only for your role.'} />
          <CardBody>
            {saved && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 flex items-center gap-2">
                <Save className="h-4 w-4" /> Profile saved successfully.
              </div>
            )}
            <form onSubmit={save} className="space-y-4">
              <FormGrid>
                <div className="sm:col-span-2">
                  <FieldLabel>Full name</FieldLabel>
                  <TextInput className="mt-1.5" value={form.fullName || ''} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                </div>
                <div>
                  <FieldLabel>Phone</FieldLabel>
                  <div className="relative mt-1.5">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <TextInput className="pl-10" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>
                <div className="flex items-end pb-2.5">
                  {!user?.isPhoneVerified ? (
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" className="text-xs" onClick={sendPhoneOtp}>{phoneOtpSent ? 'Resend OTP' : 'Verify Phone'}</Button>
                      {phoneOtpSent && (
                        <div className="flex gap-2">
                          <TextInput className="w-24 text-xs" placeholder="OTP" value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} />
                          <Button type="button" className="text-xs" onClick={verifyPhone}>Submit</Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Badge variant="success">Verified</Badge>
                  )}
                </div>
              </FormGrid>

              {user?.role === 'patient' && (
                <>
                  <FormGrid>
                    <div><FieldLabel>Age</FieldLabel><TextInput type="number" className="mt-1.5" value={form.age ?? ''} onChange={(e) => setForm({ ...form, age: e.target.value })} /></div>
                    <div><FieldLabel>Gender</FieldLabel><SelectInput className="mt-1.5" value={form.gender || ''} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                      <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                    </SelectInput></div>
                    <div className="sm:col-span-2"><FieldLabel>Address</FieldLabel><TextInput className="mt-1.5" value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                    <div><FieldLabel>Blood Group</FieldLabel><SelectInput className="mt-1.5" value={form.bloodGroup || ''} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
                      <option value="">Select</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                    </SelectInput></div>
                    <div><FieldLabel>Photo URL</FieldLabel><TextInput className="mt-1.5" value={form.photoUrl || ''} onChange={(e) => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." /></div>
                    <div className="sm:col-span-2"><FieldLabel>Medical History (comma sep.)</FieldLabel><TextInput className="mt-1.5" value={form.medicalHistory || ''} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} /></div>
                    <div className="sm:col-span-2">
                      <FieldLabel><Heart className="h-3.5 w-3.5 inline mr-1" />Allergies</FieldLabel>
                      <TextInput className="mt-1.5" value={form.allergies || ''} onChange={(e) => setForm({ ...form, allergies: e.target.value })} placeholder="e.g. Penicillin, Peanuts" />
                    </div>
                    <div className="sm:col-span-2">
                      <FieldLabel><AlertCircle className="h-3.5 w-3.5 inline mr-1" />Chronic Conditions</FieldLabel>
                      <TextInput className="mt-1.5" value={form.chronicConditions || ''} onChange={(e) => setForm({ ...form, chronicConditions: e.target.value })} placeholder="e.g. Diabetes, Hypertension" />
                    </div>
                  </FormGrid>

                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2"><Users className="h-4 w-4" /> Emergency Contacts</h3>
                      <Button type="button" variant="secondary" className="!px-3 !py-1 text-xs" onClick={addEmergencyContact}><Plus className="h-3.5 w-3.5" /> Add</Button>
                    </div>
                    {emergencyContacts.length > 0 ? (
                      <div className="space-y-2">
                        {emergencyContacts.map((c) => (
                          <div key={c._id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-2.5">
                            <div>
                              <p className="text-sm font-medium text-slate-900">{c.name}</p>
                              <p className="text-xs text-slate-500">{c.phone} {c.relationship ? `· ${c.relationship}` : ''}</p>
                            </div>
                            <Button type="button" variant="ghost" className="!px-2 text-red-500" onClick={() => removeEmergencyContact(c._id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No emergency contacts added.</p>
                    )}
                  </div>
                </>
              )}

              {user?.role === 'doctor' && (
                <FormGrid>
                  <div className="sm:col-span-2"><FieldLabel>Specialization</FieldLabel><TextInput className="mt-1.5" value={form.specialization || ''} onChange={(e) => setForm({ ...form, specialization: e.target.value })} /></div>
                  <div className="sm:col-span-2"><FieldLabel>License number</FieldLabel><TextInput className="mt-1.5" value={form.licenseNumber || ''} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} /></div>
                </FormGrid>
              )}

              {user?.role === 'center_admin' && (
                <FormGrid>
                  <div className="sm:col-span-2"><FieldLabel>Center name</FieldLabel><TextInput className="mt-1.5" value={form.centerName || ''} onChange={(e) => setForm({ ...form, centerName: e.target.value })} /></div>
                  <div className="sm:col-span-2"><FieldLabel>Location</FieldLabel><TextInput className="mt-1.5" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                  <div className="sm:col-span-2"><FieldLabel>Contact phone</FieldLabel><TextInput className="mt-1.5" value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></div>
                  <div className="sm:col-span-2"><FieldLabel>Schedule notes</FieldLabel><TextArea className="mt-1.5" value={form.scheduleNotes || ''} onChange={(e) => setForm({ ...form, scheduleNotes: e.target.value })} /></div>
                </FormGrid>
              )}

              {user?.role === 'hospital_admin' && (
                <FormGrid>
                  <div className="sm:col-span-2"><FieldLabel>Hospital name</FieldLabel><TextInput className="mt-1.5" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                  <div className="sm:col-span-2"><FieldLabel>Location</FieldLabel><TextInput className="mt-1.5" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                  <div className="sm:col-span-2"><FieldLabel>Contact phone</FieldLabel><TextInput className="mt-1.5" value={form.contactPhone || ''} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></div>
                </FormGrid>
              )}

              {canEdit && (
                <Button type="submit" loading={saving} className="inline-flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save changes
                </Button>
              )}
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
