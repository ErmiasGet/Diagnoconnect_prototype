import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { FieldLabel, TextInput, SelectInput, FormGrid } from '../components/ui/FormPrimitives.jsx';
import { Button } from '../components/ui/Button.jsx';
import { CreditCard, Wallet, CheckCircle2, ArrowLeft } from 'lucide-react';

const payMethods = [
  { value: 'telebirr', label: 'Telebirr', icon: '📱' },
  { value: 'mobile_banking', label: 'Mobile Banking', icon: '🏦' },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: '💳' },
  { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { value: 'cash', label: 'Cash', icon: '💵' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ amount: '', paymentMethod: 'telebirr', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/payments', { amount: Number(form.amount), paymentMethod: form.paymentMethod, description: form.description });
      setSuccess(true);
    } catch {
      // handled silently
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="space-y-8">
        <SectionHeader eyebrow="Billing" title="Payment Submitted" />
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <CardBody className="text-center py-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-care-500 text-white shadow-lg mb-4">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Payment Initiated</h2>
            <p className="text-sm text-slate-600 mt-2">Your payment of <strong>{form.amount} ETB</strong> via {payMethods.find(m => m.value === form.paymentMethod)?.label} has been initiated. Check payment history for status updates.</p>
            <div className="flex justify-center gap-3 mt-6">
              <Button type="button" onClick={() => navigate('/app/payment-history')} className="inline-flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> View History
              </Button>
              <Button type="button" variant="secondary" onClick={() => { setSuccess(false); setForm({ amount: '', paymentMethod: 'telebirr', description: '' }); }}>
                Pay Again
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Billing"
        title="Make a Payment"
        description="Pay for diagnostic services, consultations, and other healthcare expenses."
      />

      <Card>
        <CardHeader icon={CreditCard} title="Payment Details" subtitle="Enter the amount and choose your payment method." />
        <CardBody>
          <form onSubmit={submit} className="space-y-6">
            <FormGrid>
              <div className="sm:col-span-2">
                <FieldLabel>Amount (ETB)</FieldLabel>
                <TextInput className="mt-1.5 text-lg font-semibold" type="number" required min="1" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel>Description</FieldLabel>
                <TextInput className="mt-1.5" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. MRI scan payment, Consultation fee..." />
              </div>
            </FormGrid>

            <div>
              <FieldLabel>Payment Method</FieldLabel>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                {payMethods.map(m => (
                  <button key={m.value} type="button" onClick={() => setForm({ ...form, paymentMethod: m.value })}
                    className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                      form.paymentMethod === m.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}>
                    <span className="text-lg">{m.icon}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" loading={submitting} className="w-full inline-flex items-center justify-center gap-2">
              <Wallet className="h-4 w-4" /> Pay {form.amount ? `${form.amount} ETB` : ''}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
