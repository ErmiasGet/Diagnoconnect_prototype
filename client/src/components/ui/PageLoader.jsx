import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-5 text-slate-600">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-care-500 shadow-lg shadow-brand-500/25">
          <Activity className="h-7 w-7 text-white" />
        </div>
        <motion.span
          className="absolute -inset-2 rounded-[1.75rem] border-2 border-transparent border-t-brand-400"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        />
      </div>
      <p className="text-sm font-semibold tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
