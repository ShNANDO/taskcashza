import { useState } from 'react';
import { motion } from 'motion/react';
import {
  User, Mail, Globe, Calendar, Award, CheckCircle2, ListFilter,
  CheckCircle, Ban, TrendingUp, DollarSign, Wallet, ShieldCheck,
  Bell, Moon, RotateCcw, LogOut, ChevronRight
} from 'lucide-react';
import { UserProfile, PlatformStats } from '../types';
import Avatar from '../components/Avatar';
import StatisticCard from '../components/StatisticCard';
import SectionTitle from '../components/SectionTitle';

interface ProfileScreenProps {
  user: UserProfile;
  stats: PlatformStats;
  onLogout: () => void;
  onResetData: () => void;
  onTabChange: (tab: 'surveys' | 'withdrawal' | 'profile' | 'help') => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export default function ProfileScreen({
  user,
  stats,
  onLogout,
  onResetData,
  onTabChange,
  addToast,
  theme = 'light',
  onToggleTheme,
}: ProfileScreenProps) {
  // Settings toggle states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);

  const handleToggleNotifications = () => {
    setPushNotifications((prev) => !prev);
    addToast(
      `Push Notifications ${!pushNotifications ? 'enabled' : 'disabled'}.`,
      'info'
    );
  };

  const handleToggleEmailDigest = () => {
    setEmailDigest((prev) => !prev);
    addToast(
      `Email alerts ${!emailDigest ? 'enabled' : 'disabled'}.`,
      'info'
    );
  };

  const isDark = theme === 'dark';

  const handleToggleTheme = () => {
    if (onToggleTheme) {
      onToggleTheme();
      addToast(
        `${isDark ? 'Light theme' : 'Dark theme'} applied successfully!`,
        'success'
      );
    }
  };

  return (
    <div id="profile_screen_scroll_area" className="flex-1 overflow-y-auto px-4 pb-32 pt-2">
      {/* Profile Header Box */}
      <div id="profile_hero_card" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center dark:bg-slate-900 dark:border-slate-800">
        <Avatar
          id="profile_avatar"
          name={user.name}
          avatarUrl={user.avatarUrl}
          size="xl"
          verified={user.verificationStatus === 'Verified'}
          className="mb-4"
        />

        <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-1.5 dark:text-slate-100">
          {user.name}
          {user.verificationStatus === 'Verified' && (
            <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-50 dark:fill-emerald-950/20" />
          )}
        </h3>

        <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase block mt-1">
          {user.email}
        </span>

        {/* Badges row */}
        <div className="flex gap-2.5 mt-4 flex-wrap justify-center">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-400 uppercase">
            <Globe size={11} />
            {user.country}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-950/40 border border-red-900/40 rounded-full text-[10px] font-bold text-red-400 uppercase">
            <ShieldCheck size={11} />
            Verified Critic
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-950/40 border border-amber-900/40 rounded-full text-[10px] font-bold text-amber-400 uppercase">
            <Award size={11} />
            VIP Critic Tier {user.currentLevel}
          </span>
        </div>

        <span className="text-[9px] font-medium text-zinc-400 mt-4 block">
          Critic Guild Member Since {user.memberSince}
        </span>
      </div>

      {/* Bento Platform Statistics Grid */}
      <SectionTitle>Critic Guild Statistics</SectionTitle>

      <div id="stats_bento_grid" className="grid grid-cols-2 gap-4">
        <StatisticCard
          id="stat_completed"
          label="Screenings"
          value={stats.completedSurveysCount}
          subValue="Films Reviewed"
          icon={<CheckCircle size={15} className="text-red-500" />}
          className="dark:bg-slate-900 dark:border-slate-800 text-left"
        />
        <StatisticCard
          id="stat_approved"
          label="Approved"
          value={stats.approvedSurveysCount}
          subValue="Verified Reviews"
          icon={<CheckCircle2 size={15} className="text-emerald-500" />}
          className="dark:bg-slate-900 dark:border-slate-800 text-left"
        />
        <StatisticCard
          id="stat_rejected"
          label="Flagged"
          value={stats.rejectedSurveysCount}
          subValue="Attention Penalties"
          icon={<Ban size={15} className="text-rose-500" />}
          className="dark:bg-slate-900 dark:border-slate-800 text-left"
        />
        <StatisticCard
          id="stat_balance"
          label="Box Office Balance"
          value={`R ${stats.currentBalanceNad.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`≈ $${stats.currentBalanceUsd.toFixed(2)} USD`}
          icon={<Wallet size={15} className="text-amber-500" />}
          className="dark:bg-slate-900 dark:border-slate-800 text-left"
        />
        <StatisticCard
          id="stat_lifetime"
          label="Lifetime Box Office Earnings"
          value={`R ${stats.lifetimeEarningsNad.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`≈ $${stats.lifetimeEarningsUsd.toFixed(2)} USD`}
          icon={<TrendingUp size={15} className="text-red-500" />}
          className="col-span-2 dark:bg-slate-900 dark:border-slate-800 text-left"
        />
      </div>

      {/* Preferences & Navigation Links Card */}
      <SectionTitle>Preferences & Security</SectionTitle>

      <div id="preferences_card" className="bg-white border border-slate-100 rounded-3xl p-2.5 shadow-xs flex flex-col gap-1 dark:bg-slate-900 dark:border-slate-800">
        {/* Nav To Withdrawal history */}
        <button
          id="btn_preference_history"
          onClick={() => onTabChange('withdrawal')}
          className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer text-left dark:hover:bg-slate-800/60"
        >
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <Wallet size={16} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Withdrawal History</span>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </button>

        {/* Push Notifications Toggle */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left dark:hover:bg-slate-800/60">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <Bell size={16} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Push Notifications</span>
          </div>
          <button
            id="toggle_push_notifications"
            onClick={handleToggleNotifications}
            className={`
              w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 focus:outline-none
              ${pushNotifications ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}
            `}
          >
            <div
              className={`
                bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200
                ${pushNotifications ? 'translate-x-4' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        {/* Email Digest alerts Toggle */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left dark:hover:bg-slate-800/60">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <Mail size={16} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Email Alerts</span>
          </div>
          <button
            id="toggle_email_digest"
            onClick={handleToggleEmailDigest}
            className={`
              w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 focus:outline-none
              ${emailDigest ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}
            `}
          >
            <div
              className={`
                bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200
                ${emailDigest ? 'translate-x-4' : 'translate-x-0'}
              `}
            />
          </button>
        </div>

        {/* Dark Mode toggle */}
        <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left dark:hover:bg-slate-800/60">
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <Moon size={16} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Dark Mode</span>
          </div>
          <button
            id="toggle_dark_mode"
            onClick={handleToggleTheme}
            className={`
              w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 focus:outline-none
              ${isDark ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}
            `}
          >
            <div
              className={`
                bg-white w-5 h-5 rounded-full shadow-sm transform transition-transform duration-200
                ${isDark ? 'translate-x-4' : 'translate-x-0'}
              `}
            />
          </button>
        </div>
      </div>

      {/* Account actions Card */}
      <SectionTitle>Account Actions</SectionTitle>

      <div id="actions_card" className="bg-white border border-slate-100 rounded-3xl p-2.5 shadow-xs flex flex-col gap-1 dark:bg-slate-900 dark:border-slate-800">
        {/* Reset Progress */}
        <button
          id="btn_reset_mock_data"
          onClick={() => {
            onResetData();
            addToast('Local state database has been reset.', 'success');
          }}
          className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer text-left dark:hover:bg-slate-800/60"
        >
          <div className="flex items-center gap-3 text-amber-500">
            <RotateCcw size={16} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Reset Demo Data</span>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </button>

        {/* Logout */}
        <button
          id="btn_profile_logout"
          onClick={onLogout}
          className="flex items-center justify-between p-4 hover:bg-rose-50 rounded-2xl transition-colors cursor-pointer text-left dark:hover:bg-rose-950/20"
        >
          <div className="flex items-center gap-3 text-rose-500">
            <LogOut size={16} />
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400">Log Out Session</span>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}
