
// This file is kept for backward compatibility
// It now imports and re-exports methods from useAuthUI
import { useState } from 'react';
import { useAuthService } from '../useAuthService';

export const useAuthLogout = (
  user: any,
  setUser: (user: any) => void,
  setIsAuthenticated: (value: boolean) => void
) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { logout: authServiceLogout } = useAuthService();

  // Changed method name from logoutAndCleanLocalData to logout for consistency
  const logout = async () => {
    try {
      setLoading(true);
      
      await authServiceLogout();
      // Let onAuthStateChange handle the state updates
      
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading
  };
};
