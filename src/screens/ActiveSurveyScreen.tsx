import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronRight,
  Star,
  Clapperboard,
  Film,
  Popcorn,
  Sparkles,
  ArrowLeft,
  Trophy
} from 'lucide-react';
import { Survey } from '../types';

interface ActiveSurveyScreenProps {
  survey: Survey;
  onCancel: () => void;
  onComplete: (surveyId: string, rewardNad: number, rewardUsd: number) => void;
}

export default function ActiveSurveyScreen({
  survey,
  onCancel,
  onComplete,
}: ActiveSurveyScreenProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'question' | 'submitting' | 'completed'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Answers states
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [selectedMultipleAnswers, setSelectedMultipleAnswers] = useState<string[]>([]);

  const questions = useMemo(() => {
    return survey.questions || [];
  }, [survey]);

  const currentQuestion = useMemo(() => {
    if (questions.length === 0 || currentQuestionIndex >= questions.length) return null;
    return questions[currentQuestionIndex];
  }, [questions, currentQuestionIndex]);

  // Progress calculations
  const progressPercentage = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((currentQuestionIndex / questions.length) * 100);
  }, [currentQuestionIndex, questions]);

  const estimatedRemainingTime = useMemo(() => {
    const totalMinutes = survey.duration || 3;
    const fractionRemaining = 1 - (currentQuestionIndex / questions.length);
    const minsRemaining = Math.max(1, Math.ceil(totalMinutes * fractionRemaining));
    return `${minsRemaining} min${minsRemaining > 1 ? 's' : ''} left`;
  }, [survey, currentQuestionIndex, questions]);

  // Advance to Next step
  const advanceStep = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer('');
      setSelectedMultipleAnswers([]);
    } else {
      // Last question completed. Show submitting transition
      setCurrentStep('submitting');
      setTimeout(() => {
        setCurrentStep('completed');
        onComplete(survey.id, survey.rewardNad, survey.rewardUsd);
      }, 1500);
    }
  };

  // Handle single answer selecting (with auto-advance feedback)
  const handleSingleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setTimeout(() => {
      advanceStep();
    }, 380);
  };

  // Handle multiple selection toggling
  const handleMultipleAnswerToggle = (answer: string) => {
    setSelectedMultipleAnswers((prev) => {
      if (prev.includes(answer)) {
        return prev.filter((a) => a !== answer);
      } else {
        return [...prev, answer];
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 min-h-screen text-zinc-100 pb-12 selection:bg-red-600">
      {/* Header Bar */}
      <div className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 px-4 py-3.5 flex items-center justify-between sticky top-0 z-20">
        {currentStep !== 'completed' && currentStep !== 'submitting' ? (
          <button 
            onClick={onCancel}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Exit</span>
          </button>
        ) : (
          <div className="w-16" />
        )}
        <div className="flex items-center gap-1.5 truncate max-w-[220px]">
          <Clapperboard size={14} className="text-red-500 shrink-0" />
          <span className="text-xs font-black text-white uppercase tracking-wider truncate">
            {survey.companyName || 'Studio Screening'}
          </span>
        </div>
        <div className="w-16 text-right">
          {currentStep === 'question' && (
            <span className="text-[10px] font-mono font-bold text-zinc-400">
              Q {currentQuestionIndex + 1}/{questions.length}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-md mx-auto w-full px-4 pt-6 flex flex-col">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SURVEY INTRODUCTION */}
          {currentStep === 'intro' && (
            <motion.div
              key="intro_view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                {survey.imageUrl && (
                  <div className="w-full h-36 rounded-2xl overflow-hidden mb-5 relative">
                    <img 
                      src={survey.imageUrl} 
                      alt={survey.title}
                      className="w-full h-full object-cover filter brightness-[0.8]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    {survey.badge && (
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-600 text-white">
                        {survey.badge}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-3xl shadow-inner">
                    {survey.logo || '🎬'}
                  </div>
                </div>

                <div className="text-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                    Confidential Studio Screening
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white leading-tight mt-1">
                    {survey.surveyName || survey.title}
                  </h2>
                  <div className="flex items-center justify-center gap-1 text-amber-400 mt-2">
                    <Star size={13} className="fill-current text-amber-400" />
                    <Star size={13} className="fill-current text-amber-400" />
                    <Star size={13} className="fill-current text-amber-400" />
                    <Star size={13} className="fill-current text-amber-400" />
                    <Star size={13} className="fill-current text-amber-400" />
                    <span className="text-xs font-bold text-zinc-400 ml-1">
                      {(survey.rating || 4.9).toFixed(1)} Critic Score
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 text-center leading-relaxed font-normal mb-6">
                  {survey.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 border-t border-zinc-800/80 pt-5">
                  <div className="bg-zinc-950/80 rounded-2xl p-3.5 text-center border border-zinc-800">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Critic Payout</span>
                    <span className="text-sm font-black text-amber-400 mt-0.5 block font-mono">
                      ${survey.rewardUsd.toFixed(2)} USD
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 block mt-0.5">
                      ≈ R {survey.rewardNad.toFixed(2)} ZAR
                    </span>
                  </div>

                  <div className="bg-zinc-950/80 rounded-2xl p-3.5 text-center border border-zinc-800">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Est. Duration</span>
                    <span className="text-sm font-extrabold text-zinc-200 mt-0.5 block">
                      ⏱ {survey.duration} Mins
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 block mt-0.5">
                      {questions.length} questions
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setCurrentStep('question');
                  setCurrentQuestionIndex(0);
                }}
                className="w-full py-4 mt-6 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer text-center shadow-xl shadow-red-600/25 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <Clapperboard size={15} />
                BEGIN TEST SCREENING
              </button>
            </motion.div>
          )}

          {/* STEP 2: ACTIVE QUESTIONS */}
          {currentStep === 'question' && currentQuestion && (
            <motion.div
              key={`question_${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                {/* Horizontal Progress Bar */}
                <div className="w-full bg-zinc-800 h-2 rounded-full mb-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-wider mb-5">
                  <span className="text-red-500 font-extrabold">{progressPercentage}% Reviewed</span>
                  <span>⏱ {estimatedRemainingTime}</span>
                </div>

                {/* Question text */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl mb-5 text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-500 block mb-1.5">
                    Studio Feedback Prompt · Question {currentQuestionIndex + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white tracking-tight leading-relaxed">
                    {currentQuestion.question}
                  </h3>
                </div>

                {/* Question choices */}
                <div className="space-y-3 mb-6">
                  
                  {/* TYPE: SINGLE */}
                  {currentQuestion.type === 'single' && (
                    <div className="flex flex-col gap-2.5">
                      {currentQuestion.answers.map((ans) => {
                        const isSelected = selectedAnswer === ans;
                        return (
                          <button
                            key={ans}
                            onClick={() => handleSingleAnswerSelect(ans)}
                            className={`
                              w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer
                              ${isSelected 
                                ? 'border-red-600 bg-red-600/15 text-white shadow-lg shadow-red-600/10' 
                                : 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 hover:bg-zinc-850 text-zinc-300'
                              }
                            `}
                          >
                            <span>{ans}</span>
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                              isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-zinc-700'
                            }`}>
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* TYPE: MULTIPLE */}
                  {currentQuestion.type === 'multiple' && (
                    <div className="flex flex-col gap-2.5">
                      {currentQuestion.answers.map((ans) => {
                        const isSelected = selectedMultipleAnswers.includes(ans);
                        return (
                          <button
                            key={ans}
                            onClick={() => handleMultipleAnswerToggle(ans)}
                            className={`
                              w-full flex items-center justify-between px-5 py-4 rounded-2xl border text-xs sm:text-sm font-semibold text-left transition-all cursor-pointer
                              ${isSelected 
                                ? 'border-red-600 bg-red-600/15 text-white shadow-lg' 
                                : 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 text-zinc-300'
                              }
                            `}
                          >
                            <span>{ans}</span>
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-3 ${
                              isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-zinc-700'
                            }`}>
                              {isSelected && <Check size={12} strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                      <button
                        disabled={selectedMultipleAnswers.length === 0}
                        onClick={advanceStep}
                        className="w-full py-3.5 mt-2 bg-red-600 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-red-600/20"
                      >
                        Confirm Selections & Next
                      </button>
                    </div>
                  )}

                  {/* TYPE: YES/NO */}
                  {currentQuestion.type === 'yesno' && (
                    <div className="grid grid-cols-2 gap-3">
                      {currentQuestion.answers.map((ans, i) => {
                        const isSelected = selectedAnswer === ans;
                        return (
                          <button
                            key={ans}
                            onClick={() => handleSingleAnswerSelect(ans)}
                            className={`
                              h-24 rounded-2xl border flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer
                              ${isSelected 
                                ? 'border-red-600 bg-red-600/20 text-white shadow-lg' 
                                : 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 text-zinc-300'
                              }
                            `}
                          >
                            <span className="text-xl mb-1">{i === 0 ? '👍' : '👎'}</span>
                            <span className="text-xs font-bold leading-tight">{ans}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* TYPE: RATING */}
                  {currentQuestion.type === 'rating' && (
                    <div className="flex flex-col gap-2">
                      {currentQuestion.answers.map((ans, i) => {
                        const isSelected = selectedAnswer === ans;
                        return (
                          <button
                            key={ans}
                            onClick={() => handleSingleAnswerSelect(ans)}
                            className={`
                              w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer
                              ${isSelected 
                                ? 'border-amber-500 bg-amber-500/15 text-amber-300' 
                                : 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 text-zinc-300'
                              }
                            `}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center text-[10px] font-mono">
                                {i + 1}
                              </span>
                              <span>{ans}</span>
                            </div>
                            <Star size={13} className={isSelected ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'} />
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* TYPE: EMOJI */}
                  {currentQuestion.type === 'emoji' && (
                    <div className="grid grid-cols-3 gap-3">
                      {currentQuestion.answers.map((ans) => {
                        const isSelected = selectedAnswer === ans;
                        const parts = ans.split(' ');
                        const emoji = parts[0] || '🍿';
                        const text = parts.slice(1).join(' ') || '';

                        return (
                          <button
                            key={ans}
                            onClick={() => handleSingleAnswerSelect(ans)}
                            className={`
                              h-32 rounded-2xl border flex flex-col items-center justify-center p-3 transition-all cursor-pointer
                              ${isSelected 
                                ? 'border-red-600 bg-red-600/20 text-white shadow-lg' 
                                : 'border-zinc-800 bg-zinc-900/90 hover:border-zinc-700 text-zinc-300'
                              }
                            `}
                          >
                            <span className="text-3xl mb-2 block">{emoji}</span>
                            <span className="text-[10px] font-black uppercase text-center leading-tight">
                              {text}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SUBMITTING ANSWERS */}
          {currentStep === 'submitting' && (
            <motion.div
              key="submitting_view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-20"
            >
              <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-red-600 animate-spin mb-6" />
              <h3 className="text-base font-black text-white tracking-wider uppercase">
                Transmitting Critique to Studio Vault
              </h3>
              <p className="text-xs text-zinc-400 mt-2 max-w-xs leading-relaxed font-semibold">
                Encoding your review data and updating your Box Office Wallet balance...
              </p>
            </motion.div>
          )}

          {/* STEP 4: GORGEOUS CELEBRATORY COMPLETION SCREEN */}
          {currentStep === 'completed' && (
            <motion.div
              key="completed_view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-8"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl">
                  <Popcorn size={42} className="text-amber-400 animate-bounce" />
                </div>
                <Sparkles size={24} className="text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                <Sparkles size={16} className="text-red-500 absolute bottom-4 -left-3 animate-pulse delay-75" />
              </div>

              <h2 className="text-2xl font-black text-white tracking-tight">
                Screening Review Accepted!
              </h2>
              <p className="text-xs text-red-400 font-bold mt-1 uppercase tracking-widest">
                Studio Verification Passed · 100% Critic Score
              </p>

              {/* Earnings container */}
              <div className="mt-8 bg-zinc-900 border border-zinc-800 text-white rounded-3xl p-6 w-full max-w-xs shadow-2xl relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Film size={64} />
                </div>
                
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">
                  BOX OFFICE REWARD CREDITED
                </span>
                <div className="text-2xl font-black text-amber-400 mt-1.5 font-mono">
                  +${survey.rewardUsd.toFixed(2)} USD
                </div>
                <div className="text-xs font-bold text-zinc-300 mt-1">
                  ≈ R {survey.rewardNad.toFixed(2)} ZAR
                </div>
              </div>

              <p className="text-[10px] font-mono text-zinc-400 leading-relaxed max-w-xs mt-6 uppercase tracking-wider">
                Critic Trust Rating sustained at <span className="text-emerald-400 font-bold">100.00%</span>
              </p>

              <button
                onClick={onCancel}
                className="w-full py-4 mt-8 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-xl shadow-red-600/20"
              >
                Back to Screening Room
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
