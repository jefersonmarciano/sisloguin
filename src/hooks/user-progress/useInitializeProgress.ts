
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getLocalUserProgress, saveLocalUserProgress } from './useLocalStorage';
import { UserProgress, UpdateResult } from './types';

export function useInitializeProgress(userId: string | undefined, fetchUserProgressCallback?: () => Promise<any>) {
  // Function to initialize user progress
  const initializeUserProgress = useCallback(async (): Promise<UpdateResult> => {
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Check for existing progress in local storage first
      const localData = getLocalUserProgress(userId);
      
      if (localData) {
        console.log('Found local user progress data');
        return { success: true, data: localData, source: 'localStorage' };
      }
      
      // If no local data, fetch from Supabase
      console.log('No local data found, checking Supabase...');
      
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('No user progress found in Supabase, creating new entry...');
            
            // Create a new progress record with required user_id field
            const newProgress: UserProgress = {
              user_id: userId,
              balance: 0,
              reviews_completed: 0,
              like_reviews_completed: 0,
              inspector_reviews_completed: 0,
              reviews_limit: 10,
              wheels_remaining: 3,
              theme: 'light',
              last_updated: new Date().toISOString(),
              last_review_reset: null,
              created_at: new Date().toISOString()
            };
            
            // Insert new record into Supabase
            try {
              const { data: newData, error: insertError } = await supabase
                .from('user_progress')
                .insert(newProgress)
                .select()
                .single();
                
              if (insertError) {
                console.error('Error creating user progress:', insertError);
                return { success: false, error: insertError.message };
              } else if (newData) {
                // Save to local storage
                saveLocalUserProgress(userId, newData);
                return { success: true, data: newData, source: 'both' };
              }
            } catch (insertErr) {
              console.error('Error creating progress:', insertErr);
              return { success: false, error: 'Failed to create progress' };
            }
          } else {
            console.error('Error fetching user progress:', error);
            return { success: false, error: error.message };
          }
        } else if (data) {
          console.log('Found user progress in Supabase');
          // Save to local storage for future use
          saveLocalUserProgress(userId, data);
          return { success: true, data, source: 'both' };
        }
      } catch (err) {
        console.error('Error initializing user progress:', err);
        return { success: false, error: 'Database error' };
      }
      
      return { success: false, error: 'Failed to initialize progress' };
    } catch (e) {
      console.error('Unexpected error initializing progress:', e);
      return { success: false, error: 'Failed to initialize progress' };
    }
  }, [userId]);

  return { initializeUserProgress };
}
