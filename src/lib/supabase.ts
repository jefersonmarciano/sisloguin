// Import the supabase client from integrations/supabase/client
import { supabase } from '@/integrations/supabase/client';

// Re-export the supabase client
export { supabase };

// Export types for the user_progress table for better type safety
export type UserProgress = {
  id: string;
  user_id: string;
  balance: number;
  reviews_completed: number;
  like_reviews_completed: number;
  inspector_reviews_completed: number;
  reviews_limit: number;
  wheels_remaining: number;
  theme?: string;
  last_review_reset: string | null;
  created_at: string;
  last_updated?: string;
};

// Helper function to ensure timestamp is properly formatted
export const formatTimestamp = (date: Date): string => {
  return date.toISOString();
};
