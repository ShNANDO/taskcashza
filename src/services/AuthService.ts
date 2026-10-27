import { UserProfile } from '../types';
import { localStore } from './store';
import { INITIAL_SURVEYS } from '../constants';

export class AuthService {
  /**
   * Simulated user login (prepared for Supabase Auth integration)
   */
  static async login(email: string, password?: string): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentUser = localStore.getUser();
        
        // If the email is different from the stored session, we initialize a fresh client profile!
        if (!currentUser.email || currentUser.email.toLowerCase() !== email.toLowerCase()) {
          const isFernando = email.toLowerCase() === 'fernandonhambi23@gmail.com';
          const emailPrefix = email.split('@')[0];
          const rawName = isFernando 
            ? 'Fernando Nhambi'
            : emailPrefix
              .replace(/[._+-]/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

          const newUser: UserProfile = {
            id: isFernando ? 'usr_fernando_23' : `usr_${Date.now()}`,
            name: rawName || 'Verified Member',
            email: email,
            avatarUrl: '',
            country: 'South Africa',
            verificationStatus: 'Verified',
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            currentLevel: isFernando ? 4 : 1,
            streak: isFernando ? 5 : 1,
            qualityScore: 100.00, // Fresh starts with 100% Quality Score!
          };
          localStore.setUser(newUser);
          
          // Fernando Nhambi accumulated balance above R1500 (R 1,866.00 ZAR = $100.00 USD)
          const newStats = isFernando ? {
            completedSurveysCount: 16,
            approvedSurveysCount: 16,
            rejectedSurveysCount: 0,
            currentBalanceNad: 1866.00,
            currentBalanceUsd: 100.00,
            lifetimeEarningsNad: 4850.00,
            lifetimeEarningsUsd: 259.91,
          } : {
            completedSurveysCount: 0,
            approvedSurveysCount: 0,
            rejectedSurveysCount: 0,
            currentBalanceNad: 0.00,
            currentBalanceUsd: 0.00,
            lifetimeEarningsNad: 0.00,
            lifetimeEarningsUsd: 0.00,
          };
          localStore.setStats(newStats);
          
          // Fresh set of surveys for this client
          const surveys = localStore.initializeSurveysWithDynamicTimes(INITIAL_SURVEYS).map(s => ({ ...s, completed: false }));
          localStore.setSurveys(surveys);
          
          // Clear withdrawals history
          localStore.setWithdrawals([]);
          
          localStorage.setItem('auth_session_active', 'true');
          resolve(newUser);
        } else {
          // If current user is Fernando, ensure balance is above R1500
          if (currentUser.email.toLowerCase() === 'fernandonhambi23@gmail.com') {
            const currentStats = localStore.getStats();
            if (currentStats.currentBalanceNad < 1500) {
              localStore.setStats({
                ...currentStats,
                currentBalanceNad: 1866.00,
                currentBalanceUsd: 100.00,
                lifetimeEarningsNad: Math.max(currentStats.lifetimeEarningsNad, 4850.00),
                lifetimeEarningsUsd: Math.max(currentStats.lifetimeEarningsUsd, 259.91),
              });
            }
          }
          localStorage.setItem('auth_session_active', 'true');
          resolve(currentUser);
        }
      }, 500);
    });
  }

  /**
   * Simulated user registration (prepared for Supabase Auth integration)
   */
  static async register(name: string, email: string, password?: string): Promise<UserProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isFernando = email.toLowerCase() === 'fernandonhambi23@gmail.com';
        const newUser: UserProfile = {
          id: isFernando ? 'usr_fernando_23' : `usr_${Date.now()}`,
          name: isFernando ? 'Fernando Nhambi' : name,
          email,
          avatarUrl: '',
          country: 'South Africa',
          verificationStatus: 'Verified',
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          currentLevel: isFernando ? 4 : 1,
          streak: isFernando ? 5 : 1,
          qualityScore: 100.00, // Default 100% Quality Score for perfect starts
        };
        localStore.setUser(newUser);
        
        const newStats = isFernando ? {
          completedSurveysCount: 16,
          approvedSurveysCount: 16,
          rejectedSurveysCount: 0,
          currentBalanceNad: 1866.00,
          currentBalanceUsd: 100.00,
          lifetimeEarningsNad: 4850.00,
          lifetimeEarningsUsd: 259.91,
        } : {
          completedSurveysCount: 0,
          approvedSurveysCount: 0,
          rejectedSurveysCount: 0,
          currentBalanceNad: 0.00,
          currentBalanceUsd: 0.00,
          lifetimeEarningsNad: 0.00,
          lifetimeEarningsUsd: 0.00,
        };
        localStore.setStats(newStats);
        
        // Reset surveys to uncompleted state
        const surveys = localStore.initializeSurveysWithDynamicTimes(INITIAL_SURVEYS).map(s => ({ ...s, completed: false }));
        localStore.setSurveys(surveys);
        
        // Clear withdrawals history
        localStore.setWithdrawals([]);
        
        localStorage.setItem('auth_session_active', 'true');
        resolve(newUser);
      }, 500);
    });
  }

  /**
   * Simulated user logout (prepared for Supabase Auth integration)
   */
  static async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('auth_session_active');
        resolve();
      }, 300);
    });
  }

  /**
   * Simulated password recovery (prepared for Supabase Auth integration)
   */
  static async recoverPassword(email: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'If this email is registered, a password recovery link has been sent to your inbox.'
        });
      }, 500);
    });
  }

  /**
   * Get currently authenticated user profile
   */
  static async getCurrentUser(): Promise<UserProfile | null> {
    return new Promise((resolve) => {
      const active = localStorage.getItem('auth_session_active');
      if (active === 'true') {
        resolve(localStore.getUser());
      } else {
        resolve(null);
      }
    });
  }
}
