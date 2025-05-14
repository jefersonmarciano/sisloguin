
import { useState, useEffect } from 'react';
import { useAuthInitialization } from './useAuthInitialization';
import { useAuthListener } from './useAuthListener';

/**
 * Main hook that combines authentication state management sub-hooks
 */
export const useAuthState = () => {
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isInitializing: isStateInitializing
  } = useAuthInitialization();

  // Track separate initialization state for the listener
  const [isListenerInitialized, setIsListenerInitialized] = useState<boolean>(false);

  // Setup auth listener
  const {} = useAuthListener(
    setIsListenerInitialized,
    setUser
  );

  // Combined initialization state
  const isInitializing = isStateInitializing && !isListenerInitialized;

  // Log combined state for debugging
  useEffect(() => {
    if (!isInitializing) {
      console.log('Auth state fully initialized:', { 
        authenticated: isAuthenticated,
        userId: user?.id 
      });
    }
  }, [isInitializing, isAuthenticated, user]);

  return {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isInitializing
  };
};
