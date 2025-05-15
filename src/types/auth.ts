import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  balance: number;
  reviewsCompleted: number;
  reviewsLimit: number;
  likeReviewsCompleted: number;
  inspectorReviewsCompleted: number;
  todayEarnings: number;
  weekEarnings: number;
  lastReviewDate: Date | null;
  wheelsRemaining: number;
  lastReviewReset: Date | null;
  wheelCooldownEnd?: Date | null;
  lastWheelSpin?: Date | null;
}

export type ExtendedUser = SupabaseUser & {
  name?: string;
  balance?: number;
  reviewsCompleted?: number;
  likeReviewsCompleted?: number;
  inspectorReviewsCompleted?: number;
  reviewsLimit?: number;
  wheelsRemaining?: number;
  avatar?: string;
  lastReviewReset?: Date | null;
  wheel_cooldown_end?: string | null;
  last_wheel_spin?: string | null;
};

export type AuthResponse = {
  user: ExtendedUser;
  session: Session;
  weakPassword?: any;
} | {
  user: null;
  session: null;
  weakPassword?: null;
};

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword?: (email: string) => Promise<void>;
  updateBalance: (amount: number) => Promise<void>;
  completeReview: (type: 'like' | 'inspector') => void;
  checkAndResetReviews: () => void;
  useWheel: () => Promise<number>;
  updateUserAvatar: (avatarUrl: string) => Promise<boolean>;
  updateUserProfile: (name: string, email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}
