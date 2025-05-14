import React, { createContext, useContext, ReactNode, useEffect, useCallback } from 'react';
import { useAuthState } from '../hooks/auth-state';
import { useAuthMethods } from '../hooks/auth-methods';
import { User, AuthContextType } from '../types/auth';

// Export the AuthContext directly so it can be imported without causing circular dependencies
export const AuthContext = createContext<AuthContextType | null>(null);

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
    resetPassword,
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
    // Always define the effect function, but conditionally execute logic inside
    const checkReviews = () => {
      if (user) {
        checkAndResetReviews();
      }
    };
    
    checkReviews();
    // Include checkAndResetReviews in dependencies to avoid lint warnings
  }, [user, checkAndResetReviews]);

  // Custom Logout that redirects to the logout page
  const customLogout = useCallback(async () => {
    // Não alterar estados aqui - apenas redirecionar
    window.location.href = '/logout';
    // Retorna uma Promise para satisfazer a assinatura do método
    return Promise.resolve();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        login: login,
        signup: register,
        logout: customLogout,
        resetPassword: resetPassword,
        updateBalance: updateBalance,
        completeReview: completeReview,
        checkAndResetReviews: checkAndResetReviews,
        useWheel: useWheel,
        updateUserAvatar: updateUserAvatar,
        updateUserProfile: updateUserProfile,
        changePassword: changePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Re-export useAuth from the AuthContext module to maintain compatibility
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
