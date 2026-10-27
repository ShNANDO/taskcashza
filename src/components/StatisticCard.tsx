import React from 'react';
import { motion } from 'motion/react';

interface StatisticCardProps {
  id: string;
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  trend?: string;
  className?: string;
}

export default function StatisticCard({
  id,
  label,
  value,
  subValue,
  icon,
  trend,
  className = '',
}: StatisticCardProps) {
  return (
    <motion.div
      id={id}
      whileHover={{ y: -2 }}
      className={`
        bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md
        transition-all duration-200 flex flex-col justify-between min-h-[120px] ${className}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-zinc-400 uppercase select-none">
          {label}
        </span>
        <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-300">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <span className="text-xl font-bold text-slate-800 dark:text-white tracking-tight block">
          {value}
        </span>
        {subValue && (
          <span className="text-xs font-medium text-slate-400 dark:text-zinc-400 block mt-0.5">
            {subValue}
          </span>
        )}
        {trend && (
          <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 mt-1.5">
            {trend}
          </span>
        )}
      </div>
    </motion.div>
  );
}
