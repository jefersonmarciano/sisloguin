import { useCallback } from 'react';
import { supabase, formatTimestamp } from '@/lib/supabase';
import { setLocalUserProgress } from './useLocalStorage';

export function useUpdateProgress(userId: string | undefined) {
  const updateProgress = useCallback(async (updates: Partial<{
    balance: number;
    reviews_completed: number;
    like_reviews_completed: number;
    inspector_reviews_completed: number;
    reviews_limit: number;
    wheels_remaining: number;
    last_review_reset: string;
  }>) => {
    if (!userId) return;

    try {
      // Primeiro atualiza o localStorage para feedback imediato
      const currentLocalData = localStorage.getItem(`user_progress_${userId}`);
      const currentData = currentLocalData ? JSON.parse(currentLocalData) : {};
      const newData = {
        ...currentData,
        ...updates,
        last_updated: formatTimestamp(new Date())
      };
      
      // Atualiza o localStorage
      setLocalUserProgress(userId, newData);
      
      // Depois atualiza o Supabase
      const { error } = await supabase
        .from('user_progress')
        .upsert([{
          user_id: userId,
          ...updates,
          last_updated: formatTimestamp(new Date())
        }]);

      if (error) {
        console.error('Error updating progress:', error.message, error.details);
        // Em caso de erro, tenta reverter o localStorage para o estado anterior
        if (currentLocalData) {
          setLocalUserProgress(userId, JSON.parse(currentLocalData));
        }
        throw error;
      }

      return true;
    } catch (e: any) {
      console.error('Unexpected error updating progress:', e?.message || e);
      return false;
    }
  }, [userId]);

  return { updateProgress };
}
