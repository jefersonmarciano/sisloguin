import { useCallback } from 'react';
import { User } from '../../types/auth';
import { supabase } from '../../lib/supabase';
import { updateUserProfileData } from '../../utils/authUtils';

export const useProfileName = (
  user: User | null,
  setUser: (user: User | null) => void,
  refreshUserProfile: () => Promise<void>
) => {
  const updateUserProfile = useCallback(
    async (name: string, email: string): Promise<boolean> => {
      try {
        if (!user) return false;

        let updatedUser = { ...user };

        // Only update email if it has changed
        if (email !== user.email) {
          const { error } = await supabase.auth.updateUser({ email });
          if (error) throw error;
          updatedUser.email = email;
        }

        // Update user metadata with name
        const { error: metaError } = await supabase.auth.updateUser({
          data: { name }
        });
        if (metaError) throw metaError;

        // Update name in local state
        updatedUser.fullName = name;
        updatedUser.name = name;

        // Update the profiles table
        console.log("Updating profile in DB:", updatedUser);
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: name })
          .eq('id', user.id);
        if (profileError) console.warn("DB update failed:", profileError);

        // Optional: update secondary source (if needed)
        await updateUserProfileData(user.id, {
          fullName: name,
          name,
          email: updatedUser.email
        });

        // Refresh full profile from Supabase
        await refreshUserProfile(user.id, setUser);

        return true;
      } catch (error) {
        console.error("Error updating profile:", error);
        return false;
      }
    },
    [user, setUser, refreshUserProfile]
  );

  return { updateUserProfile };
};
