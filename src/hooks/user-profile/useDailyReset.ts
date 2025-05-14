
import { useState, useCallback } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { shouldResetReviews } from '@/utils/auth';
import { toast } from '@/components/ui/use-toast';

export const useDailyReset = (user: User | null, setUser: (user: User | null) => void) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check and reset reviews if needed
  const checkAndResetReviews = useCallback(() => {
    if (!user) return;

    const shouldReset = shouldResetReviews(user.lastReviewReset);
    
    if (shouldReset) {
      const resetDate = new Date();
      const updatedUser = {
        ...user,
        reviewsCompleted: 0,
        likeReviewsCompleted: 0,
        inspectorReviewsCompleted: 0,
        lastReviewReset: resetDate
      };

      setUser(updatedUser);

      // Update in Supabase
      supabase
        .from('user_progress')
        .update({
          reviews_completed: 0,
          like_reviews_completed: 0,
          inspector_reviews_completed: 0,
          last_review_reset: resetDate.toISOString(),
          last_updated: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error resetting reviews:', error);
            toast({
              variant: 'destructive',
              title: 'Reset Failed',
              description: 'Failed to reset daily reviews. Please refresh the page.'
            });
          }
        });
    }
  }, [user, setUser]);

  return {
    checkAndResetReviews,
    isLoading
  };
};
