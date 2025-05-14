
// This file is kept for backward compatibility
// It now imports and re-exports methods from useAuthUI
import { ExtendedUser } from '@/types/auth';
import { useAuthService } from '../useAuthService';

export const useAuthRegister = (
  user: ExtendedUser | null,
  setUser: (user: ExtendedUser | null) => void,
  setIsAuthenticated: (value: boolean) => void
) => {
  const { register: authServiceRegister } = useAuthService();

  // Register wrapper
  const register = async (email: string, password: string, name?: string): Promise<void> => {
    try {
      await authServiceRegister(email, password, name);
      // No need to manually update state here - onAuthStateChange will handle it
    } catch (error: any) {
      // Error handling is now handled in useAuthUI
      // This is kept for backward compatibility
      throw error;
    }
  };

  return { register };
};
