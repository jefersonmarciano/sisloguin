
import { useState } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export const useActivityTracking = (user: User | null, setUser: (user: User | null) => void) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update balance
  const updateBalance = async (amount: number): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('user_progress')
        .update({ 
          balance: user.balance + amount,
          last_updated: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          ...user,
          balance: user.balance + amount
        });
      }

      if (amount > 0) {
        toast({
          title: 'Balance Updated',
          description: `${amount} coins added to your balance.`
        });
      }
    } catch (error: any) {
      console.error('Error updating balance:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update balance. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a review
  const completeReview = (type: 'like' | 'inspector'): void => {
    if (!user) return;

    const updatedUser = { ...user };
    updatedUser.reviewsCompleted += 1;

    if (type === 'like') {
      updatedUser.likeReviewsCompleted += 1;
    } else if (type === 'inspector') {
      updatedUser.inspectorReviewsCompleted += 1;
    }

    setUser(updatedUser);

    // Update in Supabase
    supabase
      .from('user_progress')
      .update({
        reviews_completed: updatedUser.reviewsCompleted,
        like_reviews_completed: updatedUser.likeReviewsCompleted,
        inspector_reviews_completed: updatedUser.inspectorReviewsCompleted,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .then(({ error }) => {
        if (error) {
          console.error('Error updating review completion:', error);
        }
      });
  };

  // Use wheel and get reward
  const useWheel = async (): Promise<number> => {
    if (!user) return 0;

    try {
      setIsLoading(true);
      
      const reward = Math.floor(Math.random() * 500) + 100;
      
      const { data, error } = await supabase
        .from('user_progress')
        .update({ 
          wheels_remaining: Math.max(0, user.wheelsRemaining - 1),
          balance: user.balance + reward,
          last_updated: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          ...user,
          wheelsRemaining: Math.max(0, user.wheelsRemaining - 1),
          balance: user.balance + reward
        });
      }

      return reward;
    } catch (error) {
      console.error('Error using wheel:', error);
      toast({
        variant: 'destructive',
        title: 'Wheel Error',
        description: 'Failed to spin the wheel. Please try again.'
      });
      return 0;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateBalance,
    completeReview,
    useWheel,
    isLoading
  };
};
