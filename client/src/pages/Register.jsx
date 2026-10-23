import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import AuthSplitLayout from '../components/layout/AuthSplitLayout.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FieldLabel, TextInput, SelectInput, FormGrid } from '../components/ui/FormPrimitives.jsx';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ fullName, email, password, phone, role, profile: { ...profile } });
      navigate('/verify-otp', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || JSON.stringify(err.response?.data) || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      title="Create your account"
      subtitle="Choose your role and complete your profile. Institutions may require admin approval before going live."
      sideImage="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1200&q=80"
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft max-h-[calc(100vh-8rem)] overflow-y-auto">
        <div className="flex items-center gap-2 text-brand-600 mb-2">
          <UserPlus className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Registration</span>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</div>
          )}
          <div>
            <FieldLabel>Role</FieldLabel>
            <SelectInput className="mt-1.5" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="hospital_admin">Hospital administrator</option>
              <option value="center_admin">Diagnostic center administrator</option>
              <option value="ambulance">Ambulance provider</option>
            </SelectInput>
          </div>
          <FormGrid>
            <div className="sm:col-span-2">
              <FieldLabel>Full name</FieldLabel>
              <TextInput className="mt-1.5" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Email</FieldLabel>
              <TextInput
                className="mt-1.5"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <FieldLabel>Phone</FieldLabel>
              <TextInput className="mt-1.5" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Password</FieldLabel>
              <TextInput
                className="mt-1.5"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
          </FormGrid>

          {role === 'patient' && (
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <div>
                <FieldLabel>Age</FieldLabel>
                <TextInput
                  type="number"
                  className="mt-1.5"
                  onChange={(e) => setProfile((p) => ({ ...p, age: Number(e.target.value) }))}
                />
              </div>
              <div>
                <FieldLabel>Gender</FieldLabel>
                <SelectInput className="mt-1.5" onChange={(e) => setProfile((p) => ({ ...p, gender: e.target.value }))}>
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </SelectInput>
              </div>
              <div className="col-span-2">
                <FieldLabel>Address</FieldLabel>
                <TextInput className="mt-1.5" onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} />
              </div>
            </div>
          )}

          {role === 'doctor' && (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <TextInput placeholder="Specialization" onChange={(e) => setProfile((p) => ({ ...p, specialization: e.target.value }))} />
              <TextInput placeholder="License number" onChange={(e) => setProfile((p) => ({ ...p, licenseNumber: e.target.value }))} />
              <TextInput
                placeholder="Hospital name (creates pending hospital)"
                onChange={(e) => setProfile((p) => ({ ...p, hospitalName: e.target.value }))}
              />
            </div>
          )}

          {role === 'hospital_admin' && (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <TextInput
                placeholder="Hospital name *"
                required
                onChange={(e) => setProfile((p) => ({ ...p, hospitalName: e.target.value }))}
              />
              <TextInput placeholder="Location" onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} />
            </div>
          )}

          {role === 'center_admin' && (
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <TextInput
                placeholder="Center name *"
                required
                onChange={(e) => setProfile((p) => ({ ...p, centerName: e.target.value }))}
              />
              <TextInput placeholder="Location" onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))} />
              <TextInput
                placeholder="Services (comma separated)"
                onChange={(e) =>
                  setProfile((p) => ({
                    ...p,
                    availableServices: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                  }))
                }
              />
            </div>
          )}

          <Button type="submit" className="w-full py-3" loading={loading}>
            Create account
          </Button>
        </form>
        <p className="text-center text-sm text-slate-600 mt-4">
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Already have an account?
          </Link>
        </p>
        <p className="mt-3 text-center">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-800">
            ← Back to home
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
