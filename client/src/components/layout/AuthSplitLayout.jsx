import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';

export default function AuthSplitLayout({ title, subtitle, children, sideImage, sideCaption }) {
  const img =
    sideImage ||
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface">
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #14B8A6 0%, transparent 50%), radial-gradient(circle at 75% 50%, #2563EB 0%, transparent 50%)' }} />
        <div className="relative flex flex-col justify-between h-full p-12">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/10">
                <HeartPulse className="h-5 w-5" />
              </span>
              DiagnoConnect
            </div>
          </div>
          <div className="max-w-lg">
            <p className="text-2xl font-bold leading-relaxed text-white">
              {sideCaption ||
                'Get the right diagnosis at the right time. Fast digital healthcare coordination for Ethiopia.'}
            </p>
            <div className="mt-6 flex gap-3">
              {['Secure', 'Fast', 'Connected'].map((tag) => (
                <span key={tag} className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center px-4 py-10 sm:px-8 bg-surface">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors lg:hidden mb-8">
            <HeartPulse className="h-4 w-4 text-brand-600" />
            DiagnoConnect
          </Link>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
