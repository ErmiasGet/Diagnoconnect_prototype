import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { SelectInput } from '../components/ui/FormPrimitives.jsx';
import { motion } from 'framer-motion';
import { CreditCard, Receipt, DollarSign, Filter, ArrowRight } from 'lucide-react';

export default function PaymentHistoryPage() {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments')
      .then(r => {
        setPayments(r.data);
        setFiltered(r.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') setFiltered(payments);
    else setFiltered(payments.filter(p => p.status === statusFilter));
  }, [statusFilter, payments]);

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Billing"
        title="Payment History"
        description="View all your transactions and payment statuses."
        actions={
          <Link to="/app/payment">
            <Button type="button" className="inline-flex items-center gap-2">
              <DollarSign className="h-4 w-4" /> New Payment
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-slate-900">{payments.length}</p>
            <p className="text-sm text-slate-500 mt-1">Transactions</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-emerald-600">{totalAmount} ETB</p>
            <p className="text-sm text-slate-500 mt-1">Total Amount</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-amber-600">{pendingAmount} ETB</p>
            <p className="text-sm text-slate-500 mt-1">Pending</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader icon={Filter} title="Filter" />
        <CardBody>
          <SelectInput className="w-full sm:w-56" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </SelectInput>
        </CardBody>
      </Card>

      <Card>
        <CardHeader icon={Receipt} title="Transactions" subtitle={loading ? 'Loading...' : `${filtered.length} records`} />
        <CardBody className="pt-0">
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[600px] text-sm">
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
                {filtered.map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                    className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="p-3 font-mono text-xs font-semibold text-slate-900">{p.invoiceNumber || `INV-${String(p._id).slice(-6).toUpperCase()}`}</td>
                    <td className="p-3 font-semibold text-slate-900">{p.amount} ETB</td>
                    <td className="p-3 text-slate-600 capitalize">{p.paymentMethod?.replace('_', ' ')}</td>
                    <td className="p-3">
                      <Badge variant={p.status === 'completed' ? 'success' : p.status === 'failed' ? 'danger' : 'warning'}>{p.status}</Badge>
                    </td>
                    <td className="p-3 text-slate-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {p.status === 'pending' && (
                        <Button type="button" variant="success" className="!px-3 !py-1.5 text-xs" onClick={async () => { await api.post(`/payments/${p._id}/process`); window.location.reload(); }}>
                          Pay Now
                        </Button>
                      )}
                      {p.status === 'completed' && (
                        <Link to="/app/invoices">
                          <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                            <Receipt className="h-3.5 w-3.5" /> Invoice
                          </Button>
                        </Link>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && !loading && (
              <div className="p-8 text-center text-sm text-slate-500">No payment history.</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
