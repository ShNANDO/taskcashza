import { Survey, PlatformStats } from '../types';
import { localStore } from './store';
import { convertZarToUsd } from '../utils/currency';

export class SurveyService {
  /**
   * Fetches available surveys (prepared for Supabase database query)
   */
  static async getSurveys(): Promise<Survey[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localStore.getSurveys());
      }, 300);
    });
  }

  /**
   * Submits a completed survey and credits the user balance
   */
  static async submitSurvey(surveyId: string): Promise<{ success: boolean; earnedNad: number; earnedUsd: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const surveys = localStore.getSurveys();
        const surveyIndex = surveys.findIndex((s) => s.id === surveyId);

        if (surveyIndex === -1 || surveys[surveyIndex].completed) {
          resolve({ success: false, earnedNad: 0, earnedUsd: 0 });
          return;
        }

        const survey = surveys[surveyIndex];
        survey.completed = true;
        localStore.setSurveys(surveys);

        // Credit the balance!
        const stats = localStore.getStats();
        stats.completedSurveysCount += 1;
        stats.approvedSurveysCount += 1; // Auto-approved for mock purposes
        stats.currentBalanceNad += survey.rewardNad;
        stats.currentBalanceNad = Math.round(stats.currentBalanceNad * 100) / 100;
        stats.currentBalanceUsd = convertZarToUsd(stats.currentBalanceNad);
        stats.lifetimeEarningsNad += survey.rewardNad;
        stats.lifetimeEarningsNad = Math.round(stats.lifetimeEarningsNad * 100) / 100;
        stats.lifetimeEarningsUsd = convertZarToUsd(stats.lifetimeEarningsNad);
        localStore.setStats(stats);

        // Boost quality score for successful activity to reward users
        const user = localStore.getUser();
        if (user.qualityScore < 100) {
          user.qualityScore = Math.min(100, Math.round((user.qualityScore + 15.00) * 100) / 100);
          localStore.setUser(user);
        }

        resolve({
          success: true,
          earnedNad: survey.rewardNad,
          earnedUsd: survey.rewardUsd,
        });
      }, 500);
    });
  }

  /**
   * Gets Count of Available Daily Tasks
   */
  static async getDailyTasksCount(): Promise<number> {
    const surveys = localStore.getSurveys();
    return surveys.filter((s) => !s.completed).length;
  }
}
