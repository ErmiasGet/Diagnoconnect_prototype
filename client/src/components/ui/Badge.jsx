const styles = {
  default: 'bg-slate-100 text-slate-700 border border-slate-200',
  success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  warning: 'bg-amber-50 text-amber-900 border border-amber-200',
  danger: 'bg-red-50 text-red-800 border border-red-200',
  info: 'bg-gradient-to-r from-brand-50 to-care-50 text-brand-800 border border-brand-200',
  muted: 'bg-slate-50 text-slate-500 border border-slate-100',
};

export function Badge({ children, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[variant] || styles.default} ${className}`}
    >
      {children}
    </span>
  );
}

export function statusVariant(status) {
  const s = String(status || '').toLowerCase();
  if (['confirmed', 'completed', 'approved', 'active'].includes(s)) return 'success';
  if (['pending', 'requested', 'submitted', 'assigned'].includes(s)) return 'warning';
  if (['cancelled', 'rejected', 'inactive'].includes(s)) return 'danger';
  if (['in_progress', 'in_transit', 'rescheduled'].includes(s)) return 'info';
  return 'default';
}
