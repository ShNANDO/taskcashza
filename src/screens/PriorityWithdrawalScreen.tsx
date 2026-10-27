import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Zap, Lock, Check, AlertTriangle } from 'lucide-react';

interface PriorityWithdrawalScreenProps {
  onBack: () => void;
  onSuccess: () => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function PriorityWithdrawalScreen({
  onBack,
  addToast
}: PriorityWithdrawalScreenProps) {
  
  // Inject the VTurb script dynamically on mount
  useEffect(() => {
    const scriptId = 'converteai-vsl-sdk';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.type = "text/javascript";
      s.src = "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js";
      s.async = true;
      document.head.appendChild(s);
    }
  }, []);

  const handleCheckoutRedirect = () => {
    addToast('⚡ Redirecting to priority secure checkout...', 'info');
    // Immediate redirect to the checkout payment link
    window.location.href = "https://app.quorapay.online/pay/b85da5d3-73c9-424e-b27b-60d2606dd039";
  };

  return (
    <div className="flex-1 bg-zinc-950 min-h-screen text-zinc-100 relative overflow-x-hidden select-none">
      {/* Cinema subtle red & amber background spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-red-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-60 left-10 w-[300px] h-[300px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="flex-1 flex flex-col px-5 pt-10 pb-16 max-w-[420px] mx-auto w-full relative z-10">
        
        {/* 1. HEADLINE */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500 block mb-1">
            🎬 Studio Settlement Clearance
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight uppercase">
            Your Box Office Payout is <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 font-black">Approved</span>...
          </h1>
          <div className="mt-2.5 text-xs md:text-sm font-bold text-amber-400 uppercase tracking-wide leading-snug">
            Currently waiting in the standard studio clearing queue.
          </div>
        </div>

        {/* 2. SUBHEADLINE */}
        <p className="text-[11.5px] md:text-xs text-zinc-400 text-center font-medium leading-relaxed max-w-sm mx-auto mb-8">
          Thousands of film critics are requesting daily withdrawals. Standard processing takes <span className="text-zinc-200 font-semibold">2–5 business days</span>. VIP Express Release moves your payout to immediate transfer.
        </p>

        {/* 3. VIDEO (VSL Player) */}
        <div className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/60 shadow-2xl mb-8 relative">
          <div id="ifr_6a56f2ab644fb76112f5e80e_wrapper" className="w-full">
            <div id="ifr_6a56f2ab644fb76112f5e80e_aspect" className="relative pt-[133.333333%] w-full">
              <iframe
                frameBorder="0"
                allowFullScreen
                src={`https://scripts.converteai.net/82b303db-b1c3-4ce0-99c4-4de2c72f40bf/players/6a56f2ab644fb76112f5e80e/v4/embed.html${window.location.search || '?'}&vl=${encodeURIComponent(window.location.href)}`}
                id="ifr_6a56f2ab644fb76112f5e80e"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                referrerPolicy="origin"
              />
            </div>
          </div>
        </div>

        {/* 4. ATTENTION BOX */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4.5 mb-8 text-center max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1.5">
            <AlertTriangle size={13} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">VIP Pass Warning</span>
          </div>
          <p className="text-[10.5px] text-amber-200/90 font-medium leading-relaxed">
            This VIP Express Release offer is exclusively presented immediately after your withdrawal request. If you leave this page, standard queue processing will continue automatically.
          </p>
        </div>

        {/* 6. SMALL TRUST INDICATORS */}
        <div className="flex items-center justify-center gap-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-10">
          <span className="flex items-center gap-1">
            <Lock size={10} className="text-zinc-500" />
            Secure Checkout
          </span>
          <span className="flex items-center gap-1">
            <Zap size={10} className="text-amber-400" />
            Instant Release
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={10} className="text-emerald-500" />
            Encrypted Payment
          </span>
        </div>

        {/* 7. BACK BUTTON */}
        <div className="text-center pb-8">
          <button
            onClick={onBack}
            className="text-[10px] font-bold text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
