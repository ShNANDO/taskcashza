import { motion } from 'motion/react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export default function Loading({ size = 'md', label, className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div id="loading_container" className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <motion.div
        id="loading_spinner"
        className={`${sizeClasses[size]} border-t-emerald-500 border-r-emerald-500 border-b-emerald-100 border-l-emerald-100 rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      />
      {label && (
        <span id="loading_label" className="mt-2 text-xs font-mono text-slate-500 tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
}
