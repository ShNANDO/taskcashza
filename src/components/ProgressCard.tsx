import { motion } from 'motion/react';
import StatusBadge from './StatusBadge';

interface ProgressCardProps {
  id: string;
  title: string;
  percentage: number;
  badgeText?: string;
  badgeType?: 'success' | 'warning' | 'info' | 'error' | 'default' | 'accent';
  color?: string;
  className?: string;
}

export default function ProgressCard({
  id,
  title,
  percentage,
  badgeText,
  badgeType = 'warning',
  color = 'bg-amber-500', // Default orange
  className = '',
}: ProgressCardProps) {
  return (
    <div
      id={id}
      className={`bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          {title}
        </span>
        {badgeText && <StatusBadge status={badgeText} type={badgeType} />}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-black text-white tracking-tight">
          {percentage.toFixed(2)}%
        </span>
      </div>

      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
        <motion.div
          id={`${id}_bar`}
          className={`h-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
