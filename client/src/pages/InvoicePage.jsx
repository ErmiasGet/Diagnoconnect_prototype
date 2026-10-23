import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { motion } from 'framer-motion';
import { FileText, Download, Printer, ArrowLeft, Receipt, Eye } from 'lucide-react';

export default function InvoicePage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/payments')
      .then(r => setPayments(r.data))
      .finally(() => setLoading(false));
  }, []);

  const paidPayments = payments.filter(p => p.status === 'completed');

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Billing"
        title="Invoices"
        description="View and download your payment invoices."
        actions={
          <Link to="/app/payment-history">
            <Button type="button" variant="secondary" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Payment History
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-slate-900">{payments.length}</p>
            <p className="text-sm text-slate-500 mt-1">Total Transactions</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-emerald-600">{paidPayments.length}</p>
            <p className="text-sm text-slate-500 mt-1">Paid Invoices</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-3xl font-bold text-slate-900">
              {paidPayments.reduce((sum, p) => sum + (p.amount || 0), 0)} ETB
            </p>
            <p className="text-sm text-slate-500 mt-1">Total Paid</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader icon={Receipt} title="Invoice List" subtitle={loading ? 'Loading...' : `${paidPayments.length} invoices`} />
        <CardBody className="pt-0">
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-3">Invoice #</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paidPayments.map((p, i) => (
                  <motion.tr key={p._id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                    className="border-t border-slate-100 hover:bg-slate-50/60">
                    <td className="p-3 font-mono text-xs text-slate-900 font-semibold">{p.invoiceNumber || `INV-${String(p._id).slice(-6).toUpperCase()}`}</td>
                    <td className="p-3 font-semibold text-slate-900">{p.amount} ETB</td>
                    <td className="p-3 text-slate-600 capitalize">{p.paymentMethod?.replace('_', ' ')}</td>
                    <td className="p-3 text-slate-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3"><Badge variant="success">Paid</Badge></td>
                    <td className="p-3 text-right">
                      <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> View
                      </Button>
                      <Button type="button" variant="ghost" className="!px-3 !py-1.5 text-xs inline-flex items-center gap-1">
                        <Download className="h-3.5 w-3.5" /> PDF
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {!paidPayments.length && !loading && (
              <div className="p-8 text-center text-sm text-slate-500">No paid invoices yet.</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
