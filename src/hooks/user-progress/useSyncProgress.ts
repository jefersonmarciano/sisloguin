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
    if (!localData) return;
    
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
      
      // Se não houver dados no servidor, cria um novo registro
      if (!serverData) {
        console.log('No server data found, creating new record...');
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert([{
            user_id: userId,
            ...localData,
            last_updated: formatTimestamp(new Date())
          }]);
          
        if (insertError) {
          console.error('Error creating server record:', insertError.message, insertError.details);
          return;
        }
        
        console.log('Created new server record');
        setLastSyncTime(new Date());
        return;
      }
      
      // Compara timestamps para decidir qual dado é mais recente
      const localTimestamp = localData.last_updated ? new Date(localData.last_updated) : new Date(0);
      const serverTimestamp = serverData.last_updated ? new Date(serverData.last_updated) : new Date(0);
      
      // Se os dados locais são mais recentes, atualiza o servidor
      if (localTimestamp > serverTimestamp) {
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
      } else if (serverTimestamp > localTimestamp) {
        // Se os dados do servidor são mais recentes, atualiza o localStorage
        console.log('Server data is more recent, updating local storage...');
        localStorage.setItem(`user_progress_${userId}`, JSON.stringify(serverData));
        setLastSyncTime(new Date());
      } else {
        console.log('Data is in sync, no update needed');
      }
    } catch (e: any) {
      console.error('Unexpected error during sync:', e?.message || e);
    }
  }, [userId, setLastSyncTime]);

  return { syncLocalWithSupabase };
}
