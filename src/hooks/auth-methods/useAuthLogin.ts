
// This file is kept for backward compatibility
// It now imports and re-exports methods from useAuthUI
import { ExtendedUser, AuthResponse } from '@/types/auth';
import { useAuthService } from '../useAuthService';
import { toast } from '@/components/ui/use-toast';

export const useAuthLogin = (
  user: ExtendedUser | null,
  setUser: (user: ExtendedUser | null) => void,
  setIsAuthenticated: (value: boolean) => void
) => {
  const { login: authServiceLogin } = useAuthService();

  // Login wrapper with improved error handling
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const result = await authServiceLogin(email, password);
      
      // Return type changed to void, no need to return data
      // Let onAuthStateChange handle the state updates
    } catch (error: any) {
      // Error handling is now handled in useAuthUI
      // This is kept for backward compatibility
      throw error;
    }
  };

  return { login };
};
