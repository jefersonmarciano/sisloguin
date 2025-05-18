
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Profile } from '@/types/supabase';

export const useDailyReset = () => {
  const { user, setUser } = useAuth();
  const resetInProgress = useRef(false);
  const lastResetCheck = useRef<number>(0);

  const checkAndResetReviews = async () => {
    // Verifica se o user existe e está devidamente inicializado
    console.log('[useDailyReset] User:', user);

  }
  return {
    checkAndResetReviews
  };
};
