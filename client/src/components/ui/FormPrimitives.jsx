import { motion } from 'framer-motion';

const field =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition hover:border-slate-300';

export function FieldLabel({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700">
      {children}
    </label>
  );
}

export function TextInput({ className = '', ...props }) {
  return <input className={`${field} ${className}`} {...props} />;
}

export function SelectInput({ className = '', ...props }) {
  return <select className={`${field} ${className}`} {...props} />;
}

export function TextArea({ className = '', ...props }) {
  return <textarea className={`${field} min-h-[100px] resize-y ${className}`} {...props} />;
}

export function FormGrid({ children }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

export function MotionReveal({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
