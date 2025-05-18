
import { useState } from 'react';
import { User } from '../../types/auth';
import { useProfileName } from './useProfileName';
import { useProfileAvatar } from './useProfileAvatar';
import { useProfilePassword } from './useProfilePassword';

export const useProfileUpdate = (user: User | null, setUser: (user: User | null) => void) => {
  const [loading, setLoading] = useState<boolean>(false);
  
  const { updateUserProfile } = useProfileName(user, setUser);
  const { updateUserAvatar } = useProfileAvatar(user, setUser);
  const { changePassword } = useProfilePassword(user);

  const wrappedUpdateUserProfile = async (name: string, email: string): Promise<boolean> => {
    setLoading(true);
    try {
      return await updateUserProfile(name, email);
    } finally {
      setLoading(false);
    }
  };

  const wrappedUpdateUserAvatar = async (avatarUrl: string): Promise<boolean> => {
    setLoading(true);
    try {
      return await updateUserAvatar(avatarUrl);
    } finally {
      setLoading(false);
    }
  };

  const wrappedChangePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    try {
      return await changePassword(currentPassword, newPassword);
    } finally {
      setLoading(false);
    }
  };

  return {
    updateUserProfile: wrappedUpdateUserProfile,
    updateUserAvatar: wrappedUpdateUserAvatar,
    changePassword: wrappedChangePassword,
    loading
  };
};
