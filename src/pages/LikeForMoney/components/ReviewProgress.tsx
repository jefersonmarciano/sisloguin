import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useAuth } from '../../../contexts/AuthContext';

export const ReviewProgress: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const reviewsCompleted = user?.likeReviewsCompleted || 0;
  const maxReviews = 10;
  const progressPercentage = (reviewsCompleted / maxReviews) * 100;
  
  return (
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div 
        className="bg-temu-orange h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${progressPercentage}%` }}
      />
    </div>
  );
}; 