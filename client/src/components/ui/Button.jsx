import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/30',
  secondary: 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md',
  success: 'bg-gradient-to-r from-emerald-600 to-care-500 text-white hover:from-emerald-700 hover:to-care-600 shadow-lg shadow-emerald-600/25',
};

export function Button({ children, variant = 'primary', className = '', loading, disabled, ...rest }) {
  const v = variants[variant] || variants.primary;
  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none ${v} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
      )}
      {children}
    </motion.button>
  );
}
