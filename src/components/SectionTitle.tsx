import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  badge?: string | number;
  className?: string;
}

export default function SectionTitle({ children, badge, className = '' }: SectionTitleProps) {
  return (
    <div id="section_title_container" className={`flex items-center justify-between mb-4 mt-6 ${className}`}>
      <h2 className="text-sm font-bold font-display text-slate-800 dark:text-zinc-100 tracking-tight">
        {children}
      </h2>
      {badge !== undefined && (
        <span
          id="section_title_badge"
          className="text-[10px] font-bold bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 dark:border dark:border-red-800/40 px-2 py-0.5 rounded-full"
        >
          {badge}
        </span>
      )}
    </div>
  );
}
