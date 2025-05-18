
import { User } from '@/types/auth';
import { useUserActions } from '../useUserActions';
import { toast } from '@/components/ui/use-toast';

export const useAuthRegister = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void
) => {
  const { register: userRegister } = useUserActions();

  // Register wrapper with improved error handling
  const register = async (email: string, password: string, name?: string): Promise<void> => {
    try {
      const userProfile = await userRegister(email, password, name);
      if (userProfile) {
        setUser(userProfile);
        setIsAuthenticated(true);
        localStorage.setItem('temuUser', JSON.stringify(userProfile));
        toast({
          title: 'Registration successful',
          description: 'Welcome to App Profit!'
        });
      }
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.message.includes('password')) {
        errorMessage = 'Password must be at least 6 characters.';
      }
      
      console.error('Registration error:', error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage
      });
      
      throw error;
    }
  };

  return { register };
};
