
import { useState } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export const useProfileUpdate = (user: User | null, setUser: (user: User | null) => void) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update user avatar
  const updateUserAvatar = async (avatarUrl: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      
      // Update profile avatar
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update local user state
      setUser({
        ...user,
        avatar: avatarUrl
      });

      toast({
        title: 'Avatar Updated',
        description: 'Your profile picture has been updated successfully.'
      });

      return true;
    } catch (error: any) {
      console.error('Error updating avatar:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update avatar. Please try again.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (name: string, email: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      
      // Update user email if changed
      if (email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({ email });
        if (authError) throw authError;
      }

      // Update profile name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update local user state
      setUser({
        ...user,
        name,
        email
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.'
      });

      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setIsLoading(true);
      
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) throw new Error('Current password is incorrect');

      // Then update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error changing password:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Password Change Failed',
        description: error.message || 'Failed to change password. Please try again.'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUserAvatar,
    updateUserProfile,
    changePassword,
    isLoading
  };
};
