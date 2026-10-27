import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Star, Clock, Lock, Clapperboard, Film, Popcorn, Ban } from 'lucide-react';
import { Survey } from '../types';

interface SurveyCardProps {
  survey: Survey;
  onStartClick: (survey: Survey) => void;
  key?: string;
}

export default function SurveyCard({ survey, onStartClick }: SurveyCardProps) {
  const {
    id,
    logo,
    companyName,
    title,
    rewardUsd,
    rewardNad,
    duration,
    description,
    category,
    completed,
    rating = 4.8,
    participantsCount = 12450,
    difficulty = 'Easy',
    questions = [],
    imageUrl,
    badge,
  } = survey;

  const [now, setNow] = useState(new Date());

  // Real-time 1-second interval to update countdown
  useEffect(() => {
    if (!completed && survey.unlock_at) {
      const unlockTime = new Date(survey.unlock_at).getTime();
      if (unlockTime > Date.now()) {
        const interval = setInterval(() => {
          setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
      }
    }
  }, [completed, survey.unlock_at]);

  // Compute locked/expired states
  const getCountdownInfo = () => {
    if (completed) {
      return { isLocked: false, isExpired: false, text: '', badge: '' };
    }
    
    if (survey.status === 'expired' || (survey.expires_at && new Date() > new Date(survey.expires_at))) {
      return { isLocked: true, isExpired: true, text: 'Theatrical Window Closed', badge: '🚫 Closed' };
    }

    if (survey.unlock_at) {
      const unlockTime = new Date(survey.unlock_at).getTime();
      const diffMs = unlockTime - now.getTime();
      
      if (diffMs > 0) {
        const diffSecs = Math.floor(diffMs / 1000);
        const secs = diffSecs % 60;
        const mins = Math.floor(diffSecs / 60) % 60;
        const hours = Math.floor(diffSecs / 3600) % 24;
        const days = Math.floor(diffSecs / (3600 * 24));

        const pad = (num: number) => num.toString().padStart(2, '0');

        if (days > 0) {
          const hoursLeft = hours > 0 ? ` ${hours}h` : '';
          return {
            isLocked: true,
            isExpired: false,
            text: `Premiere in ${days}d${hoursLeft}`,
            badge: `📅 ${days}d ${pad(hours)}h`,
          };
        } else {
          return {
            isLocked: true,
            isExpired: false,
            text: `Premiere in ${hours > 0 ? `${hours}h ` : ''}${mins}m`,
            badge: `⏳ ${pad(hours)}:${pad(mins)}:${pad(secs)}`,
          };
        }
      }
    }

    return { isLocked: false, isExpired: false, text: '', badge: '' };
  };

  const { isLocked, isExpired, text: lockText, badge: lockBadge } = getCountdownInfo();

  // Render rating stars with gold popcorn aesthetic
  const renderStars = (rate: number) => {
    const fullStars = Math.floor(rate);
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={11}
            className={i < fullStars ? 'fill-current text-amber-400' : 'text-zinc-700'}
          />
        ))}
        <span className="text-[11px] font-bold text-zinc-400 ml-1.5">{rate.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <motion.div
      id={`survey_card_${id}`}
      whileHover={!isLocked && !completed ? { y: -3 } : {}}
      className={`
        relative bg-zinc-900 border rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-xl
        ${completed ? 'border-zinc-800 bg-zinc-950/80 opacity-80' : ''}
        ${isLocked ? 'border-zinc-800/60 bg-zinc-950/60 opacity-60' : 'border-zinc-800 hover:border-red-600/50 hover:shadow-red-950/20'}
      `}
    >
      <div>
        {/* Cinematic Visual Banner (Movie Still) */}
        {imageUrl && (
          <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-zinc-950">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 filter brightness-[0.85]"
              loading="lazy"
            />
            {/* Dramatic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
            
            {/* Badge on banner */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {badge && (
                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-red-600 text-white shadow-md">
                  {badge}
                </span>
              )}
            </div>

            {/* Reward Pill on Banner */}
            <div className="absolute top-3 right-3 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-full text-right shadow-xl flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-400 font-mono">
                ${rewardUsd.toFixed(2)} USD
              </span>
              <span className="text-[11px] font-bold text-zinc-500">·</span>
              <span className="text-xs font-black text-emerald-400 font-mono">
                R {rewardNad.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <div className="p-5 sm:p-6">
          {/* Header row with Studio info */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xl shrink-0 shadow-inner">
                {isLocked && !isExpired ? '🔒' : (logo || '🎬')}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-red-500 tracking-wider uppercase">
                    {companyName}
                  </span>
                  <div className="w-3.5 h-3.5 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-[8px] font-bold">✓</div>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug mt-0.5">
                  {title}
                </h3>
              </div>
            </div>

            {/* Status indicator badge */}
            <div className="shrink-0">
              {completed ? (
                <span className="text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-md bg-zinc-800 text-zinc-300">
                  ✓ COMPLETED
                </span>
              ) : isExpired ? (
                <span className="text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-md bg-red-950 text-red-400">
                  CLOSED
                </span>
              ) : isLocked ? (
                <span className="text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-md bg-amber-950 text-amber-400 animate-pulse">
                  {lockBadge}
                </span>
              ) : (
                <span className="text-[9px] font-black tracking-wider uppercase px-2 py-1 rounded-md bg-red-600 text-white animate-pulse">
                  NOW SCREENING
                </span>
              )}
            </div>
          </div>

          {/* Clean Unboxed Metadata Line (Frontend Design zero-pill discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 mb-3.5">
            <span className="flex items-center gap-1 font-semibold text-zinc-300">
              <Clock size={12} className="text-red-500" />
              {duration} min screening
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-300 font-medium">
              {category}
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="font-semibold text-amber-400 flex items-center gap-1">
              <Popcorn size={11} />
              {difficulty} Review
            </span>
          </div>

          {/* Studio Compensation Highlight Bar */}
          <div className="flex items-center justify-between bg-zinc-950/70 border border-zinc-800/80 rounded-2xl px-3.5 py-2.5 mb-3.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Screening Reward:
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-xs font-black text-amber-400">${rewardUsd.toFixed(2)} USD</span>
              <span className="text-zinc-600 text-[10px]">/</span>
              <span className="text-xs font-black text-emerald-400">R {rewardNad.toFixed(2)} ZAR</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-400 font-normal leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>

          {/* Bottom rating & critic participants */}
          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[11px] text-zinc-500">
            <div>{renderStars(rating)}</div>
            <span className="font-mono">{participantsCount.toLocaleString()} Critics Joined</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1">
        {completed ? (
          <div
            id={`status_completed_${id}`}
            className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-950 border border-zinc-800 text-zinc-400 font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            <CheckCircle size={14} className="text-emerald-500" />
            SCREENING COMPLETE · FUNDS CREDITED
          </div>
        ) : isExpired ? (
          <div
            id={`status_expired_${id}`}
            className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-950 border border-zinc-800 text-zinc-500 font-bold text-xs uppercase tracking-wider rounded-xl"
          >
            <Ban size={14} className="text-red-500" />
            THEATRICAL WINDOW CLOSED
          </div>
        ) : isLocked ? (
          <button
            id={`btn_locked_${id}`}
            disabled
            className="w-full py-3 bg-zinc-950 text-zinc-500 border border-zinc-800/80 font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Lock size={12} className="text-zinc-600" />
            {lockText}
          </button>
        ) : (
          <button
            id={`btn_start_${id}`}
            onClick={() => onStartClick(survey)}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all duration-200 cursor-pointer text-center shadow-lg shadow-red-600/25 flex items-center justify-center gap-2"
          >
            <Clapperboard size={14} />
            WATCH & REVIEW SCREENING
          </button>
        )}
      </div>
    </motion.div>
  );
}
