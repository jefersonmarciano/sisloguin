
import { User } from '../../types/auth';
import { useBalanceTracking } from './useBalanceTracking';
import { useReviewTracking } from './useReviewTracking';
import { useWheelTracking } from './useWheelTracking';

/**
 * Custom hook that combines various user activity tracking hooks
 * to provide a unified interface for tracking user activities
 */
export const useActivityTracking = (user: User | null, setUser: (user: User | null) => void) => {
  // Initialize individual tracking hooks
  const { updateBalance } = useBalanceTracking(user, setUser);
  const { completeReview } = useReviewTracking(user, setUser);
  const { useWheel } = useWheelTracking(user, setUser);

  return {
    updateBalance,
    completeReview,
    useWheel
  };
};
