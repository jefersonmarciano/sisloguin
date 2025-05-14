
import { useCallback } from 'react';
import { User } from '../../types/auth';
import { supabase } from '../../lib/supabase';

export const useProfilePassword = (user: User | null) => {
  // Change password in Supabase
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      // First try to verify the current password by signing in with it
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: user?.email || '',
          password: currentPassword
        });
        
        if (signInError) {
          throw new Error('Current password is incorrect');
        }
      } catch (error) {
        console.error("Password verification failed:", error);
        throw new Error('Current password is incorrect');
      }
      
      // If current password is correct, update to new password
      try {
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (error) throw error;
        
        console.log("Password successfully changed");
        return true;
      } catch (error) {
        console.error("Password update failed:", error);
        throw new Error('Failed to update password');
      }
    } catch (error: any) {
      console.error("Error changing password:", error);
      throw error;
    }
  }, [user]);

  return { changePassword };
};
