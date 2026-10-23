import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { FieldLabel, SelectInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { FileText, Download, User, Calendar, ChevronRight, Printer, TrendingUp, Users, Activity, AlertCircle } from 'lucide-react';

export default function PatientReportsPage() {
  const [patients, setPatients] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  useEffect(() => {
    api.get('/patients').then(r => setPatients(r.data)).catch(() => {});
    api.get('/referrals').then(r => setReferrals(r.data)).catch(() => {});
    api.get('/prescriptions').then(r => setPrescriptions(r.data)).catch(() => {});
    api.get('/medical-records').then(r => setRecords(r.data)).catch(() => {});
  }, []);

  const selectedPatientData = patients.find(p => (p.userId?._id || p._id) === selectedPatient);

  const patientReferrals = selectedPatient
    ? referrals.filter(r => r.patientId?._id === selectedPatient || r.patientId === selectedPatient)
    : referrals;

  const patientPrescriptions = selectedPatient
    ? prescriptions.filter(p => p.patientId?._id === selectedPatient || p.patientId === selectedPatient)
    : prescriptions;

  const patientRecords = selectedPatient
    ? records.filter(r => r.patientId?._id === selectedPatient || r.patientId === selectedPatient)
    : records;

  const generateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setReportGenerated(true);
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Reporting"
        title="Patient Reports"
        description="Generate comprehensive reports for individual patients or your entire practice."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-slate-900">{patients.length}</p><p className="text-xs text-slate-500">Total Patients</p></CardBody></Card>
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-brand-600">{referrals.length}</p><p className="text-xs text-slate-500">Referrals</p></CardBody></Card>
        <Card><CardBody className="text-center py-4"><p className="text-2xl font-bold text-emerald-600">{prescriptions.length}</p><p className="text-xs text-slate-500">Prescriptions</p></CardBody></Card>
      </div>

      <Card>
        <CardHeader icon={FileText} title="Generate Patient Report" subtitle="Select a patient and date range to generate a comprehensive report." />
        <CardBody className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Patient</FieldLabel>
              <SelectInput className="mt-1.5" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
                <option value="">All Patients</option>
                {patients.map(p => (
                  <option key={p._id} value={p.userId?._id || p._id}>
                    {p.userId?.fullName || 'Unknown'} {p.bloodGroup ? `(${p.bloodGroup})` : ''}
                  </option>
                ))}
              </SelectInput>
            </div>
            <div>
              <FieldLabel>Date Range</FieldLabel>
              <SelectInput className="mt-1.5" value={dateRange} onChange={e => setDateRange(e.target.value)}>
                <option value="all">All Time</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last Year</option>
              </SelectInput>
            </div>
          </div>
          <Button type="button" onClick={generateReport} loading={generating} className="inline-flex items-center gap-2">
            <FileText className="h-4 w-4" /> Generate Report
          </Button>

          {reportGenerated && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-emerald-900">Report Generated Successfully</p>
                  <p className="text-sm text-emerald-700 mt-0.5">
                    {selectedPatientData?.userId?.fullName || 'All Patients'} — {
                      patientReferrals.length + patientPrescriptions.length + patientRecords.length
                    } total records
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                    <Download className="h-3.5 w-3.5" /> PDF
                  </Button>
                  <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                    <Printer className="h-3.5 w-3.5" /> Print
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </CardBody>
      </Card>

      {selectedPatient && selectedPatientData && (
        <Card>
          <CardHeader icon={TrendingUp} title="Patient Summary" subtitle={selectedPatientData.userId?.fullName} />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-3 mb-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 text-center">
                <p className="text-lg font-bold text-slate-900">{patientReferrals.length}</p>
                <p className="text-xs text-slate-500">Referrals</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 text-center">
                <p className="text-lg font-bold text-slate-900">{patientPrescriptions.length}</p>
                <p className="text-xs text-slate-500">Prescriptions</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 text-center">
                <p className="text-lg font-bold text-slate-900">{patientRecords.length}</p>
                <p className="text-xs text-slate-500">Records</p>
              </div>
            </div>
            <div className="space-y-2">
              {selectedPatientData.medicalHistory?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Medical History:</span>
                  {selectedPatientData.medicalHistory.map((h, i) => (
                    <Badge key={i} variant="info">{h}</Badge>
                  ))}
                </div>
              )}
              {selectedPatientData.allergies?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs font-semibold text-slate-500 mr-1">Allergies:</span>
                  {selectedPatientData.allergies.map((a, i) => (
                    <Badge key={i} variant="warning">{a}</Badge>
                  ))}
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {!selectedPatient && (
        <Card>
          <CardHeader icon={Users} title="Practice Overview" subtitle="Summary of all patient activity" />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{referrals.length}</p>
                <p className="text-xs text-slate-500">Total Referrals</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{prescriptions.length}</p>
                <p className="text-xs text-slate-500">Prescriptions Issued</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{records.length}</p>
                <p className="text-xs text-slate-500">Medical Records</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-4 text-center">
                <p className="text-2xl font-bold text-slate-900">{referrals.filter(r => r.referralStatus === 'completed').length}</p>
                <p className="text-xs text-slate-500">Completed Referrals</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
