
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProgress } from './types';
import { getLocalUserProgress, saveLocalUserProgress } from './useLocalStorage';

export function useFetchProgress(userId: string | undefined) {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Function to fetch user progress from Supabase
  const fetchUserProgress = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from Supabase
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user progress:', error);
        
        // Try to get data from localStorage as fallback
        const localData = getLocalUserProgress(userId);
        
        if (localData) {
          console.log('Using localStorage data as fallback');
          setLastSyncTime(null);
          return localData;
        } else {
          setError('Failed to load your progress data');
          return null;
        }
      } else {
        console.log('Loaded progress from Supabase:', data);
        saveLocalUserProgress(userId, data);
        setLastSyncTime(new Date());
        return data;
      }
    } catch (e) {
      console.error('Unexpected error loading progress:', e);
      setError('An unexpected error occurred');
      
      // Try localStorage as fallback
      const localData = getLocalUserProgress(userId);
      if (localData) {
        return localData;
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    fetchUserProgress,
    loading,
    error,
    lastSyncTime,
    setLastSyncTime
  };
}
