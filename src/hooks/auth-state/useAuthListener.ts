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
      // Garantir que os dados locais sejam limpos
      localStorage.removeItem('temuUser');
      localStorage.removeItem('temu-auth-token');
      localStorage.removeItem('wheelCooldownEnd');
      localStorage.removeItem('inspectorCooldownEnd');
      localStorage.removeItem('likeCooldownEnd');
      
      // Limpar o usuário e finalizar inicialização
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
    }, 3000); // 3 segundos é um tempo razoável para o listener responder
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Cleanup subscription when component unmounts
    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleAuthStateChange, setIsInitializing]);

  return {};
};
