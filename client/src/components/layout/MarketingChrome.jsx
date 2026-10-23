import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Menu, X, HeartPulse } from 'lucide-react';
import { useState } from 'react';

export function MarketingHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/#features', label: 'Features' },
    { to: '/#how', label: 'How it works' },
    { to: '/#stats', label: 'Impact' },
    { to: '/#roles', label: 'Who we serve' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-slate-900 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-care-500 text-white shadow-md shadow-brand-600/20 group-hover:shadow-lg group-hover:shadow-brand-600/30 transition-shadow">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">
            Diagno<span className="text-brand-600">Connect</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {links.map((l) => (
            <a key={l.to} href={l.to} className="hover:text-brand-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-500 after:transition-all hover:after:w-full">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30 hover:from-brand-700 hover:to-brand-600 transition-all"
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="md:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-lg px-4 py-4 space-y-3"
        >
          {links.map((l) => (
            <a key={l.to} href={l.to} className="block text-slate-700 font-medium hover:text-brand-600" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <Link to="/login" className="block rounded-xl border border-slate-200 py-2 text-center font-semibold hover:bg-slate-50" onClick={() => setOpen(false)}>
            Sign in
          </Link>
          <Link
            to="/register"
            className="block rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-2 text-center font-semibold text-white shadow-md"
            onClick={() => setOpen(false)}
          >
            Get started
          </Link>
        </motion.div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200/80 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-white text-lg">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-care-500">
                <HeartPulse className="h-4 w-4" />
              </span>
              DiagnoConnect
            </div>
            <p className="mt-3 text-sm text-slate-400 max-w-md leading-relaxed">
              Coordinating diagnostics across Ethiopia — referrals, appointments, and care teams in one place. Modern healthcare, built for better access.
            </p>
          </div>
          <div className="text-right md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Platform</p>
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-slate-400">Referrals</p>
              <p className="text-slate-400">Appointments</p>
              <p className="text-slate-400">Ambulance</p>
              <p className="text-slate-400">Analytics</p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-600 flex flex-col sm:flex-row justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} DiagnoConnect. Built for better healthcare access.</span>
          <span className="text-slate-600">Ethiopia</span>
        </div>
      </div>
    </footer>
  );
}
