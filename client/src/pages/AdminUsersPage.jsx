import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { UsersRound, Shield } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);

  const load = () => api.get('/admin/users').then((r) => setUsers(r.data));

  useEffect(() => {
    load();
  }, []);

  const toggle = async (u) => {
    await api.patch(`/admin/users/${u._id}/active`, { isActive: !u.isActive });
    load();
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Administration"
        title="User management"
        description="Activate or deactivate accounts across patients, clinicians, institutions, and partners."
      />

      <Card>
        <CardHeader icon={UsersRound} title="Directory" subtitle={`${users.length} accounts`} />
        <CardBody className="pt-0">
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.015, 0.2) }}
                    className="border-t border-slate-100 hover:bg-slate-50/60"
                  >
                    <td className="p-3 font-medium text-slate-900">{u.fullName}</td>
                    <td className="p-3 text-slate-600">{u.email}</td>
                    <td className="p-3">
                      <Badge variant="default" className="capitalize">
                        {u.role?.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={u.isActive ? 'success' : 'danger'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <Button type="button" variant="secondary" className="!px-3 !py-1.5 text-xs" onClick={() => toggle(u)}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <Card className="border-brand-100 bg-gradient-to-r from-brand-50/80 to-white">
        <CardBody className="flex gap-3 items-start">
          <Shield className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-700">
            Role changes and sensitive actions should be paired with audit logging in production. The API exposes additional admin routes for approvals and analytics.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
