import React from 'react';
import { Bell, LogOut, Clapperboard, Flame } from 'lucide-react';

interface HeaderProps {
  name: string;
  streak: number;
  notificationCount: number;
  onNotificationsClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
  theme?: 'light' | 'dark';
}

export default function Header({
  name,
  streak,
  notificationCount,
  onNotificationsClick,
  onLogoutClick,
  className = '',
}: HeaderProps) {
  return (
    <header
      id="app_header"
      className={`flex items-center justify-between px-4 py-3.5 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-800/80 transition-colors duration-300 ${className}`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest">
          <Clapperboard size={12} className="text-red-500" />
          <span>Screening Guild · VIP Critic</span>
        </div>
        <h1 className="text-base sm:text-lg font-bold font-display text-white tracking-tight flex items-center gap-1.5 mt-0.5">
          Hi, {name} <span className="text-amber-400">🍿</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Streak indicator badge */}
        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-400 text-xs font-bold">
          <Flame size={13} className="text-amber-400 fill-amber-400" />
          <span>{streak}d streak</span>
        </div>

        {/* Notifications toggle button */}
        <button
          id="btn_header_notifications"
          onClick={onNotificationsClick}
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Bell size={16} />
          {notificationCount > 0 && (
            <span
              id="notification_badge"
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 border-2 border-zinc-950 rounded-full flex items-center justify-center text-[9px] font-black text-white"
            >
              {notificationCount}
            </span>
          )}
        </button>

        {/* Logout button */}
        <button
          id="btn_header_logout"
          onClick={onLogoutClick}
          aria-label="Log out"
          className="w-9 h-9 rounded-full border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
