import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Clapperboard, Film, Popcorn, CheckCircle2 } from 'lucide-react';
import { convertZarToUsd } from '../utils/currency';

interface BalanceCardProps {
  balanceNad: number;
  balanceUsd: number;
  growthNad?: number;
  qualityScore?: number;
  className?: string;
  onWithdrawClick?: () => void;
  showWithdrawAction?: boolean;
}

export default function BalanceCard({
  balanceNad,
  growthNad = 48.50,
  qualityScore = 100,
  className = '',
  onWithdrawClick,
  showWithdrawAction = false,
}: BalanceCardProps) {
  
  // Calculate USD dynamically from ZAR
  const dynamicUsd = convertZarToUsd(balanceNad);
  
  return (
    <motion.div
      id="balance_card"
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black
        text-white rounded-3xl p-6 shadow-2xl border border-red-900/30 ${className}
      `}
    >
      {/* Cinematic ambient light glow */}
      <div className="absolute right-[-20px] top-[-20px] w-40 h-40 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-[-20px] bottom-[-20px] w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/40 border border-red-800/40 rounded-full text-[10px] font-black tracking-widest uppercase text-red-300">
          <Clapperboard size={11} className="text-red-400" />
          BOX OFFICE CRITIC WALLET
        </span>
        <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold font-mono">
          <Popcorn size={13} className="text-amber-400" />
          <span>{qualityScore}% CRITIC SCORE</span>
        </div>
      </div>

      {/* Total Balance (ZAR) */}
      <div className="mt-5 mb-5 text-left">
        <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">
          Total Box Office Earnings (ZAR)
        </span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-black tracking-wide text-red-500">R</span>
          <span className="text-3xl font-black font-display tracking-tight text-white">
            {balanceNad.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Grid of indicators */}
      <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4 text-left">
        <div>
          <span className="text-[9px] font-extrabold text-zinc-400 block uppercase tracking-wider">
            Estimated USD Value
          </span>
          <span className="text-xs font-black text-zinc-200 mt-1 inline-block">
            ≈ ${dynamicUsd.toFixed(2)} USD
          </span>
        </div>

        <div>
          <span className="text-[9px] font-extrabold text-zinc-400 block uppercase tracking-wider">
            Premiere Bonus
          </span>
          <span className="text-xs font-black text-emerald-400 mt-1 inline-block flex items-center gap-1">
            <TrendingUp size={11} /> +R {growthNad.toFixed(2)} ZAR
          </span>
        </div>
      </div>

      {/* Available to Withdraw */}
      <div className="mt-4 pt-4 border-t border-zinc-800/80 text-left">
        <span className="text-[9px] font-extrabold text-zinc-400 block uppercase tracking-wider mb-1.5">
          Box Office Release Status
        </span>
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
          <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
          <span className="text-xs font-extrabold">
            R {balanceNad.toLocaleString('en-US', { minimumFractionDigits: 2 })} (100% Critic Cleared)
          </span>
        </div>
      </div>

      {showWithdrawAction && onWithdrawClick && (
        <button
          id="btn_balance_card_withdraw"
          onClick={onWithdrawClick}
          className="mt-4 w-full bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-xs py-3 rounded-xl transition-all duration-200 cursor-pointer text-center"
        >
          Request Box Office Payout
        </button>
      )}
    </motion.div>
  );
}
