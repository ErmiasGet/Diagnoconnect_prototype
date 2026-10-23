import { motion } from 'framer-motion';

export function Card({ children, className = '', hover = true, glass = false, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-soft ${hover ? 'transition-all duration-200 hover:shadow-glow' : ''} ${glass ? 'bg-white/70 backdrop-blur-xl border-white/40' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-6 pt-6 pb-2">
      <div className="flex gap-3">
        {Icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-care-50 text-brand-600 shadow-sm">
            <Icon className="h-5 w-5" strokeWidth={2} />
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 pb-6 ${className}`}>{children}</div>;
}
