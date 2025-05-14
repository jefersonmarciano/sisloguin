
import { useState } from 'react';
import { User } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';
import { useAuthService } from './useAuthService';

/**
 * Hook that provides authentication UI methods with feedback
 */
export const useAuthUI = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (value: boolean) => void
) => {
  const authService = useAuthService();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  /**
   * Register with feedback
   */
  const register = async (email: string, password: string, name?: string): Promise<void> => {
    try {
      setIsProcessing(true);
      await authService.register(email, password, name);
      
      toast({
        title: 'Registration successful',
        description: 'Welcome to App Profit!'
      });
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
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Login with feedback
   */
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsProcessing(true);
      await authService.login(email, password);
      
      toast({
        title: 'Login successful',
        description: `Welcome back!`
      });
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
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Logout with feedback
   */
  const logout = async (): Promise<void> => {
    try {
      setIsProcessing(true);
      await authService.logout();
      
      // Let onAuthStateChange handle the state updates
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.'
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        variant: 'destructive',
        title: 'Logout Error',
        description: 'There was a problem signing out. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Reset password with feedback
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      setIsProcessing(true);
      const result = await authService.resetPassword(email);
      
      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Password Reset Failed',
          description: result.error || 'Failed to send reset link. Please try again.'
        });
        return;
      }
      
      toast({
        title: 'Password Reset Link Sent',
        description: 'Check your email for a link to reset your password.'
      });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      toast({
        variant: 'destructive',
        title: 'Password Reset Failed',
        description: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Update password with feedback
   */
  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      setIsProcessing(true);
      const result = await authService.updatePassword(password);
      
      if (!result.success) {
        toast({
          variant: 'destructive',
          title: 'Password Update Failed',
          description: result.error || 'Failed to update password. Please try again.'
        });
        return false;
      }
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.'
      });
      
      return true;
    } catch (error) {
      console.error("Error in updatePassword:", error);
      toast({
        variant: 'destructive',
        title: 'Password Update Failed',
        description: 'An unexpected error occurred. Please try again.'
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    register,
    login,
    logout,
    resetPassword,
    updatePassword,
    isProcessing
  };
};
