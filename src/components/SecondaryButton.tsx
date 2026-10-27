import React from 'react';
import { motion } from 'motion/react';

interface SecondaryButtonProps {
  id: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function SecondaryButton({
  id,
  onClick,
  children,
  disabled = false,
  icon,
  className = '',
  type = 'button',
}: SecondaryButtonProps) {
  return (
    <motion.button
      id={id}
      type={type}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        w-full flex items-center justify-center gap-2 px-5 py-3.5 
        text-sm font-medium tracking-wide rounded-2xl border border-slate-200
        bg-white text-slate-700 hover:bg-slate-50 transition-all duration-200 cursor-pointer
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {icon && <span id={`${id}_icon`}>{icon}</span>}
      {children}
    </motion.button>
  );
}
