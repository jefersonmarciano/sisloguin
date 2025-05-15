import { useEffect, useCallback, useRef } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { syncUserProfileFromSession } from '@/utils/auth';

/**
 * Hook for setting up auth state listeners to react to auth changes
 */
export const useAuthListener = (
  setIsInitializing: (value: boolean) => void,
  updateUser: (userData: User | null) => void
) => {
  const timeoutRef = useRef<number | null>(null);

  // Handle auth state changes
  const handleAuthStateChange = useCallback(async (event: string, session: any) => {
    console.log('Auth event detected:', event, session?.user?.id);
    
    if (event === 'SIGNED_OUT') {
      console.log('User signed out');
      // Clean all local data
      localStorage.removeItem('temuUser');
      localStorage.removeItem('sisloguinUser');
      localStorage.removeItem('temu-auth-token');
      localStorage.removeItem('sisloguin-auth-token');
      localStorage.removeItem('wheelCooldownEnd');
      localStorage.removeItem('inspectorCooldownEnd');
      localStorage.removeItem('likeCooldownEnd');
      
      // Also remove any Supabase-related keys
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.') || key.includes('auth')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear user state and finish initialization
      updateUser(null);
      setIsInitializing(false);
      return;
    }
    
    if (session?.user) {
      try {
        // Process the session and update user state
        const userProfile = await syncUserProfileFromSession(session.user);
        updateUser(userProfile);
      } catch (error) {
        console.error('Error processing auth change:', error);
        // Even on error, finish initialization
        setIsInitializing(false);
      } finally {
        setIsInitializing(false);
      }
    } else {
      updateUser(null);
      setIsInitializing(false);
    }
  }, [updateUser, setIsInitializing]);

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Guarantee we won't be stuck in the initializing state
    timeoutRef.current = window.setTimeout(() => {
      console.log('Auth listener timeout reached, forcing initialization complete');
      setIsInitializing(false);
    }, 5000); // Increase timeout to 5 seconds to give more time to try normal auth flow
    
    // Set up auth state listener
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange(handleAuthStateChange);
      subscription = data.subscription;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setIsInitializing(false);
    }

    // Cleanup subscription when component unmounts
    return () => {
      console.log('Cleaning up auth listener');
      if (subscription) {
        try {
      subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing from auth events:', error);
        }
      }
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleAuthStateChange, setIsInitializing]);

  return {};
};
