import React from 'react';

interface InputProps {
  id: string;
  label?: string;
  error?: string;
  prefixText?: string;
  suffixText?: string;
  className?: string;
  placeholder?: string;
  type?: string;
  value?: any;
  onChange?: (e: any) => void;
  maxLength?: number;
  inputMode?: any;
  disabled?: boolean;
}

export default function Input({
  id,
  label,
  error,
  prefixText,
  suffixText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div id={`${id}_wrapper`} className="w-full flex flex-col gap-1.5 mb-4">
      {label && (
        <label id={`${id}_label`} htmlFor={id} className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          {label}
        </label>
      )}
      <div
        id={`${id}_container`}
        className={`
          flex items-center w-full bg-slate-50 border rounded-2xl px-4 py-3.5
          transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-white
          dark:bg-slate-900/65 dark:border-slate-800/80 dark:focus-within:bg-slate-900/90 dark:focus-within:border-emerald-500
          ${error ? 'border-red-400 focus-within:border-red-500' : 'border-slate-100 dark:border-slate-800/60'}
        `}
      >
        {prefixText && (
          <span id={`${id}_prefix`} className="text-slate-400 font-medium mr-2 select-none text-sm dark:text-slate-500">
            {prefixText}
          </span>
        )}
        <input
          id={id}
          className={`w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500 ${className}`}
          {...props}
        />
        {suffixText && (
          <span id={`${id}_suffix`} className="text-slate-400 font-semibold ml-2 select-none text-sm">
            {suffixText}
          </span>
        )}
      </div>
      {error && (
        <span id={`${id}_error_msg`} className="text-[11px] text-red-500 font-medium pl-1">
          {error}
        </span>
      )}
    </div>
  );
}
