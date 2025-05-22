import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/supabase';

export const useDailyReset = () => {
  const { user, setUser } = useAuth();
  const resetInProgress = useRef(false);
  const lastResetCheck = useRef<number>(0);

  const checkAndResetReviews = async () => {
    if (!user || resetInProgress.current) return;

    try {
      resetInProgress.current = true;
      const now = new Date();
      const lastReset = user.lastReviewReset ? new Date(user.lastReviewReset) : null;
      
      // Check if 24 hours have passed since last reset
      const shouldReset = !lastReset || (now.getTime() - lastReset.getTime() >= 24 * 60 * 60 * 1000);

      if (shouldReset) {
        const updatedUser = {
          ...user,
          reviewsCompleted: 0,
          likeReviewsCompleted: 0,
          inspectorReviewsCompleted: 0,
          wheelsRemaining: 1, // Changed to 1 spin per day
          lastReviewReset: now
        };

        setUser(updatedUser);
        localStorage.setItem('temuUser', JSON.stringify({
          ...updatedUser,
          lastReviewReset: now.toISOString()
        }));

        // Update in Supabase
        await supabase
          .from('user_progress')
          .update({
            reviews_completed: 0,
            like_reviews_completed: 0,
            inspector_reviews_completed: 0,
            wheels_remaining: 1,
            last_review_reset: now.toISOString()
          })
          .eq('user_id', user.id);

        // Clear all cooldowns
        await supabase
          .from('user_cooldowns')
          .delete()
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error in checkAndResetReviews:', error);
    } finally {
      resetInProgress.current = false;
    }
  };

  // Check for reset every minute
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastResetCheck.current >= 60 * 1000) {
        lastResetCheck.current = now;
        checkAndResetReviews();
      }
    }, 60 * 1000);

    return () => clearInterval(checkInterval);
  }, [user]);

  return {
    checkAndResetReviews
  };
};
