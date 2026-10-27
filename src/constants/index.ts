import { Survey, FAQItem, UserProfile, PlatformStats, WithdrawalRecord } from '../types';
import { DYNAMIC_SURVEYS } from './surveys';
import { convertZarToUsd } from '../utils/currency';

export const INITIAL_USER: UserProfile = {
  id: 'usr_fernando_23',
  name: 'Fernando Nhambi',
  email: 'fernandonhambi23@gmail.com',
  avatarUrl: '',
  country: 'South Africa',
  verificationStatus: 'Verified',
  memberSince: 'January 2026',
  currentLevel: 4,
  streak: 5,
  qualityScore: 100.00,
};

// Fernando Nhambi accumulated balance above R1500 (R 1,866.00 ZAR = $100.00 USD)
const initialBalanceZar = 1866.00;
const initialLifetimeEarningsZar = 4850.00;

export const INITIAL_STATS: PlatformStats = {
  completedSurveysCount: 24,
  approvedSurveysCount: 23,
  rejectedSurveysCount: 1,
  currentBalanceNad: initialBalanceZar,
  currentBalanceUsd: convertZarToUsd(initialBalanceZar),
  lifetimeEarningsNad: initialLifetimeEarningsZar,
  lifetimeEarningsUsd: convertZarToUsd(initialLifetimeEarningsZar),
};

export const INITIAL_SURVEYS: Survey[] = DYNAMIC_SURVEYS;

export const INITIAL_WITHDRAWALS: WithdrawalRecord[] = [];

export const BANK_OPTIONS = [
  { id: 'std_01', name: 'Standard Bank' },
  { id: 'fnb_02', name: 'First National Bank (FNB)' },
  { id: 'ned_03', name: 'Nedbank Namibia' },
  { id: 'bank_wind', name: 'Bank Windhoek' },
  { id: 'abs_04', name: 'ABSA South Africa' },
  { id: 'cap_05', name: 'Capitec Bank' },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq_01',
    question: 'How do I increase my Film Critic & Trust Score?',
    answer: 'Consistency and honest critique are key. Complete test screenings attentively, providing genuine opinions on movie trailers, pacing, and visual effects. Avoiding fast random skipping and passing attention checks keeps your Critic Score at 100%.',
    category: 'trust',
  },
  {
    id: 'faq_02',
    question: 'How long does Box Office payout take?',
    answer: 'Standard studio research withdrawals typically take 2-5 business days to clear through localized clearing networks. However, you can activate the VIP Express Priority Processing to bypass queues and release funds in under 15 minutes.',
    category: 'withdrawal',
  },
  {
    id: 'faq_03',
    question: 'How do movie research payouts work?',
    answer: 'We utilize localized cinema research settlement bridges. Rewards earned in USD from major studios (Netflix, Warner Bros, Marvel, HBO, A24) are securely liquidated into South African Rand (ZAR) and routed directly to standard local banks.',
    category: 'regional',
  },
  {
    id: 'faq_04',
    question: 'Which cinema and streaming studios are participating?',
    answer: 'We partner with major entertainment leaders including Netflix Studios, Marvel Studios, Warner Bros Discovery, HBO Max, Sony Pictures Animation, and A24 Films to evaluate confidential trailers, storylines, and streaming tech before public premiere.',
    category: 'companies',
  },
  {
    id: 'faq_05',
    question: 'How do I unlock exclusive early-access screenings?',
    answer: 'Early preview screenings and confidential test cuts are unlocked dynamically based on your Critic Quality Score. Maintaining a 90%+ Critic Score guarantees access to the highest-paying Hollywood and streaming panels.',
    category: 'general',
  },
];
