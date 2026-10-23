import { motion } from 'framer-motion';

export default function MiniBarChart({ rows, valueKey = 'count', labelKey = '_id' }) {
  if (!rows?.length) return <p className="text-sm text-slate-500">No data yet.</p>;
  const max = Math.max(...rows.map((r) => r[valueKey] || 0), 1);
  const barMax = 120;
  return (
    <div className="flex h-40 items-end gap-2">
      {rows.map((r, i) => {
        const raw = r[valueKey] || 0;
        const px = Math.max(10, (raw / max) * barMax);
        return (
          <div key={String(r[labelKey]) + i} className="flex flex-1 flex-col items-center justify-end gap-2">
            <motion.div
              className="w-full max-w-[44px] rounded-t-lg bg-gradient-to-t from-brand-600 to-care-500 shadow-md mx-auto"
              initial={{ height: 0 }}
              animate={{ height: px }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              title={`${r[labelKey]}: ${raw}`}
            />
            <span className="text-[10px] font-medium text-slate-500 text-center leading-tight line-clamp-2 w-full">
              {String(r[labelKey])}
            </span>
          </div>
        );
      })}
    </div>
  );
}
