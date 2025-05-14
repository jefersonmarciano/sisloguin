
import { useState } from 'react';
import { User } from '../types/auth';
import { useProfileUpdate } from './user-profile/useProfileUpdate';
import { useActivityTracking } from './user-profile/useActivityTracking';
import { useDailyReset } from './user-profile/useDailyReset';

export const useUserProfile = (user: User | null, setUser: (user: User | null) => void) => {
  const [loading, setLoading] = useState<boolean>(false);

  // Import functionality from smaller hooks
  const { updateUserProfile, updateUserAvatar, changePassword } = useProfileUpdate(user, setUser);
  const { updateBalance, completeReview, useWheel } = useActivityTracking(user, setUser);
  const { checkAndResetReviews } = useDailyReset(user, setUser);

  return {
    // Profile update functions
    updateUserProfile,
    updateUserAvatar,
    changePassword,
    
    // Activity tracking functions
    updateBalance,
    completeReview,
    useWheel,
    
    // Daily reset function
    checkAndResetReviews,
    
    // Loading state
    loading
  };
};
