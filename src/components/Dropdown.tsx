import React from 'react';

interface DropdownOption {
  id: string;
  name: string;
}

interface DropdownProps {
  id: string;
  label?: string;
  options: DropdownOption[];
  error?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: any) => void;
  disabled?: boolean;
}

export default function Dropdown({
  id,
  label,
  options,
  error,
  placeholder = 'Select option',
  className = '',
  ...props
}: DropdownProps) {
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
          flex items-center w-full bg-slate-50 border rounded-2xl px-4 py-3
          transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-white
          ${error ? 'border-red-400 focus-within:border-red-500' : 'border-slate-100'}
        `}
      >
        <select
          id={id}
          className={`
            w-full bg-transparent text-sm font-medium text-slate-800 outline-none cursor-pointer
            appearance-none pr-8 bg-no-repeat bg-[right_10px_center]
            ${className}
          `}
          {...props}
        >
          <option value="" disabled className="text-slate-400">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.name} className="text-slate-800 font-medium">
              {opt.name}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <span id={`${id}_error_msg`} className="text-[11px] text-red-500 font-medium pl-1">
          {error}
        </span>
      )}
    </div>
  );
}
