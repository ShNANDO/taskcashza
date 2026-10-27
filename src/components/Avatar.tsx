import React from 'react';

interface AvatarProps {
  id: string;
  name: string;
  avatarUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  verified?: boolean;
  className?: string;
}

export default function Avatar({
  id,
  name,
  avatarUrl,
  size = 'md',
  verified = false,
  className = '',
}: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const badgeSizeClasses = {
    sm: 'w-2.5 h-2.5 bottom-0 right-0 border',
    md: 'w-3.5 h-3.5 bottom-0 right-0 border-2',
    lg: 'w-4 h-4 bottom-0.5 right-0.5 border-2',
    xl: 'w-6 h-6 bottom-1 right-1 border-2',
  };

  const getInitials = (userName: string) => {
    return userName
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div id={`${id}_container`} className={`relative inline-block ${className}`}>
      {avatarUrl ? (
        <img
          id={id}
          src={avatarUrl}
          alt={name}
          referrerPolicy="no-referrer"
          className={`rounded-full object-cover border-2 border-white shadow-sm ${sizeClasses[size]}`}
        />
      ) : (
        <div
          id={id}
          className={`
            rounded-full border-2 border-white shadow-sm font-bold bg-gradient-to-tr from-emerald-50 to-emerald-100 text-emerald-600
            flex items-center justify-center ${sizeClasses[size]}
          `}
        >
          {getInitials(name)}
        </div>
      )}

      {verified && (
        <span
          id={`${id}_verified_badge`}
          className={`
            absolute bg-emerald-500 text-white rounded-full flex items-center justify-center border-white font-extrabold text-[7px]
            ${badgeSizeClasses[size]}
          `}
          title="Verified Profile"
        >
          ✓
        </span>
      )}
    </div>
  );
}
