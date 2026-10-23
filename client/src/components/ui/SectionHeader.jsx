import { motion } from 'framer-motion';

export function SectionHeader({ eyebrow, title, description, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6"
    >
      <div>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-brand-500 to-care-500 bg-clip-text text-transparent">{eyebrow}</p>
        )}
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900 text-balance">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-slate-600 text-sm sm:text-base">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </motion.div>
  );
}
