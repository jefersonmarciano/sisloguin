import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProgress } from './user-progress/types';
import { useFetchProgress } from './user-progress/useFetchProgress';
import { useUpdateProgress } from './user-progress/useUpdateProgress';
import { useInitializeProgress } from './user-progress/useInitializeProgress';
import { useSyncProgress } from './user-progress/useSyncProgress';

export function useUserProgress() {
  const { user, isAuthenticated } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  
  // Use refactored hooks
  const {
    fetchUserProgress: fetchProgress,
    loading,
    error,
    lastSyncTime,
    setLastSyncTime
  } = useFetchProgress(user?.id);
  
  const { updateUserProgress } = useUpdateProgress(user?.id);
  
  // Wrap fetchProgress to update state
  const fetchUserProgress = async () => {
    const data = await fetchProgress();
    if (data) {
      setUserProgress(data);
      // Salva no localStorage para persistência offline
      localStorage.setItem('userProgress', JSON.stringify(data));
    }
    return data;
  };
  
  const { initializeUserProgress } = useInitializeProgress(user?.id, fetchUserProgress);
  const { syncLocalWithSupabase } = useSyncProgress(user?.id, setLastSyncTime);

  // Carrega progresso do localStorage ao iniciar
  useEffect(() => {
    const storedProgress = localStorage.getItem('userProgress');
    if (storedProgress) {
      try {
        const parsedProgress = JSON.parse(storedProgress);
        setUserProgress(parsedProgress);
      } catch (error) {
        console.error('Erro ao carregar progresso do localStorage:', error);
      }
    }
  }, []);

  // Fetch progress when component mounts or user changes
  useEffect(() => {
    if (user?.id && isAuthenticated) {
      fetchUserProgress();
    } else {
      setUserProgress(null);
      localStorage.removeItem('userProgress');
    }
  }, [user?.id, isAuthenticated]);
  
  // Try to sync when online status changes
  useEffect(() => {
    const handleOnline = () => {
      console.log('Back online, syncing data...');
      syncLocalWithSupabase();
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [syncLocalWithSupabase]);

  // Sincroniza com o Supabase periodicamente
  useEffect(() => {
    if (!user?.id || !isAuthenticated) return;

    const syncInterval = setInterval(() => {
      console.log('Sincronizando progresso com Supabase...');
      syncLocalWithSupabase();
    }, 5 * 60 * 1000); // Sincroniza a cada 5 minutos

    return () => clearInterval(syncInterval);
  }, [user?.id, isAuthenticated, syncLocalWithSupabase]);

  return {
    userProgress,
    loading,
    error,
    lastSyncTime,
    fetchUserProgress,
    updateUserProgress,
    initializeUserProgress,
    syncLocalWithSupabase
  };
}
