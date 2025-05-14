
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
    }
    return data;
  };
  
  const { initializeUserProgress } = useInitializeProgress(user?.id, fetchUserProgress);
  const { syncLocalWithSupabase } = useSyncProgress(user?.id, setLastSyncTime);

  // Fetch progress when component mounts or user changes
  useEffect(() => {
    if (user?.id && isAuthenticated) {
      fetchUserProgress();
    } else {
      setUserProgress(null);
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
