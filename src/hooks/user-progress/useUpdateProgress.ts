
import { useCallback } from 'react';
import { supabase, UserProgress, formatTimestamp } from '@/lib/supabase';
import { UpdateResult } from './types';
import { getLocalUserProgress, saveLocalUserProgress } from './useLocalStorage';

export function useUpdateProgress(userId: string | undefined) {
  // Function to update user progress with improved error handling and typing
  const updateUserProgress = useCallback(async (
    updates: Partial<Omit<UserProgress, 'id' | 'user_id' | 'created_at'>>
  ): Promise<UpdateResult> => {
    if (!userId) {
      return { success: false, error: 'Not authenticated' };
    }

    try {
      // Add last_updated timestamp
      const updatesWithTimestamp = {
        ...updates,
        last_updated: formatTimestamp(new Date())
      };

      // Update in Supabase
      try {
        console.log('Updating user progress in Supabase:', updatesWithTimestamp);
        
        const { data, error } = await supabase
          .from('user_progress')
          .update(updatesWithTimestamp)
          .eq('user_id', userId)
          .select('*')
          .maybeSingle();
          
        // Handle Supabase errors
        if (error) {
          console.error('Error updating progress in Supabase:', error.message, error.details);
          
          // Update locally even if Supabase fails
          const currentLocalData = getLocalUserProgress(userId);
          
          if (currentLocalData) {
            const updatedLocalData = {
              ...currentLocalData,
              ...updatesWithTimestamp
            };
            
            saveLocalUserProgress(userId, updatedLocalData);
            
            return { 
              success: true, 
              data: updatedLocalData, 
              source: 'localStorage',
              note: 'Saved locally only due to server error: ' + error.message
            };
          } else {
            return { success: false, error: error.message };
          }
        } else if (data) {
          // Update local state and cache if Supabase update succeeds
          saveLocalUserProgress(userId, data);
          return { success: true, data, source: 'both' };
        } else {
          // Handle the case when no data is returned but also no error
          console.warn('No data returned from Supabase update operation');
          return { 
            success: true,
            source: 'supabase',
            note: 'Update succeeded but no data returned'
          };
        }
      } catch (err: any) {
        console.error('Unexpected error updating progress:', err?.message || err);
        
        // Try to update locally if server update fails
        try {
          const currentLocalData = getLocalUserProgress(userId);
          
          if (currentLocalData) {
            const updatedLocalData = {
              ...currentLocalData,
              ...updates,
              last_updated: formatTimestamp(new Date())
            };
            
            saveLocalUserProgress(userId, updatedLocalData);
            
            return { 
              success: true, 
              data: updatedLocalData, 
              source: 'localStorage',
              note: 'Saved locally only due to connection error'
            };
          }
        } catch (localError: any) {
          console.error('Error saving to localStorage:', localError?.message || localError);
        }
        
        return { 
          success: false, 
          error: 'Failed to update your progress: ' + (err?.message || 'Unknown error')
        };
      }
    } catch (e: any) {
      console.error('Unexpected error updating progress:', e?.message || e);
      
      return { 
        success: false, 
        error: 'Failed to update your progress: ' + (e?.message || 'Unknown error')
      };
    }
  }, [userId]);

  return { updateUserProgress };
}
