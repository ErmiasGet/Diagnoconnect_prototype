import { useState } from 'react';
import api from '../services/api.js';
import { SectionHeader } from '../components/ui/SectionHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { motion } from 'framer-motion';
import { CreditCard, Crown, CheckCircle2, Zap, Star, Sparkles, Shield } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '0',
    period: 'Free',
    icon: Star,
    color: 'from-slate-500 to-slate-600',
    features: ['Up to 3 appointments/month', 'Basic reporting', 'Email support', 'Standard tracking'],
    popular: false,
  },
  {
    name: 'Pro',
    price: '299',
    period: '/month',
    icon: Zap,
    color: 'from-brand-500 to-care-500',
    features: ['Unlimited appointments', 'Priority scheduling', 'Advanced reports', 'Priority support', 'Ambulance tracking'],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '999',
    period: '/month',
    icon: Crown,
    color: 'from-purple-500 to-amber-500',
    features: ['Everything in Pro', 'Family accounts (up to 5)', 'Dedicated care coordinator', '24/7 phone support', 'Home sample collection'],
    popular: false,
  },
];

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const [loading, setLoading] = useState(false);

  const subscribe = async (planName) => {
    setLoading(true);
    try {
      await api.post('/payments', { amount: planName === 'Pro' ? 299 : planName === 'Enterprise' ? 999 : 0, paymentMethod: 'telebirr', description: `${planName} subscription` });
      setCurrentPlan(planName);
    } catch {
      // handled silently
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Subscription"
        title="Choose Your Plan"
        description="Select a subscription plan that works best for your healthcare needs."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan, i) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.name;
          return (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className={`relative h-full flex flex-col ${plan.popular ? 'ring-2 ring-brand-500 shadow-glow' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-care-500 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-md">
                      <Sparkles className="h-3 w-3" /> Popular
                    </span>
                  </div>
                )}
                <CardBody className="flex flex-col h-full">
                  <div className="text-center mb-4">
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.color} text-white shadow-md`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900">{plan.name}</h3>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-slate-900">{plan.price} ETB</span>
                      <span className="text-sm text-slate-500">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isCurrent ? (
                    <Badge variant="success" className="w-full text-center py-2.5 text-sm justify-center">Current Plan</Badge>
                  ) : (
                    <Button type="button" onClick={() => subscribe(plan.name)} loading={loading}
                      variant={plan.popular ? 'primary' : 'secondary'} className="w-full">
                      {plan.price === '0' ? 'Get Started' : `Subscribe`}
                    </Button>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card>
        <CardHeader icon={Shield} title="Current Plan" subtitle="Your active subscription details" />
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-care-50 text-brand-600">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{currentPlan} Plan</p>
                <p className="text-sm text-slate-500">Access to all {currentPlan.toLowerCase()} features</p>
              </div>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
