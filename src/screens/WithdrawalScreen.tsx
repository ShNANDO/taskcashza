import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Shield, AlertTriangle, CreditCard, Clock, Zap, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { PlatformStats, WithdrawalRecord } from '../types';
import { BANK_OPTIONS } from '../constants';
import Input from '../components/Input';
import Dropdown from '../components/Dropdown';
import PrimaryButton from '../components/PrimaryButton';
import SectionTitle from '../components/SectionTitle';
import StatusBadge from '../components/StatusBadge';
import Modal from '../components/Modal';
import { localStore } from '../services/store';
import { Award, Check, Sparkles } from 'lucide-react';

const LOADING_STEPS = [
  "Authenticating Critic Profile...",
  "Validating Studio Screening Credits...",
  "Encrypting Bank Settlement...",
  "Connecting to South African Clearing Bridge...",
  "Confirming Beneficiary Account...",
  "Creating Box Office Payout Voucher...",
  "Finalizing Payout Approval..."
];

interface WithdrawalScreenProps {
  stats: PlatformStats;
  withdrawals: WithdrawalRecord[];
  onSubmitWithdrawal: (bankName: string, accountNumber: string, amountUsd: number, amountNad: number, accountOwner?: string) => Promise<boolean>;
  onAccelerateWithdrawal: (id: string) => void;
  onNavigateToPriority: () => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function WithdrawalScreen({
  stats,
  withdrawals,
  onSubmitWithdrawal,
  onAccelerateWithdrawal,
  onNavigateToPriority,
  addToast,
}: WithdrawalScreenProps) {
  // Exchange Rate multiplier: 63 USD = 1175.58 ZAR. Ratio is exactly 18.66 ZAR per USD.
  const USD_TO_NAD_RATE = 18.66;

  const [withdrawUsdAmount, setWithdrawUsdAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountOwner, setAccountOwner] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulation loading state
  const [isProcessingSimulation, setIsProcessingSimulation] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [simulationStepIndex, setSimulationStepIndex] = useState(0);

  // Control Modals
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showEntireBalanceModal, setShowEntireBalanceModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  // Field errors
  const [errors, setErrors] = useState<{
    amount?: string;
    bank?: string;
    accountOwner?: string;
    accountNumber?: string;
    confirmAccountNumber?: string;
  }>({});

  // Real-time quality score
  const currentUserObj = localStore.getUser();
  const qualityScore = currentUserObj.qualityScore;
  const isQualityScoreLow = qualityScore < 90;

  // Dynamic calculations
  const parsedUsdAmount = parseFloat(withdrawUsdAmount) || 0;
  const convertedNadAmount = parsedUsdAmount * USD_TO_NAD_RATE;

  // Validation
  const isFormValid = useMemo(() => {
    if (parsedUsdAmount <= 0 || parsedUsdAmount > stats.currentBalanceUsd) return false;
    if (parsedUsdAmount < 5) return false; // Min withdrawal $5 USD
    if (!selectedBank) return false;
    if (accountOwner.trim().length < 3) return false;
    if (accountNumber.length < 8) return false;
    if (accountNumber !== confirmAccountNumber) return false;
    return true;
  }, [parsedUsdAmount, stats.currentBalanceUsd, selectedBank, accountOwner, accountNumber, confirmAccountNumber]);

  const handleQuickAmountClick = (amount: number | 'all') => {
    const value = amount === 'all' ? stats.currentBalanceUsd : amount;
    // Cap value at current balance
    const finalVal = Math.min(value, stats.currentBalanceUsd);
    setWithdrawUsdAmount(finalVal.toString());

    // Clear amount error if any
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits and single decimal point
    if (/^\d*\.?\d*$/.test(val)) {
      setWithdrawUsdAmount(val);

      const numericVal = parseFloat(val) || 0;
      let err = '';
      if (numericVal > stats.currentBalanceUsd) {
        err = `Amount exceeds available balance ($${stats.currentBalanceUsd.toFixed(2)} USD)`;
      } else if (numericVal > 0 && numericVal < 5) {
        err = 'Minimum withdrawal amount is $5.00 USD';
      }

      setErrors((prev) => ({ ...prev, amount: err || undefined }));
    }
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBank(e.target.value);
    setErrors((prev) => ({ ...prev, bank: undefined }));
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // numbers only
    setAccountNumber(val);

    let err = '';
    if (val.length > 0 && val.length < 8) {
      err = 'Account number must be at least 8 digits';
    }
    setErrors((prev) => ({ ...prev, accountNumber: err || undefined }));
  };

  const handleConfirmAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // numbers only
    setConfirmAccountNumber(val);

    let err = '';
    if (val.length > 0 && val !== accountNumber) {
      err = 'Account numbers do not match';
    }
    setErrors((prev) => ({ ...prev, confirmAccountNumber: err || undefined }));
  };

  const handleWithdrawSubmit = async () => {
    // Rule: Allow max 2 active withdrawals (PENDING or PROCESSING)
    const activeWithdrawals = withdrawals.filter(w => w.status === 'PENDING' || w.status === 'PROCESSING');
    if (activeWithdrawals.length >= 2) {
      setShowLimitModal(true);
      return;
    }

    // Rule: First withdrawal cannot be 100% of available balance
    const isFirstWithdrawal = withdrawals.length === 0;
    const isEntireBalance = parsedUsdAmount === stats.currentBalanceUsd;
    if (isFirstWithdrawal && isEntireBalance) {
      setShowEntireBalanceModal(true);
      return;
    }

    if (!isFormValid) return;

    // Immediately disable the submit flow and button to prevent duplicate submissions
    setIsSubmitting(true);
    setIsProcessingSimulation(true);
    setSimulationProgress(0);
    setSimulationStepIndex(0);

    const totalDuration = 3500; // 3.5 seconds total
    const updateInterval = 50; // Update progress every 50ms
    const stepsCount = LOADING_STEPS.length;
    const stepDuration = totalDuration / stepsCount; // 500ms per step

    const startTime = Date.now();

    const timer = setInterval(async () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
      const stepIndex = Math.min(Math.floor(elapsed / stepDuration), stepsCount - 1);

      setSimulationProgress(progress);
      setSimulationStepIndex(stepIndex);

      if (elapsed >= totalDuration) {
        clearInterval(timer);
        
        // Execute the actual creation of the withdrawal record in the database/store
        try {
          const finalNad = parseFloat((parsedUsdAmount * USD_TO_NAD_RATE).toFixed(2));
          const success = await onSubmitWithdrawal(selectedBank, accountNumber, parsedUsdAmount, finalNad, accountOwner);
          if (success) {
            addToast(`Withdrawal of $${parsedUsdAmount.toFixed(2)} USD initiated successfully!`, 'success');
            
            // Clean up inputs so the form is reset behind the popup
            setWithdrawUsdAmount('');
            setSelectedBank('');
            setAccountOwner('');
            setAccountNumber('');
            setConfirmAccountNumber('');
            setErrors({});

            // Always trigger success premium modal after ANY successful withdrawal
            const key = 'first_withdrawal_modal_shown';
            localStorage.setItem(key, 'true');
            setShowPremiumModal(true);
          } else {
            addToast('Withdrawal failed. Please check your balance.', 'error');
          }
        } catch (err) {
          addToast('An error occurred during liquidation.', 'error');
        } finally {
          setIsProcessingSimulation(false);
          setIsSubmitting(false);
        }
      }
    }, updateInterval);
  };

  return (
    <div id="withdrawal_screen_scroll_area" className="flex-1 overflow-y-auto px-4 pb-32 pt-2">
      <div id="withdrawal_page_header" className="text-center mb-6 mt-1">
        <h2 className="text-base font-extrabold text-white tracking-tight uppercase">
          Request Withdrawal
        </h2>
        <p className="text-xs text-zinc-400 font-medium">
          Withdraw your earnings safely and quickly
        </p>
      </div>

      {/* SECTION 1: Available Balance */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg shrink-0">
          <Shield size={14} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider leading-none">
            Available Balance
          </h3>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            Your cleared and verified reward earnings
          </p>
        </div>
      </div>

      {/* Available Balance Premium Dark Liquidity Card */}
      <motion.div
        id="withdrawal_balance_card"
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 relative overflow-hidden flex flex-col text-left mb-6"
      >
        <div className="absolute right-[-20px] top-[-20px] w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex justify-between items-center w-full">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-lg text-[10px] font-bold tracking-widest uppercase text-slate-300">
            Verified Liquidity
          </span>
          <ArrowUpRight size={18} className="text-emerald-400" />
        </div>

        <h3 className="text-4xl font-black font-display tracking-tight mt-6">
          ${stats.currentBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h3>

        <p className="text-xs font-medium text-slate-400 mt-2">
          Settlement Target: ≈ {stats.currentBalanceNad.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ZAR
        </p>
      </motion.div>

      {/* SECTION 2: New Request */}
      <div className="flex items-center gap-2.5 mt-8 mb-3">
        <div className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg shrink-0">
          <Sparkles size={14} className="text-amber-400" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider leading-none">
            New Request
          </h3>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            Configure your bank details and withdrawal amount
          </p>
        </div>
      </div>

      {/* Quality Score Duty Compliance Banner */}
      {isQualityScoreLow && (
        <motion.div
          id="quality_score_compliance_alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 bg-rose-50 border border-rose-100 rounded-3xl p-5 flex flex-col gap-3 text-left"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                DUTY COMPLIANCE HOLD: LOW QUALITY SCORE ({qualityScore.toFixed(2)}%)
              </h4>
              <p className="text-xs text-rose-600 font-medium leading-relaxed mt-1">
                To request instant automated routing to your bank account, your Quality Score must be at least <span className="font-extrabold text-rose-700">90.00%</span>.
              </p>
              <p className="text-[11px] text-slate-500 leading-normal mt-2">
                Your score decreased because of automated speed checks, skip thresholds, or inconsistent research survey answers. You have a formal duty to complete all available Daily Tasks carefully and honestly to elevate your score to 90%+. Each fully completed task instantly increases your score by <span className="font-bold text-emerald-600">+15.00%</span>.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Amount & Fees Selection */}
      <div id="withdrawal_form_card" className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs mb-5">
        <div className="flex items-center gap-2.5 mb-4 text-emerald-600">
          <Shield size={16} />
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Amount & Fees</h4>
        </div>

        <Input
          id="withdraw_amount_usd"
          label="Amount to Withdraw (USD)"
          placeholder="0.00"
          value={withdrawUsdAmount}
          onChange={handleAmountChange}
          prefixText="$"
          suffixText="USD"
          error={errors.amount}
          inputMode="decimal"
        />

        {parsedUsdAmount > 0 && !errors.amount && (
          <div id="fx_conversion_estimation" className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4 flex justify-between items-center">
            <div>
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Settlement Target</span>
              <span className="text-xs font-mono font-extrabold text-slate-700">
                {convertedNadAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ZAR
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Transfer Fee</span>
              <span className="text-xs font-bold text-emerald-500">
                FREE (0%)
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 mb-2 items-center">
          {[10, 20, 50].map((amt) => (
            <button
              key={amt}
              id={`quick_btn_${amt}`}
              onClick={() => handleQuickAmountClick(amt)}
              disabled={stats.currentBalanceUsd < amt}
              className={`
                flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all border
                ${
                  stats.currentBalanceUsd < amt
                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }
              `}
            >
              {amt}
            </button>
          ))}
          <button
            id="quick_btn_all"
            onClick={() => handleQuickAmountClick('all')}
            disabled={stats.currentBalanceUsd <= 0}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Max
          </button>
        </div>
        <span className="text-[10px] font-medium text-slate-400 pl-1 block mt-2">
          Available Balance: ${stats.currentBalanceUsd.toFixed(2)}
        </span>
      </div>

      {/* Banking & Routing Details */}
      <div id="routing_details_card" className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-4 text-emerald-600">
          <div className="flex items-center gap-2.5">
            <CreditCard size={16} />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Banking Details</h4>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
            Prepared for Supabase
          </span>
        </div>

        <Dropdown
          id="institution_select"
          label="Select Bank"
          placeholder="Choose your bank"
          options={BANK_OPTIONS}
          value={selectedBank}
          onChange={handleBankChange}
          error={errors.bank}
        />

        <Input
          id="account_owner"
          label="Account Owner Name (Nome do Titular)"
          placeholder="Enter the account holder's full name"
          value={accountOwner}
          onChange={(e) => {
            setAccountOwner(e.target.value);
            setErrors((prev) => ({
              ...prev,
              accountOwner: e.target.value.trim().length < 3 ? 'Full name of account holder is required' : undefined,
            }));
          }}
          error={errors.accountOwner}
          maxLength={50}
        />

        <Input
          id="account_id"
          label="Account Number"
          placeholder="Enter account number (min 8 digits)"
          value={accountNumber}
          onChange={handleAccountNumberChange}
          error={errors.accountNumber}
          maxLength={18}
          inputMode="numeric"
        />

        <Input
          id="confirm_account_id"
          label="Confirm Account Number"
          placeholder="Re-enter to confirm"
          value={confirmAccountNumber}
          onChange={handleConfirmAccountNumberChange}
          error={errors.confirmAccountNumber}
          maxLength={18}
          inputMode="numeric"
        />

        <PrimaryButton
          id="btn_liquidate_funds"
          className="mt-4"
          disabled={!isFormValid || isSubmitting || isProcessingSimulation}
          loading={isSubmitting}
          onClick={handleWithdrawSubmit}
          icon={<ArrowUpRight size={16} />}
        >
          {isQualityScoreLow ? 'Withdraw Now (Standard Queue)' : 'Withdraw Now'}
        </PrimaryButton>

        <div className="text-center mt-4">
          <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest block">
            NETFLIXPAYHUB Clearing Network
          </span>
          <p className="text-[9px] font-medium text-slate-400 mt-1 leading-normal max-w-xs mx-auto">
            Authorized entertainment research payouts are routed through verified South African banking clearing bridges for direct settlement.
          </p>
        </div>
      </div>

      {/* SECTION 3: Recent Transactions */}
      <div className="flex items-center gap-2.5 mt-8 mb-3">
        <div className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg shrink-0">
          <Clock size={14} className="text-zinc-400" />
        </div>
        <div>
          <h3 className="text-xs font-black text-white uppercase tracking-wider leading-none">
            Recent Transactions
          </h3>
          <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
            Your historic and active settlement queues
          </p>
        </div>
      </div>

      {/* High Volume Callout Indicator */}
      <div id="withdrawal_queue_callout" className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4">
        <div className="flex items-start gap-2.5 text-slate-500">
          <Clock size={16} className="mt-0.5 shrink-0 text-amber-500 animate-spin-slow" />
          <div>
            <p className="text-[10px] font-medium text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800">Please note:</span> Due to a high volume of withdrawal requests being processed, your transaction may take slightly longer than usual to reflect in your account.
            </p>
            <StatusBadge status="Current Status: In Queue" type="warning" className="mt-2 text-[9px]!" />
          </div>
        </div>
      </div>

      {withdrawals.length === 0 ? (
        <div id="no_withdrawals_panel" className="bg-white border border-slate-100 rounded-3xl p-8 text-center text-slate-400 text-xs font-semibold shadow-xs">
          <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock size={20} />
          </div>
          No withdrawals recorded yet.
        </div>
      ) : (
        <div id="withdrawal_history_list" className="flex flex-col gap-4">
          {withdrawals.map((w) => (
            <div
              key={w.id}
              id={`history_item_${w.id}`}
              className="bg-white border border-slate-100 rounded-3xl p-5 relative overflow-hidden shadow-xs hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-3">
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{w.bankName}</h5>
                  <span className="text-[10px] font-semibold text-slate-400 mt-0.5 block">
                    ID: {w.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-slate-800">
                    ${w.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                    ≈ {w.amountNad.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ZAR
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-slate-600 text-[11px] font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time</span>
                  <span className="text-slate-700">{w.date} at {w.time || '12:00 PM'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Method</span>
                  <span className="text-slate-700">{w.paymentMethod || w.bankName}</span>
                </div>
                {w.accountOwner && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Owner</span>
                    <span className="text-slate-700">{w.accountOwner}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Number</span>
                  <span className="text-slate-700">{w.accountNumber}</span>
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-50">
                  <span className="text-slate-400">Estimated Arrival</span>
                  <span className="text-slate-700 font-bold">{w.estimatedArrival}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Settlement Status
                </span>
                <StatusBadge
                  status={w.status}
                  type={
                    w.status === 'COMPLETED' ? 'success' :
                    w.status === 'PROCESSING' ? 'info' :
                    w.status === 'PENDING' ? 'warning' : 'error'
                  }
                />
              </div>

              {/* GORGEOUS ACCELERATE WITHDRAWAL BUTTON - PREMIUM AMBER/ORANGE ACCENT */}
              {(w.status === 'PENDING' || w.status === 'PROCESSING') && (
                <button
                  id={`btn_accelerate_premium_${w.id}`}
                  onClick={() => {
                    onNavigateToPriority();
                  }}
                  className="w-full mt-4 py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 active:scale-[0.99] text-white text-[10.5px] font-black uppercase tracking-widest rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer border border-amber-300/20"
                >
                  <Zap size={11} className="text-white fill-white animate-pulse" />
                  ACCELERATE WITHDRAWAL - GET PAID NOW
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Active withdrawals limit reached */}
      <Modal
        id="active_withdrawals_limit_modal"
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        title="Active Withdrawal Limit"
      >
        <div className="p-5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4 border border-amber-100">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">
            Active Withdrawal Limit (Max 2)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            You can have a maximum of <span className="font-bold text-slate-800">2 active withdrawals in progress</span> at a time. Previous withdrawals must be approved or cleared before submitting new payout requests.
          </p>
          <div className="border-t border-dashed border-slate-200 my-4 w-full" />
          <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
            To guarantee financial security and ledger reconciliation, please allow your pending transactions to settle before opening additional liquidation channels.
          </p>
          <button
            onClick={() => setShowLimitModal(false)}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Understood
          </button>
        </div>
      </Modal>

      {/* MODAL: Security protection first amount limit */}
      <Modal
        id="first_withdrawal_entire_balance_modal"
        isOpen={showEntireBalanceModal}
        onClose={() => setShowEntireBalanceModal(false)}
        title="First Withdrawal Security Verification"
      >
        <div className="p-5 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4 border border-rose-100">
            <Shield size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">
            Initial Partial Withdrawal Required
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4 font-semibold">
            Your first withdrawal cannot liquidate 100% of your initial account balance. For banking security compliance, we recommend withdrawing <span className="text-emerald-600 font-extrabold">50% or 75%</span> of your total balance on your first transaction.
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-6">
            Our compliance protocols require an initial test disbursement before unlocking unrestricted liquidation. This anti-fraud safeguard verifies your account details with South African clearing banks. The remainder unlocks immediately after this transaction clears.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 w-full mb-6 text-left border border-slate-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Recommended Action</span>
            <p className="text-xs text-slate-600 font-medium leading-normal">
              Adjust payout to <span className="font-bold text-slate-800">50% of current balance</span> now. The remaining balance will remain fully available and eligible for instant withdrawal once this initial payout is completed.
            </p>
          </div>
          <button
            onClick={() => {
              setShowEntireBalanceModal(false);
              // Set amount to 50%
              const recommendVal = Math.floor((stats.currentBalanceUsd / 2) * 100) / 100;
              setWithdrawUsdAmount(recommendVal.toString());
            }}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors mb-2 cursor-pointer shadow-md shadow-orange-500/10"
          >
            Adjust to 50% & Proceed
          </button>
          <button
            onClick={() => setShowEntireBalanceModal(false)}
            className="w-full py-3 bg-transparent hover:bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </Modal>

      {/* REALISTIC FULL-SCREEN SIMULATION LOADING OVERLAY */}
      {isProcessingSimulation && (
        <motion.div
          id="simulation_loading_overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-white p-6"
        >
          <div className="w-full max-w-sm flex flex-col items-center text-center">
            {/* Financial Logo / Shield Badge */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-slate-900/50"
            >
              <Shield className="text-emerald-400" size={28} />
            </motion.div>

            {/* Title */}
            <h3 className="text-lg font-black font-display uppercase tracking-widest text-slate-100">
              Securing Transfer
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-1 max-w-xs">
              Your funds are being routed via our secure premium partners.
            </p>

            {/* Progress Circle Visualizer */}
            <div className="relative w-44 h-44 my-10 flex items-center justify-center">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-2xl" />
              
              {/* Decorative rotating dotted track */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                className="absolute inset-2 border border-dashed border-slate-800 rounded-full"
              />

              {/* Dynamic circular progress SVG */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="76"
                  className="stroke-current text-slate-900"
                  strokeWidth="8"
                  fill="transparent"
                />
                <motion.circle
                  cx="88"
                  cy="88"
                  r="76"
                  className="stroke-current text-emerald-400"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 76}
                  strokeDashoffset={2 * Math.PI * 76 * (1 - simulationProgress / 100)}
                  fill="transparent"
                  strokeLinecap="round"
                />
              </svg>

              {/* Centered percentage numbers */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-black font-display text-white tracking-tight">
                  {simulationProgress}%
                </span>
                <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase mt-0.5 animate-pulse">
                  Processing
                </span>
              </div>
            </div>

            {/* Status updates container with smooth step transition */}
            <div className="h-16 w-full flex flex-col items-center justify-center">
              <motion.div
                key={simulationStepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center"
              >
                {/* Sparkles / Loader text */}
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-200 tracking-wide">
                    {LOADING_STEPS[simulationStepIndex]}
                  </span>
                </div>
                
                {/* Context subtitle */}
                <span className="text-[10px] text-slate-500 font-medium mt-1.5 uppercase tracking-widest">
                  Step {simulationStepIndex + 1} of {LOADING_STEPS.length}
                </span>
              </motion.div>
            </div>

            {/* Secure footer badge */}
            <div className="mt-8 flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-800/80 rounded-full text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <Shield size={12} className="text-emerald-400" />
              <span>PCI-DSS Compliant 256-bit SSL</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* PREMIUM HIGH-FIDELITY SUCCESS POPUP OVERLAY */}
      {showPremiumModal && (
        <motion.div
          id="success_popup_overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        >
          <motion.div
            id="success_popup_modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center overflow-hidden text-white my-auto"
          >
            {/* Visual background lights */}
            <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Premium Checkcircle Circle */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.15 }}
              className="w-20 h-20 bg-emerald-500/15 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto mb-6 relative shrink-0 shadow-lg shadow-emerald-500/10"
            >
              <CheckCircle className="text-emerald-400" size={40} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-0.5 rounded-full border border-dashed border-emerald-400/25"
              />
            </motion.div>

            {/* Title */}
            <h3 className="text-lg font-black font-display tracking-tight leading-snug uppercase text-emerald-400 mb-4 px-2">
              🎉 Withdrawal Request Submitted
            </h3>

            {/* Detailed message */}
            <div className="space-y-3.5 text-slate-300 text-xs font-medium leading-relaxed mb-6">
              <p>
                Your withdrawal request has been successfully received.
              </p>
              <p className="text-[11px] text-slate-400">
                Standard processing normally takes <span className="font-bold text-slate-200">2–5 business days</span>.
              </p>
              <p className="text-[11px] text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 leading-relaxed">
                If you would like to receive your payment sooner, you may choose Priority Processing.
              </p>
            </div>

            {/* Benefits checklist */}
            <div className="w-full flex flex-col gap-2 text-left border-t border-b border-slate-800/80 py-4 mb-6">
              <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase block mb-1">
                Priority Settlement Benefits:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-200">
                <div className="flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-800/50">
                  <Check size={12} className="text-emerald-400" />
                  <span>Instant Review</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-800/50">
                  <Check size={12} className="text-emerald-400" />
                  <span>Priority Queue</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-800/50">
                  <Check size={12} className="text-emerald-400" />
                  <span>No Hold Times</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-950/40 rounded-xl border border-slate-800/50">
                  <Check size={12} className="text-emerald-400" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowPremiumModal(false);
                  onNavigateToPriority();
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-widest rounded-2xl cursor-pointer shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all text-center animate-pulse"
              >
                🚀 ACCELERATE WITHDRAWAL — GET PAID NOW
              </motion.button>

              <button
                onClick={() => {
                  setShowPremiumModal(false);
                }}
                className="w-full py-3.5 border border-slate-800 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
              >
                Continue with Standard Processing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
