
import { useCallback } from 'react';
import { User } from '../../types/auth';
import { supabase } from '../../lib/supabase';
import { updateUserProfileData } from '@/utils/auth';

export const useProfileAvatar = (user: User | null, setUser: (user: User | null) => void) => {
  // Update user avatar in Supabase and locally
  const updateUserAvatar = useCallback(async (avatarUrl: string): Promise<boolean> => {
    try {
      if (!user) return false;
      
      // Use default avatar if empty string is provided
      const finalAvatarUrl = avatarUrl || 'https://i.pravatar.cc/150?u=' + user.id;
      
      // Try to update Supabase user metadata for avatar
      try {
        const { data, error } = await supabase.auth.updateUser({
          data: { avatar_url: finalAvatarUrl }
        });
        
        if (error) {
          console.warn("Avatar update in auth metadata failed:", error);
          // Continue anyway - we'll still update the local user and profiles table
        }
      } catch (err) {
        console.warn("Avatar update in auth metadata error:", err);
        // Continue anyway - we'll still update the local user and profiles table
      }
      
      // Update the user state, profiles table, and localStorage regardless of Supabase auth success
      const updatedUser = {
        ...user,
        avatar: finalAvatarUrl
      };
      
      setUser(updatedUser);
      return await updateUserProfileData(user.id, { avatar: finalAvatarUrl });
      
    } catch (error) {
      console.error("Error updating avatar:", error);
      return false;
    }
  }, [user, setUser]);

  return { updateUserAvatar };
};
