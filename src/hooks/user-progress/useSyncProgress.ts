
import { useCallback } from 'react';
import { supabase, formatTimestamp } from '@/lib/supabase';
import { getLocalUserProgress } from './useLocalStorage';

export function useSyncProgress(
  userId: string | undefined,
  setLastSyncTime: (time: Date) => void
) {
  // Synchronize local data with Supabase with improved error handling
  const syncLocalWithSupabase = useCallback(async () => {
    if (!userId) return;
    
    const localData = getLocalUserProgress(userId);
    if (!localData || !localData.last_updated) return;
    
    try {
      console.log('Attempting to sync local data with Supabase...');
      
      // Check for more recent server data
      const { data: serverData, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching data for sync:', fetchError.message, fetchError.details);
        return;
      }
      
      // If local data is more recent, sync to server
      if (!serverData || new Date(localData.last_updated) > new Date(serverData.last_updated)) {
        console.log('Local data is more recent, syncing to Supabase...');
        
        // Remove local ID if present
        const { id, ...dataToSync } = localData;
        
        try {
          // Ensure we have a properly formatted timestamp
          const dataWithTimestamp = {
            ...dataToSync,
            last_updated: formatTimestamp(new Date())
          };
          
          const { error: syncError } = await supabase
            .from('user_progress')
            .upsert([dataWithTimestamp]);
            
          if (syncError) {
            console.error('Error syncing with Supabase:', syncError.message, syncError.details);
            return;
          } else {
            console.log('Data synced successfully to Supabase');
            setLastSyncTime(new Date());
          }
        } catch (syncErr: any) {
          console.error('Error during sync operation:', syncErr?.message || syncErr);
        }
      } else {
        console.log('Server data is more recent or equal, no sync needed');
      }
    } catch (e: any) {
      console.error('Unexpected error during sync:', e?.message || e);
    }
  }, [userId, setLastSyncTime]);

  return { syncLocalWithSupabase };
}
