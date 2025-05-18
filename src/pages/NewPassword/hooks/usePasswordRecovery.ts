import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePasswordRecovery = () => {
  const [isPasswordRecovery, setIsPasswordRecovery] = useState<boolean>(false);
  const [isProcessingToken, setIsProcessingToken] = useState<boolean>(true);

  useEffect(() => {
    console.log('NewPassword component mounted, checking for recovery state');
    setIsProcessingToken(true);
    
    const checkUrlForRecovery = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      const errorCode = hashParams.get('error_code');
      
      if (errorCode === 'otp_expired') {
        console.log('Recovery link expired');
        setIsPasswordRecovery(false);
        return false;
      }
      
      if (type === 'recovery') {
        console.log('Recovery parameter found in URL hash');
        setIsPasswordRecovery(true);
        return true;
      }
      return false;
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event detected in NewPassword:', event);
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery flow detected via auth event');
        setIsPasswordRecovery(true);
        setIsProcessingToken(false);
      }
    });
    
    if (!checkUrlForRecovery()) {
      supabase.auth.getSession().then(({ data: { session }}) => {
        if (session) {
          console.log('Active session found, checking recovery state');
          setIsPasswordRecovery(true);
        }
        setIsProcessingToken(false);
      });
    } else {
      setTimeout(() => {
        setIsProcessingToken(false);
      }, 1000);
    }
    
    const timeout = setTimeout(() => {
      setIsProcessingToken(false);
    }, 3000);
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return { isPasswordRecovery, isProcessingToken };
};
