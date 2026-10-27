import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Check, AlertCircle, ArrowLeft, Eye, EyeOff, Coins, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../services/AuthService';
import Input from '../components/Input';
import PrimaryButton from '../components/PrimaryButton';
import NetflixPayLogo from '../components/NetflixPayLogo';

export const AFRICA_DOTS = [
  // row 0
  { r: 0, c: 3, color: '#3b82f6' }, { r: 0, c: 4, color: '#3b82f6' }, { r: 0, c: 5, color: '#3b82f6' }, { r: 0, c: 6, color: '#3b82f6' }, { r: 0, c: 7, color: '#3b82f6' }, { r: 0, c: 8, color: '#3b82f6' },
  // row 1
  { r: 1, c: 2, color: '#3b82f6' }, { r: 1, c: 3, color: '#3b82f6' }, { r: 1, c: 4, color: '#3b82f6' }, { r: 1, c: 5, color: '#3b82f6' }, { r: 1, c: 6, color: '#3b82f6' }, { r: 1, c: 7, color: '#3b82f6' }, { r: 1, c: 8, color: '#3b82f6' }, { r: 1, c: 9, color: '#3b82f6' },
  // row 2
  { r: 2, c: 1, color: '#3b82f6' }, { r: 2, c: 2, color: '#3b82f6' }, { r: 2, c: 3, color: '#3b82f6' }, { r: 2, c: 4, color: '#3b82f6' }, { r: 2, c: 5, color: '#3b82f6' }, { r: 2, c: 6, color: '#3b82f6' }, { r: 2, c: 7, color: '#3b82f6' }, { r: 2, c: 8, color: '#3b82f6' }, { r: 2, c: 9, color: '#3b82f6' }, { r: 2, c: 10, color: '#3b82f6' },
  // row 3 (start red transition)
  { r: 3, c: 0, color: '#ef4444' }, { r: 3, c: 1, color: '#ef4444' }, { r: 3, c: 2, color: '#ef4444' }, { r: 3, c: 3, color: '#ef4444' }, { r: 3, c: 4, color: '#ef4444' }, { r: 3, c: 5, color: '#ef4444' }, { r: 3, c: 6, color: '#ef4444' }, { r: 3, c: 7, color: '#ef4444' }, { r: 3, c: 8, color: '#ef4444' }, { r: 3, c: 9, color: '#ef4444' }, { r: 3, c: 10, color: '#ef4444' },
  // row 4
  { r: 4, c: 0, color: '#ef4444' }, { r: 4, c: 1, color: '#ef4444' }, { r: 4, c: 2, color: '#ef4444' }, { r: 4, c: 3, color: '#ef4444' }, { r: 4, c: 4, color: '#ef4444' }, { r: 4, c: 5, color: '#ef4444' }, { r: 4, c: 6, color: '#ef4444' }, { r: 4, c: 7, color: '#ef4444' }, { r: 4, c: 8, color: '#ef4444' }, { r: 4, c: 9, color: '#ef4444' },
  // row 5 (amber transition)
  { r: 5, c: 1, color: '#f59e0b' }, { r: 5, c: 2, color: '#f59e0b' }, { r: 5, c: 3, color: '#f59e0b' }, { r: 5, c: 4, color: '#f59e0b' }, { r: 5, c: 5, color: '#f59e0b' }, { r: 5, c: 6, color: '#f59e0b' }, { r: 5, c: 7, color: '#f59e0b' }, { r: 5, c: 8, color: '#f59e0b' }, { r: 5, c: 9, color: '#f59e0b' },
  // row 6
  { r: 6, c: 3, color: '#f59e0b' }, { r: 6, c: 4, color: '#f59e0b' }, { r: 6, c: 5, color: '#f59e0b' }, { r: 6, c: 6, color: '#f59e0b' }, { r: 6, c: 7, color: '#f59e0b' }, { r: 6, c: 8, color: '#f59e0b' },
  // row 7
  { r: 7, c: 4, color: '#f59e0b' }, { r: 7, c: 5, color: '#f59e0b' }, { r: 7, c: 6, color: '#f59e0b' }, { r: 7, c: 7, color: '#f59e0b' }, { r: 7, c: 8, color: '#f59e0b' },
  // row 8 (green transition)
  { r: 8, c: 4, color: '#10b981' }, { r: 8, c: 5, color: '#10b981' }, { r: 8, c: 6, color: '#10b981' }, { r: 8, c: 7, color: '#10b981' },
  // row 9
  { r: 9, c: 4, color: '#10b981' }, { r: 9, c: 5, color: '#10b981' }, { r: 9, c: 6, color: '#10b981' }, { r: 9, c: 7, color: '#10b981' },
  // row 10
  { r: 10, c: 5, color: '#10b981' }, { r: 10, c: 6, color: '#10b981' }, { r: 10, c: 7, color: '#10b981' },
  // row 11
  { r: 11, c: 5, color: '#10b981' }, { r: 11, c: 6, color: '#10b981' },
  // row 12
  { r: 12, c: 5, color: '#10b981' }
];

export function AppLogo({ className = 'w-48 h-auto' }: { className?: string; theme?: 'light' | 'dark' }) {
  return (
    <div className={`${className} relative flex items-center justify-center transition-all duration-300`}>
      <NetflixPayLogo className="w-full h-auto" />
    </div>
  );
}

export function AfricaMapBackground() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none opacity-20 z-0">
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Cinema Film Reel Ambient Background */}
        <svg viewBox="0 0 200 200" className="w-full h-full text-red-600/40">
          <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="20" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="65" r="9" fill="currentColor" fillOpacity="0.25" />
          <circle cx="100" cy="135" r="9" fill="currentColor" fillOpacity="0.25" />
          <circle cx="65" cy="100" r="9" fill="currentColor" fillOpacity="0.25" />
          <circle cx="135" cy="100" r="9" fill="currentColor" fillOpacity="0.25" />
        </svg>
      </div>
    </div>
  );
}

interface AuthScreenProps {
  onAuthSuccess: (user: any) => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  theme?: 'light' | 'dark';
}

type AuthMode = 'login' | 'register' | 'recover';

export default function AuthScreen({ onAuthSuccess, addToast, theme = 'dark' }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  
  // Form fields - default to user profile email
  const [fullName, setFullName] = useState('Fernando Nhambi');
  const [email, setEmail] = useState('fernandonhambi23@gmail.com');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  // UI states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Registration loading simulation states
  const [regProgress, setRegProgress] = useState(0);
  const [regStepIndex, setRegStepIndex] = useState(0);
  const [showRegSuccess, setShowRegSuccess] = useState(false);
  const [regLoadingActive, setRegLoadingActive] = useState(false);

  const REG_STEPS = [
    "Creating your Critic Profile...",
    "Assigning Studio Confidentiality Clearance...",
    "Configuring 100% Critic Score...",
    "Connecting South African Box Office Ledger...",
    "Activating Premiere Screenings..."
  ];

  // Reset form errors
  const clearErrors = () => setFormErrors({});

  // Email validation regex
  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    // Quick validation
    const errors: { [key: string]: string } = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addToast('Please correct the highlighted fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const userProfile = await AuthService.login(email.trim(), password);
      addToast(`Logged in successfully as ${userProfile.name}! 👋`, 'success');
      onAuthSuccess(userProfile);
    } catch (err) {
      addToast('Incorrect email or password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const errors: { [key: string]: string } = {};
    if (!fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      addToast('Please satisfy all registration requirements.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newUser = await AuthService.register(fullName.trim(), email.trim(), password);
      
      // Instead of entering immediately, trigger premium progressive onboarding sequence
      setRegLoadingActive(true);
      setRegProgress(0);
      setRegStepIndex(0);
      
      const totalDuration = 3200; // 3.2 seconds total duration
      const intervalTime = 40;
      const totalSteps = REG_STEPS.length;
      const stepDuration = totalDuration / totalSteps;
      const startTime = Date.now();
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
        const stepIdx = Math.min(Math.floor(elapsed / stepDuration), totalSteps - 1);
        
        setRegProgress(progress);
        setRegStepIndex(stepIdx);
        
        if (elapsed >= totalDuration) {
          clearInterval(interval);
          setShowRegSuccess(true);
          
          // Show ✅ Success screen briefly before automatic transition
          setTimeout(() => {
            setRegLoadingActive(false);
            setShowRegSuccess(false);
            addToast(`Welcome, ${newUser.name}! Your ledger has been initialized. 🎉`, 'success');
            onAuthSuccess(newUser);
          }, 1600);
        }
      }, intervalTime);

    } catch (err) {
      addToast('Registration failed. Please try again.', 'error');
      setIsSubmitting(false);
    }
  };

  const handleRecoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    const errors: { [key: string]: string } = {};
    if (!email.trim()) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthService.recoverPassword(email.trim());
      addToast(response.message, 'success');
      setMode('login');
    } catch (err) {
      addToast('Password recovery failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex-1 flex flex-col justify-center px-6 py-12 transition-colors duration-300 min-h-screen relative overflow-hidden ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-800'}`}>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[200px] h-[200px] bg-blue-500/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm mx-auto relative z-10">
        
        {/* Animated Brand Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center text-center mb-8 relative"
        >
          {/* Subtle Silhouette Behind Logo */}
          <AfricaMapBackground />

          <NetflixPayLogo className="w-60 max-w-[80vw] h-auto mb-4 relative z-10" />
          
          <h1 className="text-[26px] font-black font-display tracking-wider uppercase z-10 text-white">
            NETFLIX<span className="text-red-600">PAY</span>HUB
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase tracking-widest z-10">
            Entertainment Research & Instant Payouts
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {mode === 'login' && (
            <motion.div
              key="login_form_container"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50/60 border-slate-100'} shadow-xs backdrop-blur-md`}
            >
              <div className="mb-6">
                <h2 className={`text-xl font-bold font-display ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Welcome Back</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">Sign in to your account and continue earning rewards.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <Input
                  id="email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={formErrors.email}
                  prefixText="✉"
                  className={isDark ? 'text-slate-100 placeholder:text-slate-600' : ''}
                />

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={formErrors.password}
                    prefixText="🔒"
                    className={isDark ? 'text-slate-100 placeholder:text-slate-600' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-600 cursor-pointer dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-bold select-none pt-1">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-200 text-emerald-500 focus:ring-emerald-500 h-4 w-4 dark:border-slate-800 dark:bg-slate-900"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      clearErrors();
                      setMode('recover');
                    }}
                    className="text-red-500 hover:text-red-400 font-bold"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    id="btn_login_submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl font-bold text-sm cursor-pointer shadow-lg shadow-red-600/30 transition-all duration-200 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock size={15} />
                        <span>Sign In</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs font-semibold text-slate-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      clearErrors();
                      setMode('register');
                    }}
                    className="text-red-500 hover:text-red-400 font-bold ml-1 cursor-pointer transition-colors"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {mode === 'register' && (
            <motion.div
              key="register_form_container"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50/60 border-slate-100'} shadow-xs backdrop-blur-md`}
            >
              <div className="mb-6">
                <h2 className={`text-xl font-bold font-display ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Create Account</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">Start completing daily micro-research tasks instantly.</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <Input
                  id="fullName"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={formErrors.fullName}
                  prefixText="👤"
                  className={isDark ? 'text-slate-100 placeholder:text-slate-600' : ''}
                />

                <Input
                  id="reg_email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={formErrors.email}
                  prefixText="✉"
                  className={isDark ? 'text-slate-100 placeholder:text-slate-600' : ''}
                />

                <div className="relative">
                  <Input
                    id="reg_password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={formErrors.password}
                    prefixText="🔒"
                    className={isDark ? 'text-slate-100 placeholder:text-slate-600' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-600 cursor-pointer dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <Input
                  id="confirm_password"
                  type="password"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={formErrors.confirmPassword}
                  prefixText="🔒"
                  className={isDark ? 'text-slate-100 placeholder:text-slate-600' : ''}
                />

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    id="btn_register_submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl font-bold text-sm cursor-pointer shadow-lg shadow-red-600/30 transition-all duration-200 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <User size={15} />
                        <span>Create Account</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs font-semibold text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      clearErrors();
                      setMode('login');
                    }}
                    className="text-red-500 hover:text-red-400 font-bold ml-1 cursor-pointer transition-colors"
                  >
                    Login
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {mode === 'recover' && (
            <motion.div
              key="recover_form_container"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className={`p-6 rounded-3xl border ${isDark ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50/60 border-slate-100'} shadow-xs backdrop-blur-md`}
            >
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    clearErrors();
                    setMode('login');
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest mb-4 cursor-pointer transition-colors"
                >
                  <ArrowLeft size={12} /> Back to Login
                </button>
                <h2 className={`text-xl font-bold font-display ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Recover Password</h2>
                <p className="text-xs font-semibold text-slate-400 mt-1">We will send a secure password reset link to your registered email address.</p>
              </div>

              <form onSubmit={handleRecoverSubmit} className="space-y-4">
                <Input
                  id="recover_email"
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={formErrors.email}
                  prefixText="✉"
                  className={isDark ? 'text-slate-100 placeholder:text-slate-600' : ''}
                />

                <div className="pt-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    id="btn_recover_submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl font-bold text-sm cursor-pointer shadow-lg shadow-red-600/30 transition-all duration-200 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span>Send Recovery Link</span>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Cleared Footer completely for maximum visual breathing space */}
        <div className="h-6" />
      </div>

      {/* PREMIUM HIGH-FIDELITY ONBOARDING LOADING OVERLAY AS REQUESTED */}
      {regLoadingActive && (
        <motion.div
          id="registration_loading_overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-slate-950 text-white p-6 select-none"
        >
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            
            <AnimatePresence mode="wait">
              {!showRegSuccess ? (
                <motion.div
                  key="loading_screen_reg"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full flex flex-col items-center"
                >
                  {/* Netflix Pay Logo */}
                  <NetflixPayLogo className="w-48 max-w-[70vw] h-auto mb-6" />

                  {/* Title */}
                  <h3 className="text-lg font-black font-display uppercase tracking-widest text-slate-100">
                    Initializing Account
                  </h3>
                  <p className="text-[11px] font-semibold text-red-500 mt-1 uppercase tracking-wider">
                    NETFLIXPAYHUB Security Network
                  </p>

                  {/* Progressive indicator */}
                  <div className="relative w-40 h-40 my-8 flex items-center justify-center">
                    <div className="absolute inset-0 bg-emerald-500/[0.03] rounded-full blur-2xl" />
                    
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" className="stroke-current text-slate-900" strokeWidth="6" fill="transparent" />
                      <motion.circle
                        cx="80" cy="80" r="70"
                        className="stroke-current text-emerald-400"
                        strokeWidth="6"
                        strokeDasharray={2 * Math.PI * 70}
                        strokeDashoffset={2 * Math.PI * 70 * (1 - regProgress / 100)}
                        fill="transparent"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-3xl font-black font-display text-white tracking-tight">
                        {regProgress}%
                      </span>
                      <span className="text-[8.5px] font-black tracking-widest text-emerald-400 uppercase mt-0.5 animate-pulse">
                        Encrypting
                      </span>
                    </div>
                  </div>

                  {/* Processing Step List */}
                  <div className="h-12 w-full flex flex-col items-center justify-center mb-4">
                    <motion.div
                      key={regStepIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 size={14} className="text-emerald-400 fill-emerald-500/10 animate-pulse" />
                      <span className="text-xs font-bold text-slate-200 tracking-wide">
                        {REG_STEPS[regStepIndex]}
                      </span>
                    </motion.div>
                  </div>

                  {/* Premium Linear Progress bar */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/50">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-75"
                      style={{ width: `${regProgress}%` }}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success_screen_reg"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-400/30 rounded-full flex items-center justify-center mb-6 relative shadow-lg shadow-emerald-500/10">
                    <CheckCircle2 className="text-emerald-400" size={44} />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      className="absolute inset-1 rounded-full border border-dashed border-emerald-400/20"
                    />
                  </div>

                  <h3 className="text-2xl font-black font-display text-emerald-400 tracking-tight uppercase">
                    Account Ready!
                  </h3>
                  <p className="text-xs font-bold text-slate-300 mt-3 max-w-xs leading-relaxed">
                    Welcome to your Rewards Dashboard.
                  </p>
                  
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-8 flex items-center gap-1.5 bg-slate-900 px-4 py-2 rounded-full border border-slate-800/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Entering system...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Secure banking badge */}
            <div className="mt-8 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800/80 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>PCI-DSS Compliant 256-bit SSL</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

