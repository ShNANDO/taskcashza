import React from 'react';
import { Clapperboard, Wallet, User, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

export type TabId = 'surveys' | 'withdrawal' | 'profile' | 'help';

interface BottomNavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  dailyCount: number;
}

export default function BottomNavigation({ activeTab, onTabChange, dailyCount }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'surveys' as TabId,
      label: 'Tasks',
      icon: Clapperboard,
      badge: dailyCount > 0 ? dailyCount : undefined,
    },
    {
      id: 'withdrawal' as TabId,
      label: 'Finance',
      icon: Wallet,
    },
    {
      id: 'profile' as TabId,
      label: 'Profile',
      icon: User,
    },
    {
      id: 'help' as TabId,
      label: 'Faq',
      icon: HelpCircle,
    },
  ];

  return (
    <div
      id="bottom_nav_container"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md select-none pointer-events-none"
    >
      <div
        id="bottom_nav_bar"
        className="
          pointer-events-auto bg-zinc-950/95 backdrop-blur-xl rounded-2xl shadow-2xl
          border border-zinc-800 flex justify-between items-center px-3 py-2.5
        "
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab_btn_${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="
                relative flex flex-col items-center justify-center flex-1 py-1 cursor-pointer
                transition-all duration-200 outline-none
              "
            >
              <div
                id={`tab_icon_wrapper_${tab.id}`}
                className={`
                  relative w-11 h-8 rounded-xl flex items-center justify-center mb-0.5
                  transition-colors duration-200
                  ${isActive ? 'bg-red-600/15 text-red-500' : 'text-zinc-500 hover:text-zinc-300'}
                `}
              >
                <IconComponent size={19} className="stroke-[2.2]" />

                {tab.badge !== undefined && (
                  <span
                    id={`tab_badge_${tab.id}`}
                    className="absolute -top-1 -right-1 min-w-4 h-4 bg-red-600 rounded-full text-[8px] font-black text-white flex items-center justify-center px-1 border border-zinc-950 animate-pulse"
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                id={`tab_label_${tab.id}`}
                className={`
                  text-[9px] font-extrabold tracking-wider
                  ${isActive ? 'text-red-500' : 'text-zinc-500'}
                `}
              >
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  id={`tab_indicator_${tab.id}`}
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-2px] w-1.5 h-1.5 bg-red-600 rounded-full"
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
