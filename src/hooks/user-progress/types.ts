
import { User } from '@/types/auth';

export interface UserProgress {
  id?: string;
  user_id: string;
  balance: number;
  reviews_completed: number;
  like_reviews_completed: number;
  inspector_reviews_completed: number;
  reviews_limit: number;
  wheels_remaining: number;
  theme?: string;
  last_updated?: string;
  last_review_reset: string | null;
  created_at?: string;
}

export interface UpdateResult {
  success: boolean;
  data?: UserProgress;
  error?: string;
  source?: 'localStorage' | 'supabase' | 'both';
  note?: string;
}
