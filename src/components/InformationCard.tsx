import React from 'react';
import { motion } from 'motion/react';

interface InformationCardProps {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'primary';
  className?: string;
  actionButton?: React.ReactNode;
}

export default function InformationCard({
  id,
  title,
  description,
  icon,
  type = 'info',
  className = '',
  actionButton,
}: InformationCardProps) {
  const styles = {
    info: {
      bg: 'bg-zinc-900/90 border-zinc-800',
      text: 'text-zinc-300',
      title: 'text-red-400 font-extrabold',
      desc: 'text-zinc-400',
      iconBg: 'bg-red-950/60 border border-red-900/40 text-red-400',
    },
    success: {
      bg: 'bg-zinc-900/90 border-zinc-800',
      text: 'text-zinc-300',
      title: 'text-emerald-400 font-extrabold',
      desc: 'text-zinc-400',
      iconBg: 'bg-emerald-950/60 border border-emerald-900/40 text-emerald-400',
    },
    warning: {
      bg: 'bg-amber-950/20 border-amber-900/40',
      text: 'text-amber-200',
      title: 'text-amber-300 font-extrabold',
      desc: 'text-amber-300/80',
      iconBg: 'bg-amber-950/60 border border-amber-900/40 text-amber-400',
    },
    primary: {
      bg: 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/20',
      text: 'text-white',
      title: 'text-white font-black',
      desc: 'text-red-100',
      iconBg: 'bg-red-700 text-white',
    },
  };

  const currentStyle = styles[type];

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        border rounded-3xl p-5 flex gap-4 transition-all duration-200 ${currentStyle.bg} ${className}
      `}
    >
      {icon && (
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${currentStyle.iconBg}`}>
          {icon}
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center">
        <h4 className={`text-xs font-bold tracking-wider uppercase ${currentStyle.title}`}>
          {title}
        </h4>
        <p className={`text-xs font-normal mt-1 leading-relaxed ${currentStyle.desc}`}>
          {description}
        </p>
        {actionButton && <div className="mt-3">{actionButton}</div>}
      </div>
    </motion.div>
  );
}
