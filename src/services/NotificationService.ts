export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export class NotificationService {
  private static notifications: AppNotification[] = [
    {
      id: 'not_01',
      title: 'Critic Score Active 🔥',
      message: 'Keep reviewing daily screenings attentively to maintain your 100% Critic Score and unlock VIP Hollywood panels!',
      timestamp: 'Just now',
      read: false,
    },
    {
      id: 'not_02',
      title: 'New Screening Available 🎬',
      message: 'Netflix Studios has launched a new "Stranger Things 5" confidential screening review worth $35.00 USD (R 653.10 ZAR).',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 'not_03',
      title: 'Liquidity Pool Verified ✅',
      message: 'FNB and Nedbank localized clearing bridges are online with high liquidity availability.',
      timestamp: '1 day ago',
      read: true,
    },
  ];

  static async getNotifications(): Promise<AppNotification[]> {
    return new Promise((resolve) => {
      resolve([...this.notifications]);
    });
  }

  static async getUnreadCount(): Promise<number> {
    return new Promise((resolve) => {
      resolve(this.notifications.filter((n) => !n.read).length);
    });
  }

  static async markAllAsRead(): Promise<void> {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
  }
}
