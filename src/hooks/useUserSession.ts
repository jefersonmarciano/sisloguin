
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export function useUserSession() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [progress, setProgress] = useState<any>(null);
  const isFetchingRef = useRef(false);
  const userIdRef = useRef<string | null>(null);

  // Function to fetch progress for a specific user
  const fetchProgress = useCallback(async (userId: string) => {
    // Avoid duplicate fetches for the same user
    if (isFetchingRef.current || userId === userIdRef.current) {
      return;
    }
    
    try {
      console.log('Fetching progress for user:', userId);
      isFetchingRef.current = true;
      userIdRef.current = userId;
      
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching progress:', error.message);
        toast({
          variant: 'destructive',
          title: language === 'en' ? 'Error' : 'Erro',
          description: error.message
        });
      } else if (data) {
        console.log('Progress loaded:', data);
        setProgress(data);
      } else {
        console.log('No progress found for the user');
        setProgress({ balance: 0, theme: 'light' });
      }
    } catch (err) {
      console.error('Unexpected error fetching progress:', err);
    } finally {
      isFetchingRef.current = false;
    }
  }, [language]);

  // Function to save progress with direct Supabase access
  const saveProgress = async (newProgress: any) => {
    if (!user) {
      console.log('User not authenticated. Unable to save progress.');
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Erro',
        description: language === 'en' ? 'User not authenticated' : 'Usuário não autenticado'
      });
      return { success: false, error: 'User not authenticated' };
    }

    console.log('Saving progress for user_id:', user.id, 'Data:', newProgress);

    const { data, error } = await supabase
      .from('user_progress')
      .upsert([{ 
        user_id: user.id, 
        ...newProgress, 
        last_updated: new Date().toISOString() 
      }]);

    if (error) {
      console.error('Error saving progress:', error.message, 'Details:', error);
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Erro',
        description: error.message
      });
      return { success: false, error: error.message };
    } else {
      console.log('Progress saved successfully:', data);
      toast({
        title: language === 'en' ? 'Success' : 'Sucesso',
        description: language === 'en' ? 'Progress saved successfully' : 'Progresso salvo com sucesso'
      });
      return { success: true, data };
    }
  };

  // Load initial progress when user changes
  useEffect(() => {
    if (user?.id && user.id !== userIdRef.current) {
      fetchProgress(user.id);
    } else if (!user) {
      // Reset progress when user logs out
      setProgress({ balance: 0, theme: 'light' });
      userIdRef.current = null;
    }
  }, [user, fetchProgress]);

  return {
    progress,
    saveProgress
  };
}
