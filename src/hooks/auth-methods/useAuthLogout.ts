
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAuthLogout = (
  user: any,
  setUser: (user: any) => void,
  setIsAuthenticated: (value: boolean) => void
) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Changed method to handle Promise errors properly
  const logoutAndCleanLocalData = async () => {
    try {
      setLoading(true);
      
      // Properly typed Promise construction
      await new Promise<void>((resolve, reject) => {
        const promise = supabase.auth.signOut();
        
        // Use proper Promise methods with typing
        promise
          .then(() => {
            console.log("User signed out successfully");
            resolve();
          })
          .catch(error => {
            console.error("Error during sign out:", error);
            reject(error);
          });
      });
      
      // Clear user-related data from localStorage
      localStorage.removeItem('temuUser');
      
      // Reset user state
      setUser(null);
      setIsAuthenticated(false);
      
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
      setLoading(false);
    }
  };

  return {
    logout: logoutAndCleanLocalData,
    loading
  };
};
