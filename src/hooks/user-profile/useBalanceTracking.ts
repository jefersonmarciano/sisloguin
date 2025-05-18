
import { useCallback } from 'react';
import { User } from '../../types/auth';
import { updateUserProfileData } from '../../utils/authUtils';

export const useBalanceTracking = (user: User | null, setUser: (user: User | null) => void) => {
  // Update user balance
  const updateBalance = useCallback(async (amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        balance: user.balance + amount
      };
      
      setUser(updatedUser);
      await updateUserProfileData(user.id, { balance: updatedUser.balance });
    }
  }, [user, setUser]);

  return { updateBalance };
};
