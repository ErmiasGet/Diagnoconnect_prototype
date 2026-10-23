import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { UserCircle, Mail, Phone, MapPin, Heart, AlertCircle, Droplets, Calendar, Edit, Users, Shield, Activity } from 'lucide-react';

export default function PatientProfilePage() {
  const { user, profile } = useAuth();
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    if (profile?.emergencyContacts) {
      setEmergencyContacts(profile.emergencyContacts);
    }
  }, [profile]);

  const infoRows = [
    { icon: Mail, label: 'Email', value: user?.email },
    { icon: Phone, label: 'Phone', value: user?.phone },
    { icon: Calendar, label: 'Age', value: profile?.age },
    { icon: Heart, label: 'Gender', value: profile?.gender },
    { icon: Droplets, label: 'Blood Group', value: profile?.bloodGroup },
    { icon: MapPin, label: 'Address', value: profile?.address },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Profile"
        title="My Profile"
        description="View your personal and medical information."
        actions={
          <Link to="/app/edit-profile">
            <Button type="button" className="inline-flex items-center gap-2">
              <Edit className="h-4 w-4" /> Edit Profile
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-brand-600 via-brand-500 to-care-500" />
          <CardBody className="-mt-12 relative text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg ring-4 ring-white">
              <UserCircle className="h-10 w-10 text-brand-600" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-900">{user?.fullName}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
            <div className="mt-3 flex justify-center gap-2 flex-wrap">
              <Badge variant="info" className="capitalize">Patient</Badge>
              {user?.isPhoneVerified && <Badge variant="success">Phone Verified</Badge>}
              {user?.isVerified && <Badge variant="success">Email Verified</Badge>}
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader icon={UserCircle} title="Personal Information" />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2">
              {infoRows.map((row, i) => row.value ? (
                <motion.div key={row.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                    <row.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">{row.label}</p>
                    <p className="text-sm font-semibold text-slate-900">{row.value}</p>
                  </div>
                </motion.div>
              ) : null)}
            </div>
          </CardBody>
        </Card>
      </div>

      {profile?.medicalHistory?.length > 0 || profile?.allergies?.length > 0 || profile?.chronicConditions?.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {profile?.medicalHistory?.length > 0 && (
            <Card>
              <CardHeader icon={Activity} title="Medical History" />
              <CardBody className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {profile.medicalHistory.map((item, i) => (
                    <span key={i} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 border border-brand-100">
                      {item}
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
          {profile?.allergies?.length > 0 && (
            <Card>
              <CardHeader icon={AlertCircle} title="Allergies" />
              <CardBody className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {profile.allergies.map((item, i) => (
                    <span key={i} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-100">
                      {item}
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
          {profile?.chronicConditions?.length > 0 && (
            <Card>
              <CardHeader icon={Heart} title="Chronic Conditions" />
              <CardBody className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {profile.chronicConditions.map((item, i) => (
                    <span key={i} className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-800 border border-purple-100">
                      {item}
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      ) : null}

      <Card>
        <CardHeader icon={Users} title="Emergency Contacts" subtitle="People to notify in case of emergency" />
        <CardBody className="pt-0">
          {emergencyContacts.length > 0 ? (
            <div className="space-y-3">
              {emergencyContacts.map((c, i) => (
                <motion.div key={c._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/40 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-care-500 to-emerald-500 text-white shadow-sm">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-sm text-slate-500">{c.phone}{c.relationship ? ` · ${c.relationship}` : ''}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 py-4 text-center">No emergency contacts added.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
