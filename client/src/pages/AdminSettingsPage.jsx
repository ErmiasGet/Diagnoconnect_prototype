import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Settings, Server, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  const [s, setS] = useState(null);

  useEffect(() => {
    api.get('/admin/settings').then((r) => setS(r.data));
  }, []);

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Control plane"
        title="System settings"
        description="Environment flags and integration endpoints. Extend this panel as your deployment matures."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader icon={Server} title="Runtime configuration" subtitle="Read from secure environment in production" />
          <CardBody>
            {s ? (
              <pre className="rounded-xl border border-slate-100 bg-slate-900 text-slate-100 p-4 text-xs overflow-auto max-h-80">
                {JSON.stringify(s, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-slate-500">Loading…</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardHeader icon={Mail} title="Notifications" subtitle="Email & SMS providers" />
          <CardBody className="text-sm text-slate-600 space-y-2">
            <p>Configure SMTP variables on the server to enable real email delivery.</p>
            <p className="text-xs text-slate-500">SMS remains in stub mode until a gateway is connected.</p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody className="flex gap-3 items-start">
          <Settings className="h-5 w-5 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900">Audit trail</p>
            <p className="text-sm text-slate-600 mt-1">
              Demo endpoint: <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">GET /api/admin/audit</code>. Persist structured logs for compliance in production.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
