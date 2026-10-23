import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { Search, Users, Eye, Filter, Droplets, Heart, AlertCircle, ChevronRight, Phone, Mail, User } from 'lucide-react';

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/patients')
      .then(r => {
        setPatients(r.data);
        setFiltered(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = patients;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.userId?.fullName?.toLowerCase().includes(q) ||
        p.userId?.email?.toLowerCase().includes(q) ||
        p.userId?.phone?.toLowerCase().includes(q) ||
        p.bloodGroup?.toLowerCase().includes(q)
      );
    }
    if (bloodFilter !== 'all') result = result.filter(p => p.bloodGroup === bloodFilter);
    if (genderFilter !== 'all') result = result.filter(p => p.gender === genderFilter);
    setFiltered(result);
  }, [search, bloodFilter, genderFilter, patients]);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Patients"
        title="Search Patients"
        description="Find patients by name, contact, or medical information."
      />

      <Card>
        <CardHeader icon={Search} title="Search & Filter" subtitle={`${filtered.length} of ${patients.length} patients`} />
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <TextInput className="pl-10" placeholder="Search by name, email, phone, blood group..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <SelectInput className="w-full sm:w-40" value={bloodFilter} onChange={e => setBloodFilter(e.target.value)}>
              <option value="all">All Blood Types</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(b => <option key={b} value={b}>{b}</option>)}
            </SelectInput>
            <SelectInput className="w-full sm:w-36" value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </SelectInput>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={Users} title="Patient List" subtitle={loading ? 'Loading...' : `${filtered.length} records`} />
        <CardBody className="pt-0">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.03, 0.3) }}>
                <Card className="h-full" hover>
                  <CardBody>
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-md">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate">{p.userId?.fullName || 'Unknown Patient'}</p>
                        {p.userId?.email && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                            <Mail className="h-3 w-3 shrink-0" /> {p.userId.email}
                          </p>
                        )}
                        {p.userId?.phone && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3" /> {p.userId.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.bloodGroup && <Badge variant="info"><Droplets className="h-3 w-3 mr-0.5" />{p.bloodGroup}</Badge>}
                      {p.gender && <Badge variant="muted">{p.gender}</Badge>}
                      {p.age && <Badge variant="muted">{p.age} yrs</Badge>}
                    </div>
                    {(p.allergies?.length > 0 || p.medicalHistory?.length > 0) && (
                      <div className="mt-3 space-y-1">
                        {p.allergies?.length > 0 && (
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3 text-amber-500" /> Allergies: {p.allergies.slice(0, 2).join(', ')}{p.allergies.length > 2 ? ` +${p.allergies.length - 2}` : ''}
                          </p>
                        )}
                        {p.medicalHistory?.length > 0 && (
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Heart className="h-3 w-3 text-brand-500" /> History: {p.medicalHistory.slice(0, 2).join(', ')}{p.medicalHistory.length > 2 ? ` +${p.medicalHistory.length - 2}` : ''}
                          </p>
                        )}
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Link to={`/app/patient-medical-history/${p.userId?._id || p._id}`} className="flex-1">
                        <Button type="button" variant="secondary" className="w-full !py-1.5 text-xs inline-flex items-center justify-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> Medical History
                        </Button>
                      </Link>
                      <Link to={`/app/patient-notes/${p.userId?._id || p._id}`}>
                        <Button type="button" variant="ghost" className="!py-1.5 text-xs">
                          Notes
                        </Button>
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
          {!filtered.length && !loading && (
            <div className="py-12 text-center text-sm text-slate-500">No patients match your criteria.</div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
