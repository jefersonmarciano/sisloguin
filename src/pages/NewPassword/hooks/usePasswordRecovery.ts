import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export const usePasswordRecovery = () => {
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(false);
  const [isProcessingToken, setIsProcessingToken] = useState<boolean>(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    console.log('NewPassword component mounted, checking for recovery state');
    setIsProcessingToken(true);
    
    // Check URL hash for recovery parameters first (faster detection)
    const checkUrlForRecovery = () => {
      // Parse hash fragment for recovery tokens
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      
      if (type === 'recovery') {
        console.log('Recovery parameter found in URL hash');
        setIsPasswordRecovery(true);
        return true;
      }
      return false;
    };
    
    // Set up auth state listener to check for PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event detected in NewPassword:', event);
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery flow detected via auth event');
        setIsPasswordRecovery(true);
        setIsProcessingToken(false);
        
        // Clear any pending timeout since we've confirmed recovery state
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    });
    
    // Immediately check URL
    const isRecoveryInUrl = checkUrlForRecovery();
    
    // Check current session for recovery state if not found in URL
    if (!isRecoveryInUrl) {
      // Also check current session for recovery state
      supabase.auth.getSession().then(({ data: { session }}) => {
        if (session) {
          // If we have an active session in recovery state, it might not trigger the event
          console.log('Active session found, checking recovery state');
          setIsPasswordRecovery(true);
        }
        setIsProcessingToken(false);
      });
    } else {
      // If we found recovery param in URL, wait a reasonable time for auth to process
      // before concluding processing is done
      timeoutRef.current = window.setTimeout(() => {
        setIsProcessingToken(false);
      }, 1500) as unknown as number;
    }
    
    // Set a maximum timeout for processing regardless of other conditions
    // This ensures the user isn't stuck in a loading state indefinitely
    const maxTimeoutId = window.setTimeout(() => {
      setIsProcessingToken(false);
      console.log('Maximum processing time reached, forcing completion');
    }, 3000);
    
    return () => {
      // Clean up all timeouts and subscriptions
      subscription.unsubscribe();
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      clearTimeout(maxTimeoutId);
    };
  }, []);

  return { isPasswordRecovery, isProcessingToken };
};
