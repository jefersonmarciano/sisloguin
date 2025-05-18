import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';
import { syncUserProfileFromSession } from '@/utils/auth';
import { toast } from '@/components/ui/use-toast';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const authStateChangeInProgress = useRef(false);

  const refreshUserProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
      const freshProfile = await syncUserProfileFromSession(session.user);
      if (freshProfile) {
        if (freshProfile.lastReviewReset) {
          freshProfile.lastReviewReset = new Date(freshProfile.lastReviewReset);
        }
        setUser(freshProfile);
        setIsAuthenticated(true);
        console.log('[useAuthState] Profile refreshed from Supabase');
      }
    }
  }, []);

  useEffect(() => {
    console.log('Setting up auth state and listeners...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event detected:', event, session?.user?.id);

        if (authStateChangeInProgress.current) {
          console.log('Auth state change already in progress, skipping...');
          return;
        }

        try {
          authStateChangeInProgress.current = true;

          setTimeout(async () => {
            if (session?.user) {
              const userProfile = await syncUserProfileFromSession(session.user);
              if (userProfile) {
                if (userProfile.lastReviewReset) {
                  userProfile.lastReviewReset = new Date(userProfile.lastReviewReset);
                }

                setUser(userProfile);
                setIsAuthenticated(true);
                console.log('[useAuthState] User authenticated, profile loaded:', userProfile);
              }
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              setIsAuthenticated(false);
              console.log('[useAuthState] User signed out');
            }
          }, 0);
        } finally {
          authStateChangeInProgress.current = false;
        }
      }
    );

    const loadInitialSession = async () => {
      try {
        setIsInitializing(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const userProfile = await syncUserProfileFromSession(session.user);
          if (userProfile) {
            if (userProfile.lastReviewReset) {
              userProfile.lastReviewReset = new Date(userProfile.lastReviewReset);
            }

            setUser(userProfile);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'Failed to initialize authentication. Please try again.'
        });
      } finally {
        setIsInitializing(false);
      }
    };

    loadInitialSession();

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, [refreshUserProfile]);

  return {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isInitializing,
    refreshUserProfile
  };
};