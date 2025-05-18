import { useCallback } from 'react';
import { User } from '../../types/auth';
import { updateUserProfileData } from '../../utils/authUtils';

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
      
      // Atualiza o estado local
      setUser(updatedUser);

      try {
        // Atualiza no Supabase
        await updateUserProfileData(user.id, { 
          reviewsCompleted: updatedUser.reviewsCompleted,
          likeReviewsCompleted: updatedUser.likeReviewsCompleted,
          inspectorReviewsCompleted: updatedUser.inspectorReviewsCompleted 
        });

        // Atualiza o localStorage
        const currentUser = localStorage.getItem('temuUser');
        if (currentUser) {
          const userData = JSON.parse(currentUser);
          userData.reviewsCompleted = updatedUser.reviewsCompleted;
          userData.likeReviewsCompleted = updatedUser.likeReviewsCompleted;
          userData.inspectorReviewsCompleted = updatedUser.inspectorReviewsCompleted;
          localStorage.setItem('temuUser', JSON.stringify(userData));
        }
      } catch (error) {
        console.error('[useReviewTracking] Erro ao atualizar progresso:', error);
      }
    }
  }, [user, setUser]);

  return { completeReview };
};
