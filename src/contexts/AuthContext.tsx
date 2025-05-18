
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthState } from '../hooks/useAuthState';
import { useAuthMethods } from '../hooks/useAuthMethods';
import { User, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Use hook for Supabase auth state
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    isInitializing
  } = useAuthState();

  // Use hook for auth methods
  const {
    login,
    register,
    logout,
    updateBalance,
    completeReview,
    checkAndResetReviews,
    useWheel,
    updateUserAvatar,
    updateUserProfile,
    changePassword
  } = useAuthMethods(user, setUser, setIsAuthenticated);

  // Check and reset reviews on component mount and when user changes
  useEffect(() => {
    if (user) {
      console.log('[AuthContext] User authenticated, checking daily reset');
      checkAndResetReviews();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      isInitializing,
      login,
      register,
      logout,
      updateBalance,
      completeReview,
      checkAndResetReviews,
      useWheel,
      updateUserAvatar, 
      updateUserProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
