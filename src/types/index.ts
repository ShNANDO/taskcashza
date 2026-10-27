export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  country: string;
  verificationStatus: 'Unverified' | 'Pending' | 'Verified';
  memberSince: string;
  currentLevel: number;
  streak: number;
  qualityScore: number; // e.g., 40.48 (representing 40.48%)
}

export interface PlatformStats {
  completedSurveysCount: number;
  approvedSurveysCount: number;
  rejectedSurveysCount: number;
  currentBalanceNad: number;
  currentBalanceUsd: number;
  lifetimeEarningsNad: number;
  lifetimeEarningsUsd: number;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple' | 'yesno' | 'rating' | 'emoji' | 'dropdown';
  answers: string[];
  correct_answer?: string;
}

export interface Survey {
  id: string;
  logo?: string;
  companyName?: string;
  surveyName?: string;
  title: string;
  company: string;
  reward: number;
  rewardUsd: number;
  rewardNad: number;
  duration: number;
  estimatedTimeMin?: number;
  description: string;
  status: string;
  created_at: string;
  category: string;
  available: boolean;
  completed: boolean;
  spotsLeft?: number;
  urgencyText?: string;
  rating?: number;
  participantsCount?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  questions?: SurveyQuestion[];
  unlock_at?: string | null;
  expires_at?: string | null;
  imageUrl?: string;
  badge?: string;
}

export interface WithdrawalRecord {
  id: string;
  bankName: string;
  accountNumber: string;
  accountOwner?: string;
  amountUsd: number;
  amountNad: number;
  date: string;
  time: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  estimatedArrival: string;
  paymentMethod: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'trust' | 'withdrawal' | 'regional' | 'companies' | 'general';
}
