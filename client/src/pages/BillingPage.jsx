import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { FieldLabel, SelectInput, TextInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { CreditCard, Receipt, DollarSign, Wallet } from 'lucide-react';

export default function BillingPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: '', paymentMethod: 'telebirr', description: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => api.get('/payments').then((r) => setPayments(r.data));

  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await api.post('/payments', { amount: Number(form.amount), paymentMethod: form.paymentMethod, description: form.description });
    setForm({ amount: '', paymentMethod: 'telebirr', description: '' });
    setShowForm(false);
    await load();
    setSubmitting(false);
  };

  const pay = async (id) => {
    await api.post(`/payments/${id}/process`);
    load();
  };

  const payMethods = [
    { value: 'telebirr', label: 'Telebirr' },
    { value: 'mobile_banking', label: 'Mobile Banking' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'cash', label: 'Cash' },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Billing"
        title="Payments & Billing"
        description="View payment history, create invoices, and process payments securely."
        actions={
          <Button type="button" onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2">
            <DollarSign className="h-4 w-4" /> New Payment
          </Button>
        }
      />

      {showForm && (
        <Card>
          <CardHeader icon={CreditCard} title="Create Payment" subtitle="Enter payment details and submit." />
          <CardBody>
            <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Amount (ETB)</FieldLabel>
                <TextInput className="mt-1.5" type="number" required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Payment Method</FieldLabel>
                <SelectInput className="mt-1.5" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
                  {payMethods.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </SelectInput>
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <TextInput className="mt-1.5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" loading={submitting}>
                  <Wallet className="h-4 w-4" /> Submit Payment
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader icon={Receipt} title="Payment History" subtitle={`${payments.length} transactions`} />
        <CardBody className="pt-0">
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, i) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="p-3 font-mono text-xs text-slate-900">{p.invoiceNumber || '—'}</td>
                    <td className="p-3 font-semibold text-slate-900">{p.amount} ETB</td>
                    <td className="p-3 text-slate-600 capitalize">{p.paymentMethod?.replace('_', ' ')}</td>
                    <td className="p-3">
                      <Badge variant={p.status === 'completed' ? 'success' : p.status === 'failed' ? 'danger' : 'warning'}>{p.status}</Badge>
                    </td>
                    <td className="p-3 text-slate-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      {p.status === 'pending' && (
                        <Button type="button" variant="success" className="!px-3 !py-1.5 text-xs" onClick={() => pay(p._id)}>
                          Pay Now
                        </Button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {!payments.length && <div className="p-8 text-center text-sm text-slate-500">No payment history.</div>}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
