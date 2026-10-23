import { motion } from 'framer-motion';

export function StatCard({ icon: Icon, label, value, hint, delay = 0, gradient = 'brand' }) {
  const gradMap = {
    brand: 'from-brand-500 to-care-500',
    care: 'from-care-500 to-accent-500',
    teal: 'from-teal-500 to-emerald-500',
    blue: 'from-blue-600 to-brand-500',
  };
  const grad = gradMap[gradient] || gradMap.brand;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-soft transition-all duration-200 hover:shadow-glow"
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500/10 to-care-500/10 blur-2xl" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">{value}</p>
          {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white shadow-md`}>
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
