import { motion } from 'motion/react';

interface StatusBadgeProps {
  status: string;
  type?: 'success' | 'warning' | 'info' | 'error' | 'default' | 'accent';
  className?: string;
}

export default function StatusBadge({ status, type = 'default', className = '' }: StatusBadgeProps) {
  const styles = {
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/30',
    warning: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/25 dark:text-amber-400 dark:border-amber-900/30',
    info: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/25 dark:text-blue-400 dark:border-blue-900/30',
    error: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/25 dark:text-rose-400 dark:border-rose-900/30',
    accent: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/25 dark:text-indigo-400 dark:border-indigo-900/30',
    default: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-900/50 dark:text-slate-400 dark:border-slate-800',
  };

  return (
    <span
      id={`badge_${status.toLowerCase().replace(/\s+/g, '_')}`}
      className={`
        inline-flex items-center px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase
        rounded-full border ${styles[type]} ${className}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75 shrink-0" />
      {status}
    </span>
  );
}
