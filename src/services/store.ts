import { UserProfile, PlatformStats, Survey, WithdrawalRecord } from '../types';
import { INITIAL_USER, INITIAL_STATS, INITIAL_SURVEYS, INITIAL_WITHDRAWALS } from '../constants';
import { convertZarToUsd } from '../utils/currency';

const STORE_KEYS = {
  USER: 'survey_platform_user',
  STATS: 'survey_platform_stats',
  SURVEYS: 'survey_platform_surveys',
  WITHDRAWALS: 'survey_platform_withdrawals',
};

class LocalStore {
  getUser(): UserProfile {
    const data = localStorage.getItem(STORE_KEYS.USER);
    if (!data) {
      this.setUser(INITIAL_USER);
      return INITIAL_USER;
    }
    try {
      const user: UserProfile = JSON.parse(data);
      // Migrate old placeholder user to Fernando Nhambi
      if (user.email?.toLowerCase().includes('lerato') || user.email?.toLowerCase().includes('rewardshub')) {
        this.setUser(INITIAL_USER);
        return INITIAL_USER;
      }
      return user;
    } catch {
      this.setUser(INITIAL_USER);
      return INITIAL_USER;
    }
  }

  setUser(user: UserProfile): void {
    localStorage.setItem(STORE_KEYS.USER, JSON.stringify(user));
  }

  getStats(): PlatformStats {
    const data = localStorage.getItem(STORE_KEYS.STATS);
    const currentUser = this.getUser();
    const isFernando = currentUser.email?.toLowerCase() === 'fernandonhambi23@gmail.com';

    if (!data) {
      this.setStats(INITIAL_STATS);
      return INITIAL_STATS;
    }
    try {
      const stats: PlatformStats = JSON.parse(data);
      // Ensure Fernando Nhambi has an accumulated balance above R 1500
      if (isFernando && (stats.currentBalanceNad < 1500 || !stats.currentBalanceNad)) {
        const upgradedStats: PlatformStats = {
          ...stats,
          currentBalanceNad: 1866.00,
          currentBalanceUsd: 100.00,
          lifetimeEarningsNad: Math.max(stats.lifetimeEarningsNad || 0, 4850.00),
          lifetimeEarningsUsd: Math.max(stats.lifetimeEarningsUsd || 0, 259.91),
        };
        this.setStats(upgradedStats);
        return upgradedStats;
      }
      return stats;
    } catch {
      this.setStats(INITIAL_STATS);
      return INITIAL_STATS;
    }
  }

  setStats(stats: PlatformStats): void {
    localStorage.setItem(STORE_KEYS.STATS, JSON.stringify(stats));
  }

  initializeSurveysWithDynamicTimes(baseSurveys: Survey[]): Survey[] {
    const now = new Date();
    
    return baseSurveys.map((survey, index) => {
      // First 6 tasks available immediately, last 2 unlock in 2h and 4h
      let unlock_at: string | null = null;
      let available = true;

      if (index === 6) {
        unlock_at = new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString();
        available = false;
      } else if (index === 7) {
        unlock_at = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString();
        available = false;
      }

      return {
        ...survey,
        rewardUsd: survey.rewardUsd,
        rewardNad: survey.rewardNad,
        reward: survey.rewardUsd,
        unlock_at,
        expires_at: null,
        available,
        completed: false,
      };
    });
  }

  getSurveys(): Survey[] {
    const data = localStorage.getItem(STORE_KEYS.SURVEYS);
    let parsed: Survey[];
    if (!data) {
      parsed = this.initializeSurveysWithDynamicTimes(INITIAL_SURVEYS);
      this.setSurveys(parsed);
    } else {
      try {
        parsed = JSON.parse(data);
        const totalUsd = parsed.reduce((sum, s) => sum + (s.rewardUsd || 0), 0);
        const hasStrangerThings = parsed.some(s => s.id === 'srv_netflix_stranger_things');
        
        // If parsed is old surveys, or missing questions, or total reward does not accumulate to $200:
        if (!hasStrangerThings || parsed.length < INITIAL_SURVEYS.length || Math.round(totalUsd) !== 200 || !parsed[0]?.questions) {
          parsed = this.initializeSurveysWithDynamicTimes(INITIAL_SURVEYS);
          this.setSurveys(parsed);
        }
      } catch (e) {
        parsed = this.initializeSurveysWithDynamicTimes(INITIAL_SURVEYS);
        this.setSurveys(parsed);
      }
    }

    // Dynamic unlocking based on unlock_at comparison with current time!
    const now = new Date();
    let hasChanges = false;
    const updatedSurveys = parsed.map((survey) => {
      if (survey.unlock_at && !survey.completed) {
        const unlockTime = new Date(survey.unlock_at);
        const isPastUnlock = now >= unlockTime;
        if (isPastUnlock && !survey.available) {
          hasChanges = true;
          return { ...survey, available: true };
        }
      }
      return survey;
    });

    if (hasChanges) {
      this.setSurveys(updatedSurveys);
      return updatedSurveys;
    }

    return updatedSurveys;
  }

  setSurveys(surveys: Survey[]): void {
    localStorage.setItem(STORE_KEYS.SURVEYS, JSON.stringify(surveys));
  }

  getWithdrawals(): WithdrawalRecord[] {
    const data = localStorage.getItem(STORE_KEYS.WITHDRAWALS);
    if (!data) {
      this.setWithdrawals(INITIAL_WITHDRAWALS);
      return INITIAL_WITHDRAWALS;
    }
    try {
      const records: WithdrawalRecord[] = JSON.parse(data);
      return records;
    } catch (e) {
      return [];
    }
  }

  setWithdrawals(withdrawals: WithdrawalRecord[]): void {
    localStorage.setItem(STORE_KEYS.WITHDRAWALS, JSON.stringify(withdrawals));
  }

  resetStore(): void {
    localStorage.clear();
  }
}

export const localStore = new LocalStore();
