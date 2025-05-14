
import { useCallback } from 'react';
import { User } from '../../types/auth';
import { supabase } from '../../lib/supabase';
import { updateUserProfileData } from '@/utils/auth';

export const useProfileName = (user: User | null, setUser: (user: User | null) => void) => {
  // Update user profile information in Supabase and locally
  const updateUserProfile = useCallback(async (name: string, email: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      let success = true;
      let updatedUser = { ...user };
      
      // Only update email if it has changed
      if (email !== user.email) {
        try {
          const { data, error } = await supabase.auth.updateUser({
            email: email
          });
          
          if (error) {
            console.warn("Email update failed:", error);
            // Continue with other updates even if email update fails
          } else {
            updatedUser.email = email;
          }
        } catch (err) {
          console.warn("Email update error:", err);
          // Continue with other updates even if email update fails
        }
      }
      
      // Update user metadata with the name
      try {
        const { data: metaData, error: metaError } = await supabase.auth.updateUser({
          data: { name: name }
        });
        
        if (metaError) {
          console.warn("Name update in metadata failed:", metaError);
        }
      } catch (err) {
        console.warn("Name update in metadata error:", err);
      }
      
      // Always update name in our local user object
      updatedUser.name = name;
      
      // Update the profile in the profiles table and localStorage
      setUser(updatedUser);
      return await updateUserProfileData(user.id, { name, email: updatedUser.email });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  }, [user, setUser]);

  return { updateUserProfile };
};
