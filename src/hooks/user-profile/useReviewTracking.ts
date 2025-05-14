
import { useCallback } from 'react';
import { User } from '../../types/auth';
import { updateUserProfileData } from '@/utils/auth';

export const useReviewTracking = (user: User | null, setUser: (user: User | null) => void) => {
  // Record completed review
  const completeReview = useCallback(async (type: 'like' | 'inspector') => {
    if (user) {
      const updatedUser = { ...user };
      updatedUser.reviewsCompleted += 1;
      
      if (type === 'like') {
        updatedUser.likeReviewsCompleted += 1;
      } else if (type === 'inspector') {
        updatedUser.inspectorReviewsCompleted += 1;
      }
      
      setUser(updatedUser);
      await updateUserProfileData(user.id, { 
        reviewsCompleted: updatedUser.reviewsCompleted,
        likeReviewsCompleted: updatedUser.likeReviewsCompleted,
        inspectorReviewsCompleted: updatedUser.inspectorReviewsCompleted 
      });
    }
  }, [user, setUser]);

  return { completeReview };
};
