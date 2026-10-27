import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Clapperboard, 
  Film, 
  CheckCircle, 
  Sparkles,
  Coins,
} from 'lucide-react';
import { Survey, PlatformStats } from '../types';
import BalanceCard from '../components/BalanceCard';
import SurveyCard from '../components/SurveyCard';
import InformationCard from '../components/InformationCard';
import ProgressCard from '../components/ProgressCard';
import SectionTitle from '../components/SectionTitle';

interface SurveysScreenProps {
  surveys: Survey[];
  stats: PlatformStats;
  qualityScore: number;
  onStartSurvey: (survey: Survey) => void;
  onCompleteSurvey: (surveyId: string, rewardNad: number, rewardUsd: number) => void;
}

export default function SurveysScreen({
  surveys,
  stats,
  qualityScore,
  onStartSurvey,
}: SurveysScreenProps) {
  // Initiate Survey Flow with Lock Guard
  const handleStartSurveyClick = (survey: Survey) => {
    // Check if locked
    if (survey.unlock_at) {
      const isLocked = new Date(survey.unlock_at).getTime() > Date.now();
      if (isLocked) return;
    }
    onStartSurvey(survey);
  };

  // Calculate actual playable surveys count
  const availableTasksCount = useMemo(() => {
    const now = Date.now();
    return surveys.filter((s) => {
      if (s.completed) return false;
      if (s.status === 'expired') return false;
      if (s.expires_at && new Date(s.expires_at).getTime() < now) return false;
      if (s.unlock_at && new Date(s.unlock_at).getTime() > now) return false;
      return true;
    }).length;
  }, [surveys]);

  // Calculate total tasks accumulated value in USD and ZAR (Rands)
  const totalTasksUsd = useMemo(() => {
    return surveys.reduce((acc, s) => acc + (s.rewardUsd || 0), 0);
  }, [surveys]);

  const totalTasksNad = useMemo(() => {
    return surveys.reduce((acc, s) => acc + (s.rewardNad || 0), 0);
  }, [surveys]);

  // Elegant sorting of surveys: Available -> Unlocking sorted by nearest -> Completed/Expired at bottom
  const sortedSurveys = useMemo(() => {
    const now = Date.now();
    return [...surveys].sort((a, b) => {
      // Completed last
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      const aUnlockTime = a.unlock_at ? new Date(a.unlock_at).getTime() : 0;
      const bUnlockTime = b.unlock_at ? new Date(b.unlock_at).getTime() : 0;

      const aIsLocked = aUnlockTime > now;
      const bIsLocked = bUnlockTime > now;

      if (!aIsLocked && bIsLocked) return -1;
      if (aIsLocked && !bIsLocked) return 1;

      // Both locked: sort by unlock time ascending
      if (aIsLocked && bIsLocked) {
        return aUnlockTime - bUnlockTime;
      }

      // Both available: sort by reward descending
      return b.rewardNad - a.rewardNad;
    });
  }, [surveys]);

  return (
    <div id="surveys_screen_scroll_area" className="flex-1 overflow-y-auto px-4 pb-32 pt-2 text-zinc-100">
      {/* Balance Card Component with Cinema Theme */}
      <BalanceCard
        balanceNad={stats.currentBalanceNad}
        balanceUsd={stats.currentBalanceUsd}
        qualityScore={qualityScore}
      />

      {/* Cinema Information Card */}
      <InformationCard
        id="survey_info_card"
        className="mt-5"
        title="Hollywood & Netflix Screening Room"
        description="Review early confidential pilot concepts, trailer edits, and sound mixes from Netflix, Marvel, Warner Bros, and A24 before theatrical premiere. Maintain your Critic Score to unlock exclusive VIP screenings."
        icon={<Clapperboard size={18} className="text-red-500" />}
        type="info"
      />

      {/* Quality Score gauge Card */}
      <ProgressCard
        id="quality_score_card"
        className="mt-5"
        title="Film Critic Quality Score"
        percentage={qualityScore}
        badgeText="Certified Fresh 🍿"
        badgeType="success"
        color="bg-red-600"
      />

      {/* Daily Tasks Section Title */}
      <SectionTitle badge={`${availableTasksCount} SCREENINGS ACTIVE`}>
        Current Test Screenings
      </SectionTitle>

      {/* Total Tasks Accumulated Banner ($200 USD and R 3,732.00 ZAR) */}
      <div 
        id="tasks_valuation_card"
        className="mb-5 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-zinc-950 border border-red-900/50 rounded-3xl p-5 shadow-2xl relative overflow-hidden text-left"
      >
        <div className="absolute right-[-15px] top-[-15px] w-28 h-28 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-zinc-950 border border-red-800/40 flex items-center justify-center shrink-0 shadow-inner">
            <Coins size={22} className="text-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-500">
                Total Accumulated Task Rewards
              </span>
              <span className="text-[10px] font-mono font-bold text-zinc-400">
                {surveys.length} Tasks & Screenings
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
                ${totalTasksUsd.toFixed(2)} USD
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">
                ≈ R {totalTasksNad.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ZAR
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed mt-1 font-medium">
              The complete screening series totals exactly <span className="text-white font-bold">$200.00 USD</span> (equivalent to <span className="text-amber-400 font-bold">R {totalTasksNad.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ZAR</span>). Complete all reviews to unlock the entire accumulated compensation.
            </p>
          </div>
        </div>
      </div>

      {availableTasksCount === 0 && (
        <div id="no_active_surveys_banner" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-5 text-center text-zinc-200">
          <CheckCircle size={24} className="text-emerald-500 mx-auto mb-2" />
          <h4 className="text-xs font-black tracking-wider uppercase text-white">All Screenings Reviewed!</h4>
          <p className="text-[11px] text-zinc-400 font-medium leading-normal mt-1 max-w-xs mx-auto">
            You have reviewed all available premiere cuts. New confidential test screenings from Hollywood studios unlock daily!
          </p>
        </div>
      )}

      {/* VERTICAL LAYOUT FOR SCREENING CARDS */}
      <div id="surveys_list_vertical" className="flex flex-col gap-6 w-full max-w-3xl mx-auto animate-fadeIn">
        {sortedSurveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            survey={survey}
            onStartClick={handleStartSurveyClick}
          />
        ))}
      </div>

      {/* Studio Pipeline Status Card */}
      <SectionTitle>Studio Pipeline Status</SectionTitle>

      <div
        id="queue_status_card"
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-900/40 flex items-center justify-center text-red-500">
            <Film size={16} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              Rendering Next Confidential Screenings
            </h4>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Netflix & Major Studios Encrypted Feed
            </span>
          </div>
        </div>

        <p className="text-xs font-normal text-zinc-400 leading-relaxed mb-4">
          Studios are currently syncing audience reaction algorithms and encoding 4K Dolby Atmos test trailers for your critic tier.
        </p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-red-500 tracking-wider">
            PIPELINE ENCODING
          </span>
          <span className="text-xs font-mono font-extrabold text-red-500">
            84%
          </span>
        </div>

        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <motion.div
            id="queue_progress_bar"
            className="h-full bg-red-600"
            initial={{ width: 0 }}
            animate={{ width: '84%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>

    </div>
  );
}
