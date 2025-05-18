
import { useCallback } from 'react';
import { User } from '../../types/auth';
import { updateUserProfileData } from '../../utils/authUtils';

export const useWheelTracking = (user: User | null, setUser: (user: User | null) => void) => {
  // Record a wheel spin 
  const useWheel = useCallback(async () => {
    if (user && user.wheelsRemaining > 0) {
      const prize = Math.random() * 10; // Random prize between 0 and 10
      const updatedUser = {
        ...user,
        wheelsRemaining: user.wheelsRemaining - 1,
        balance: user.balance + prize
      };
      
      setUser(updatedUser);
      await updateUserProfileData(user.id, { 
        wheelsRemaining: updatedUser.wheelsRemaining,
        balance: updatedUser.balance 
      });
      
      return prize;
    }
    return 0;
  }, [user, setUser]);

  return { useWheel };
};
