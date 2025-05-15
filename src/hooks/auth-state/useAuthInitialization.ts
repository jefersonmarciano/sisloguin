import { useState, useEffect, useCallback, useRef } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { syncUserProfileFromSession } from '@/utils/auth';
import { toast } from '@/components/ui/use-toast';
import { useLocalStorage } from '../useLocalStorage';

/**
 * Hook for handling authentication initialization and session loading
 */
export const useAuthInitialization = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const timeoutRef = useRef<number | null>(null);
  
  // Use our custom hook for localStorage instead of direct manipulation
  const [cachedUser, setCachedUser] = useLocalStorage<User | null>('sisloguinUser', null);

  // Check for old data in 'temuUser' if no data in 'sisloguinUser'
  useEffect(() => {
    if (!cachedUser) {
      try {
        const oldUserData = localStorage.getItem('temuUser');
        if (oldUserData) {
          console.log('Found old temu user data, migrating to sisloguinUser');
          const oldUser = JSON.parse(oldUserData);
          setCachedUser(oldUser);
          // Remove old data
          localStorage.removeItem('temuUser');
        }
      } catch (e) {
        console.error('Error migrating temu user data:', e);
      }
    }
  }, [cachedUser, setCachedUser]);

  // Update user state with persistence
  const updateUser = useCallback((userData: User | null) => {
    setUser(userData);
    setIsAuthenticated(!!userData);
    setCachedUser(userData); // This will handle localStorage updates safely
  }, [setCachedUser]);

  // Load the initial session state
  useEffect(() => {
    console.log('Initializing auth state...');
    let mounted = true;

    // Set a timeout to prevent infinite loading
    timeoutRef.current = window.setTimeout(() => {
      if (mounted && isInitializing) {
        console.log('Auth initialization timeout reached, stopping initialization');
        setIsInitializing(false);
        
        // If we have a cached user, use it as fallback
        if (cachedUser) {
          try {
            console.log('Using cached user data from localStorage after timeout');
            const parsedUser = {...cachedUser};
            if (parsedUser.lastReviewReset) {
              parsedUser.lastReviewReset = new Date(parsedUser.lastReviewReset);
            }
            updateUser(parsedUser);
          } catch (e) {
            console.error('Error parsing stored user after timeout:', e);
            updateUser(null);
          }
        }
      }
    }, 5000); // 5 segundos é tempo suficiente para carregar normalmente

    const loadInitialSession = async () => {
      try {
        if (!mounted) return;
        
        // Try to get an existing Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('Found existing session:', session.user.email);
          try {
            const userProfile = await syncUserProfileFromSession(session.user);
            if (userProfile && mounted) {
              updateUser(userProfile);
            }
          } catch (error) {
            console.error('Error processing existing session:', error);
          } finally {
            if (mounted) {
              setIsInitializing(false);
            }
          }
        } else {
          // Check for cached user as fallback for offline access
          if (cachedUser && mounted) {
            try {
              // Convert lastReviewReset string back to Date object if it exists
              const parsedUser = {...cachedUser};
              if (parsedUser.lastReviewReset) {
                parsedUser.lastReviewReset = new Date(parsedUser.lastReviewReset);
              }
              
              console.log('Using cached user data from localStorage');
              updateUser(parsedUser);
            } catch (e) {
              console.error('Error parsing stored user:', e);
              updateUser(null);
            }
          } else {
            console.log('No authenticated user found');
            updateUser(null);
          }
          
          if (mounted) {
            setIsInitializing(false);
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
        if (mounted) {
          updateUser(null);
          setIsInitializing(false);
          toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'Failed to initialize authentication. Please try again.'
          });
        }
      }
    };
    
    loadInitialSession();

    // Cleanup function
    return () => {
      mounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [updateUser, cachedUser, isInitializing]);

  return {
    user,
    setUser: updateUser,
    isAuthenticated,
    setIsAuthenticated,
    isInitializing
  };
};
