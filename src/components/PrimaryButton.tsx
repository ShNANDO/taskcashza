import React from 'react';
import { motion } from 'motion/react';
import Loading from './Loading';

interface PrimaryButtonProps {
  id: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function PrimaryButton({
  id,
  onClick,
  children,
  disabled = false,
  loading = false,
  icon,
  className = '',
  type = 'button',
}: PrimaryButtonProps) {
  return (
    <motion.button
      id={id}
      type={type}
      disabled={disabled || loading}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        w-full flex items-center justify-center gap-2 px-5 py-3.5 
        text-sm font-medium tracking-wide text-white rounded-2xl
        transition-all duration-200 cursor-pointer
        ${
          disabled || loading
            ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed opacity-75'
            : 'bg-emerald-500 hover:bg-emerald-600 shadow-md hover:shadow-emerald-100 shadow-emerald-500/10'
        }
        ${className}
      `}
    >
      {loading ? (
        <Loading size="sm" className="p-0!" />
      ) : (
        <>
          {icon && <span id={`${id}_icon`}>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
