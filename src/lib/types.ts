export type PlanType = 'basic' | 'premium' | 'family';

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: PlanType;
  is_admin: boolean;
  xp: number;
  level: number;
  created_at?: string;
  updated_at?: string;
};

export type ZeroState = {
  hasData: boolean;
  totals: {
    financialHealth: number;
    nextMonthForecast: number;
    savingRate: number;
    aiAlerts: number;
  };
};

// Kept from existing codebase to avoid breaking other components
export type GoalStatus = 'active' | 'completed' | 'overdue';

export type Goal = {
  id: string;
  title: string;
  target: number;
  current: number;
  dueDate?: string;
  shared?: boolean;
  sharedWith?: { name: string; pct: number }[];
  contributions: { userId: string; amount: number }[];
};
