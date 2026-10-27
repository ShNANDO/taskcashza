import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, CheckCircle, Coins, Info, RefreshCw, Clock } from 'lucide-react';

// Type declarations
import { UserProfile, PlatformStats, Survey, WithdrawalRecord } from './types';

// Services
import { localStore } from './services/store';
import { AuthService } from './services/AuthService';
import { SurveyService } from './services/SurveyService';
import { WithdrawalService } from './services/WithdrawalService';
import { NotificationService, AppNotification } from './services/NotificationService';
import { ProfileService } from './services/ProfileService';
import { paymentService } from './services/payment';

// Reusable Components
import Header from './components/Header';
import BottomNavigation, { TabId } from './components/BottomNavigation';
import Toast, { ToastMessage } from './components/Toast';
import Modal from './components/Modal';
import StatusBadge from './components/StatusBadge';
import NetflixPayLogo from './components/NetflixPayLogo';

// Screens
import AuthScreen, { AppLogo, AfricaMapBackground } from './screens/AuthScreen';
import SurveysScreen from './screens/SurveysScreen';
import WithdrawalScreen from './screens/WithdrawalScreen';
import ProfileScreen from './screens/ProfileScreen';
import HelpScreen from './screens/HelpScreen';
import ActiveSurveyScreen from './screens/ActiveSurveyScreen';
import PriorityWithdrawalScreen from './screens/PriorityWithdrawalScreen';

export default function App() {
  // Global Application State
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // UI state managers
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('app_theme') as 'light' | 'dark') || 'dark';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('surveys');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showPriorityWithdrawal, setShowPriorityWithdrawal] = useState(false);

  // Load state database on startup & splash timer
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2 seconds as requested
    return () => clearTimeout(splashTimer);
  }, []);

  // Set the theme class globally
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    async function loadData() {
      const currentUser = await AuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
        // Load operational statistics
        const userStats = await ProfileService.getStats();
        setStats(userStats);

        const availableSurveys = await SurveyService.getSurveys();
        setSurveys(availableSurveys);

        const withdrawalRecords = await WithdrawalService.getWithdrawalHistory();
        setWithdrawals(withdrawalRecords);

        const alerts = await NotificationService.getNotifications();
        setNotifications(alerts);

        const unreadCount = await NotificationService.getUnreadCount();
        setUnreadNotificationsCount(unreadCount);
      } else {
        setIsLoggedIn(false);
      }
    }
    loadData();
  }, [isLoggedIn]);

  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      id: `toast_${Date.now()}`,
      message,
      type,
    });
  };

  // Auth Operations
  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setUser(null);
    setStats(null);
    setIsLoggedIn(false);
    setActiveTab('surveys');
    addToast('You have been logged out securely.', 'info');
  };

  // Database Reset helper
  const handleResetDemoData = async () => {
    await ProfileService.resetAllData();
    paymentService.resetVipStatus();
    localStorage.removeItem('first_withdrawal_modal_shown');
    setShowPriorityWithdrawal(false);

    // Force reload states
    const freshUser = await localStore.getUser();
    const freshStats = await localStore.getStats();
    const freshSurveys = await localStore.getSurveys();
    const freshWithdrawals = await localStore.getWithdrawals();

    setUser(freshUser);
    setStats(freshStats);
    setSurveys(freshSurveys);
    setWithdrawals(freshWithdrawals);
    setActiveTab('surveys');
  };

  // Survey Operations
  const [activeSurvey, setActiveSurvey] = useState<Survey | null>(null);

  const handleStartSurvey = (survey: Survey) => {
    setActiveSurvey(survey);
  };

  const handleCompleteSurvey = async (surveyId: string, rewardNad: number, rewardUsd: number) => {
    const result = await SurveyService.submitSurvey(surveyId);
    if (result.success) {
      // Refresh state from DB
      const freshStats = await ProfileService.getStats();
      const freshSurveys = await SurveyService.getSurveys();
      const freshUser = await ProfileService.getProfile();

      setStats(freshStats);
      setSurveys(freshSurveys);
      if (user) {
        setUser({ ...user, qualityScore: freshUser.qualityScore });
      }

      addToast(`🎉 Research Task completed! Verified Reward +$${rewardUsd.toFixed(2)} USD (+${rewardNad.toFixed(2)} ZAR) credited.`, 'success');

      // Append dynamic completion notification
      const completeNotification: AppNotification = {
        id: `not_comp_${Date.now()}`,
        title: 'Payout Verified ✅',
        message: `Task completed successfully. $${rewardUsd.toFixed(2)} USD was credited to your ledger account.`,
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [completeNotification, ...prev]);
      setUnreadNotificationsCount((prev) => prev + 1);
    }
  };

  // Liquidation Operations
  const handleCreateWithdrawal = async (
    bankName: string,
    accountNumber: string,
    amountUsd: number,
    amountNad: number,
    accountOwner?: string
  ): Promise<boolean> => {
    const result = await WithdrawalService.createWithdrawal(bankName, accountNumber, amountUsd, amountNad, accountOwner);
    if (result.success) {
      const freshStats = await ProfileService.getStats();
      const freshWithdrawals = await WithdrawalService.getWithdrawalHistory();
      setStats(freshStats);
      setWithdrawals(freshWithdrawals);

      // Add a payout notification
      const payoutNotification: AppNotification = {
        id: `not_pay_${Date.now()}`,
        title: 'Liquidation Initiated 💸',
        message: `Settlement of $${amountUsd.toFixed(2)} USD is in queue for routing to ${bankName}.`,
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [payoutNotification, ...prev]);
      setUnreadNotificationsCount((prev) => prev + 1);

      return true;
    }
    return false;
  };

  const handleAccelerateWithdrawal = async (id: string) => {
    const result = await WithdrawalService.accelerateWithdrawal(id);
    if (result.success) {
      const freshWithdrawals = await WithdrawalService.getWithdrawalHistory();
      setWithdrawals(freshWithdrawals);

      const accelerateNotification: AppNotification = {
        id: `not_acc_${Date.now()}`,
        title: '⚡ Instant Settlement Completed',
        message: `Payout was boosted via verified liquidity routing. Funds dispatched immediately!`,
        timestamp: 'Just now',
        read: false,
      };
      setNotifications((prev) => [accelerateNotification, ...prev]);
      setUnreadNotificationsCount((prev) => prev + 1);
    }
  };

  const handleNotificationsBellClick = async () => {
    setIsNotificationsOpen(true);
    await NotificationService.markAllAsRead();
    setUnreadNotificationsCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Render correct active tab screen
  const renderActiveScreen = () => {
    if (!stats || !user) return null;

    switch (activeTab) {
      case 'surveys':
        return (
          <SurveysScreen
            surveys={surveys}
            stats={stats}
            qualityScore={user.qualityScore}
            onStartSurvey={handleStartSurvey}
            onCompleteSurvey={handleCompleteSurvey}
          />
        );
      case 'withdrawal':
        return (
          <WithdrawalScreen
            stats={stats}
            withdrawals={withdrawals}
            onSubmitWithdrawal={handleCreateWithdrawal}
            onAccelerateWithdrawal={handleAccelerateWithdrawal}
            onNavigateToPriority={() => setShowPriorityWithdrawal(true)}
            addToast={addToast}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            user={user}
            stats={stats}
            onLogout={handleLogout}
            onResetData={handleResetDemoData}
            onTabChange={setActiveTab}
            addToast={addToast}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      case 'help':
        return <HelpScreen addToast={addToast} userName={user?.name} />;
      default:
        return null;
    }
  };

  if (showSplash) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white p-6 select-none relative overflow-hidden">
        {/* Subtle glowing backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[380px] h-[380px] bg-red-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[280px] h-[280px] bg-red-950/20 blur-[90px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center text-center relative z-10 w-full"
        >
          {/* Subtle Ambient Background Decoration */}
          <AfricaMapBackground />

          {/* User's Netflix Pay Logo */}
          <NetflixPayLogo className="w-64 max-w-[85vw] h-auto mb-6 z-10" />

          <h1 className="text-3xl font-black font-display tracking-wider text-white uppercase z-10">
            NETFLIX<span className="text-red-600">PAY</span>HUB
          </h1>
          <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest font-sans">
              Official Entertainment Research & Rewards
            </span>
          </div>

          {/* Premium Loading Indicator */}
          <div className="mt-14 w-40 bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800 relative z-10">
            <motion.div
              initial={{ left: "-100%" }}
              animate={{ left: "100%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500"
            />
          </div>

          <p className="text-[9px] font-mono text-zinc-500 mt-4 uppercase tracking-widest z-10">
            Connecting NETFLIXPAYHUB Vault...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      id="app_root_wrapper"
      className="w-full min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-red-600"
    >
      <div
        id="app_container"
        className="relative w-full max-w-md mx-auto min-h-screen flex flex-col justify-between bg-zinc-950 text-zinc-100 border-x border-zinc-900 shadow-2xl"
      >
        <AnimatePresence mode="wait">
          {!isLoggedIn ? (
            <motion.div
              key="auth_gate_screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <AuthScreen onAuthSuccess={handleAuthSuccess} addToast={addToast} theme={theme} />
            </motion.div>
          ) : activeSurvey ? (
            <motion.div
              key="active_survey_full_screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col h-full relative"
            >
              <ActiveSurveyScreen
                survey={activeSurvey}
                onCancel={() => setActiveSurvey(null)}
                onComplete={handleCompleteSurvey}
              />
            </motion.div>
          ) : showPriorityWithdrawal ? (
            <motion.div
              key="priority_withdrawal_full_screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col h-full relative"
            >
              <PriorityWithdrawalScreen
                onBack={() => setShowPriorityWithdrawal(false)}
                onSuccess={async () => {
                  const freshStats = await ProfileService.getStats();
                  const freshWithdrawals = await WithdrawalService.getWithdrawalHistory();
                  setStats(freshStats);
                  setWithdrawals(freshWithdrawals);
                }}
                addToast={addToast}
              />
            </motion.div>
          ) : (
            /* SECURE ACCOUNT DASHBOARD FRAME */
            <motion.div
              key="app_dashboard_frame"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col h-full relative"
            >
              {/* Header bar */}
              <Header
                name={user?.name || 'Member'}
                streak={user?.streak || 1}
                notificationCount={unreadNotificationsCount}
                onNotificationsClick={handleNotificationsBellClick}
                onLogoutClick={handleLogout}
                theme={theme}
              />

              {/* Main content scroll layout */}
              {renderActiveScreen()}

              {/* Persistent Bottom navigation menu */}
              <BottomNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                dailyCount={surveys.filter((s) => !s.completed).length}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Floating Toast Alert */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* NOTIFICATIONS / DISPATCH ALERTS LOG DRAWER */}
        <Modal
          id="notifications_modal"
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          title="Account Notifications"
        >
          <div id="notifications_drawer_body" className="flex flex-col gap-4 max-h-[60vh]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Account Activity History
              </span>
              <StatusBadge status="System: Connected" type="success" className="text-[9px]!" />
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs font-semibold">
                No notification alerts.
              </div>
            ) : (
              <div className="flex flex-col gap-3.5 overflow-y-auto pr-1">
                {notifications.map((not) => (
                  <div
                    key={not.id}
                    id={not.id}
                    className="p-4 border border-slate-50 bg-slate-50/40 rounded-2xl flex gap-3 items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-950/40 border border-red-900/30 flex items-center justify-center shrink-0 text-red-500 mt-0.5">
                      <Bell size={13} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h5 className="text-xs font-bold text-slate-800 tracking-wide">{not.title}</h5>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">{not.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-normal mt-1 leading-normal">
                        {not.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
