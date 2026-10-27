import { localStore } from './store';
import { WithdrawalRecord } from '../types';

export interface PriorityActivationResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

class PaymentService {
  /**
   * Processes the priority activation (VIP Status).
   * Simulates background validation, corridor signature, and updates any PENDING
   * or PROCESSING withdrawals to COMPLETED instantly to reflect VIP immediate clearance.
   */
  async processPriorityActivation(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          // 1. Fetch current withdrawals
          const currentWithdrawals = localStore.getWithdrawals();
          
          // 2. Update any pending or processing withdrawal records to COMPLETED/PROCESSING speed corridor
          const updatedWithdrawals = currentWithdrawals.map((w) => {
            if (w.status === 'PENDING' || w.status === 'PROCESSING') {
              return {
                ...w,
                status: 'COMPLETED' as const, // Clear immediately
                accelerated: true,
                completedAt: new Date().toISOString(),
              };
            }
            return w;
          });

          // 3. Save updated records to localStore
          localStore.setWithdrawals(updatedWithdrawals);

          // 4. Save VIP Entitlement status in localStore
          localStorage.setItem('user_vip_priority_status', 'active');
          
          resolve(true);
        } catch (err) {
          console.error('Priority payment simulation error:', err);
          resolve(false);
        }
      }, 1500); // 1.5 second loading feedback
    });
  }

  /**
   * Check if user has active VIP priority status
   */
  isVipActive(): boolean {
    return localStorage.getItem('user_vip_priority_status') === 'active';
  }

  /**
   * Resets the user's VIP status (called when resetting demo data)
   */
  resetVipStatus(): void {
    localStorage.removeItem('user_vip_priority_status');
  }
}

export const paymentService = new PaymentService();
