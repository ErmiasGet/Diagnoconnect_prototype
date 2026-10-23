import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarCheck,
  HeartPulse,
  Building2,
  ShieldCheck,
  Sparkles,
  Ambulance,
  Stethoscope,
  Microscope,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { MarketingFooter, MarketingHeader } from '../components/layout/MarketingChrome.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const features = [
  {
    title: 'Online Booking',
    desc: 'Schedule diagnostic appointments at approved centers with live availability and instant confirmation.',
    icon: CalendarCheck,
  },
  {
    title: 'Digital Referral',
    desc: 'Send structured referrals from hospitals to labs and imaging centers with full traceability.',
    icon: Stethoscope,
  },
  {
    title: 'Ambulance Coordination',
    desc: 'Request and track emergency transport with real-time status updates for all parties.',
    icon: Ambulance,
  },
  {
    title: 'Real-Time Tracking',
    desc: 'Follow appointments, referrals, and transport from request to completion with live notifications.',
    icon: Clock,
  },
  {
    title: 'Diagnostic Recommendations',
    desc: 'Smart center matching based on diagnosis type, location, and service availability.',
    icon: Microscope,
  },
  {
    title: 'Secure & Compliant',
    desc: 'Role-based access, encrypted data, and audit-friendly workflows built for healthcare.',
    icon: ShieldCheck,
  },
];

const stats = [
  { label: 'Hospitals Connected', value: '50+', icon: Building2 },
  { label: 'Patients Served', value: '10,000+', icon: Users },
  { label: 'Diagnostic Centers', value: '120+', icon: Microscope },
  { label: 'Successful Referrals', value: '25,000+', icon: BarChart3 },
];

const steps = [
  { num: '01', title: 'Assess & Refer', desc: 'Doctors capture the clinical picture and send a structured referral to diagnostic centers.' },
  { num: '02', title: 'Book & Route', desc: 'Patients schedule diagnostics; ambulance transport can be requested when needed.' },
  { num: '03', title: 'Results & Follow-up', desc: 'Centers update status and results flow back to the care team with instant notifications.' },
];

const heroImage =
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1400&q=80';

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* ───── Hero ───── */}
        <section className="relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-white via-brand-50/30 to-surface">
          <div className="pointer-events-none absolute inset-0 bg-grid-slate bg-[length:32px_32px] opacity-30" />
          <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-gradient-to-br from-care-500/20 to-accent-500/20 blur-3xl animate-float" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <motion.div custom={0} initial="hidden" animate="show" variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-care-500" />
                Healthcare coordination for Ethiopia
              </motion.div>
              <motion.h1
                custom={1}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 text-balance leading-[1.1]"
              >
                Get the Right<br />
                <span className="bg-gradient-to-r from-brand-600 to-care-500 bg-clip-text text-transparent">Diagnosis</span><br />
                at the Right Time
              </motion.h1>
              <motion.p
                custom={2}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="mt-5 text-lg text-slate-600 max-w-xl leading-relaxed"
              >
                Fast digital healthcare coordination connecting patients, doctors, hospitals, diagnostic centers, and ambulance teams across Ethiopia.
              </motion.p>
              <motion.div custom={3} initial="hidden" animate="show" variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition-all hover:shadow-xl hover:shadow-brand-600/40 hover:from-brand-700 hover:to-brand-600 active:scale-[0.98]"
                >
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-white hover:border-slate-300 transition-all"
                >
                  Sign in
                </Link>
              </motion.div>
              <motion.div
                custom={4}
                initial="hidden"
                animate="show"
                variants={fadeUp}
                className="mt-10 flex flex-wrap gap-3"
              >
                {[
                  ['24/7', 'Platform access'],
                  ['RBAC', 'Secure roles'],
                  ['SMS/Email', 'Smart alerts'],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-slate-200/80 bg-white/60 backdrop-blur-sm px-4 py-2.5 shadow-sm">
                    <span className="text-lg font-bold bg-gradient-to-r from-brand-600 to-care-500 bg-clip-text text-transparent">{k}</span>
                    <span className="text-xs text-slate-500 ml-2">{v}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.94, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-tr from-brand-500/20 via-care-500/20 to-transparent blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white shadow-glow">
                <img src={heroImage} alt="Healthcare professionals collaborating" className="h-full w-full object-cover min-h-[280px] sm:min-h-[360px]" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-care-500 to-emerald-500 text-white shadow-md">
                      <Ambulance className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900">Ambulance ready</div>
                      <div className="text-xs text-slate-500">Coordinate transport in one tap</div>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ───── Stats ───── */}
        <section id="stats" className="relative -mt-8 z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft text-center hover:shadow-glow transition-shadow"
              >
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-care-50 text-brand-600 shadow-sm">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── Features ───── */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-brand-500 to-care-500 bg-clip-text text-transparent">Platform</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">Everything your care network needs</h2>
            <p className="mt-3 text-slate-600 text-lg">
              Modern workflows for referrals, appointments, diagnostics, and reporting — tuned for real hospitals and patients.
            </p>
          </motion.div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-glow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-care-500 text-white shadow-md transition-all group-hover:shadow-lg group-hover:scale-105">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900 text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 className="h-5 w-5 text-care-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── How it works ───── */}
        <section id="how" className="border-y border-slate-200/60 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-brand-500 to-care-500 bg-clip-text text-transparent">Workflow</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">How DiagnoConnect works</h2>
              <p className="mt-3 text-slate-600">Three simple steps from referral to results.</p>
            </motion.div>
            <div className="mt-12 grid gap-8 md:grid-cols-3 relative">
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-brand-200 via-care-200 to-accent-200" />
              {steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-care-500 text-white text-xl font-bold shadow-lg shadow-brand-500/20 relative z-10">
                    {s.num}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 max-w-xs mx-auto">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ───── Roles ───── */}
        <section id="roles" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Built for every role</h2>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              Tailored dashboards for patients, clinicians, diagnostic centers, hospitals, ambulance partners, and administrators.
            </p>
          </motion.div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              { label: 'Patients', icon: Users, color: 'from-brand-500 to-blue-500' },
              { label: 'Doctors', icon: Stethoscope, color: 'from-care-500 to-teal-500' },
              { label: 'Hospitals', icon: Building2, color: 'from-accent-500 to-cyan-500' },
              { label: 'Diagnostic Centers', icon: Microscope, color: 'from-purple-500 to-violet-500' },
              { label: 'Ambulance', icon: Ambulance, color: 'from-amber-500 to-orange-500' },
              { label: 'Admin', icon: ShieldCheck, color: 'from-slate-700 to-slate-900' },
            ].map((r) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-4 py-3 shadow-soft hover:shadow-glow transition-all"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${r.color} text-white shadow-sm`}>
                  <r.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">{r.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ───── CTA ───── */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-care-600 shadow-2xl"
          >
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 50%, white 0%, transparent 50%)' }} />
            <div className="relative px-8 py-14 sm:px-14 text-center">
              <h3 className="text-3xl sm:text-4xl font-bold text-white">Ready to modernize diagnostics?</h3>
              <p className="mt-4 text-brand-100 max-w-xl mx-auto text-lg">
                Create your account in minutes. Institutions can register for admin review before going live.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow-lg hover:bg-brand-50 hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}