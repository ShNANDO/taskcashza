import { WithdrawalRecord } from '../types';
import { localStore } from './store';
import { convertZarToUsd } from '../utils/currency';

export class WithdrawalService {
  /**
   * Fetches withdrawal history (prepared for Supabase database query)
   */
  static async getWithdrawalHistory(): Promise<WithdrawalRecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(localStore.getWithdrawals());
      }, 300);
    });
  }

  /**
   * Submits a withdrawal request, validating against available funds and debiting the account
   */
  static async createWithdrawal(
    bankName: string,
    accountNumber: string,
    amountUsd: number,
    amountNad: number,
    accountOwner?: string
  ): Promise<{ success: boolean; error?: string; record?: WithdrawalRecord }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = localStore.getStats();

        // Perform strict financial checks
        if (amountNad <= 0 || amountUsd <= 0) {
          resolve({ success: false, error: 'Withdrawal amount must be greater than zero.' });
          return;
        }

        if (stats.currentBalanceNad < amountNad) {
          resolve({ success: false, error: 'Insufficient balance available in account.' });
          return;
        }

        // Deduct from balance
        stats.currentBalanceNad = Math.round((stats.currentBalanceNad - amountNad) * 100) / 100;
        stats.currentBalanceUsd = convertZarToUsd(stats.currentBalanceNad);
        localStore.setStats(stats);

        // Add history record
        const withdrawals = localStore.getWithdrawals();
        const now = new Date();
        const isVip = localStorage.getItem('user_vip_priority_status') === 'active';
        
        const newRecord: WithdrawalRecord = {
          id: `wth_${Date.now()}`,
          bankName,
          accountNumber: `••••${accountNumber.slice(-4) || '1234'}`,
          accountOwner: accountOwner || 'Account Owner',
          amountUsd,
          amountNad,
          date: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          status: isVip ? 'COMPLETED' : 'PENDING',
          estimatedArrival: isVip ? 'Dispatched Instantly' : '2–5 Business Days',
          paymentMethod: bankName,
        };

        withdrawals.unshift(newRecord);
        localStore.setWithdrawals(withdrawals);

        resolve({ success: true, record: newRecord });
      }, 800);
    });
  }

  /**
   * Simulates status change or updates of withdrawal for Supabase-ready client
   */
  static async accelerateWithdrawal(id: string): Promise<{ success: boolean; record?: WithdrawalRecord }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const withdrawals = localStore.getWithdrawals();
        const index = withdrawals.findIndex((w) => w.id === id);

        if (index === -1) {
          resolve({ success: false });
          return;
        }

        const w = withdrawals[index];
        if (w.status === 'PENDING') {
          w.status = 'PROCESSING';
          w.estimatedArrival = 'Processing Settlement';
        } else if (w.status === 'PROCESSING') {
          w.status = 'COMPLETED';
          w.estimatedArrival = 'Settled & Delivered';
        } else if (w.status === 'COMPLETED') {
          w.status = 'REJECTED';
          w.estimatedArrival = 'Rejected';
        } else {
          w.status = 'PENDING';
          w.estimatedArrival = '2–5 Business Days';
        }
        
        localStore.setWithdrawals(withdrawals);
        resolve({ success: true, record: w });
      }, 500);
    });
  }
}
