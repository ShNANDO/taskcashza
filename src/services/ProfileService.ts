import { UserProfile, PlatformStats } from '../types';
import { localStore } from './store';

export class ProfileService {
  /**
   * Fetches user profile (prepared for Supabase database query)
   */
  static async getProfile(): Promise<UserProfile> {
    return new Promise((resolve) => {
      resolve(localStore.getUser());
    });
  }

  /**
   * Fetches user balance and completed task stats
   */
  static async getStats(): Promise<PlatformStats> {
    return new Promise((resolve) => {
      resolve(localStore.getStats());
    });
  }

  /**
   * Updates user profile info
   */
  static async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return new Promise((resolve) => {
      const user = localStore.getUser();
      const updatedUser = { ...user, ...profile };
      localStore.setUser(updatedUser);
      resolve(updatedUser);
    });
  }

  /**
   * Resets progress to default (convenience for development/testing)
   */
  static async resetAllData(): Promise<void> {
    localStore.resetStore();
  }
}
