
import { User } from '@/types/auth';
import { useUserActions } from '../useUserActions';
import { toast } from '@/components/ui/use-toast';

export const useAuthLogin = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void
) => {
  const { login: userLogin } = useUserActions();

  // Login wrapper with improved error handling
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const userProfile = await userLogin(email, password);
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
        localStorage.setItem('temuUser', JSON.stringify(userProfile));
        toast({
          title: 'Login successful',
          description: `Welcome back, ${userProfile.fullName || userProfile.email}!`
        });
      }
    } catch (error: any) {
      let errorMessage = 'Login failed. Please check your credentials and try again.';
      
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Invalid email or password.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many login attempts. Please try again later.';
      }
      
      console.error('Login error:', error);
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage
      });
      
      throw error;
    }
  };

  return { login };
};
