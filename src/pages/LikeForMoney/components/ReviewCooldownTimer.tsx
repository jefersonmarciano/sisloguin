import React from 'react';
import CooldownTimer from '@/components/common/CooldownTimer';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReviewCooldownTimerProps {
  hoursToWait: number;
  onComplete: () => void;
  debug?: boolean;
}

const ReviewCooldownTimer: React.FC<ReviewCooldownTimerProps> = ({ hoursToWait, onComplete, debug = false }) => {
  const { t } = useLanguage();
  
  return (
    <CooldownTimer
      hoursToWait={hoursToWait}
      onComplete={onComplete}
      storageKey="likeCooldownEnd"
      dbField="last_like_review"
      dbCooldownEndField="like_cooldown_end"
      title={t('dailyLimitReached')}
      message={`${t('youveCompletedAllReviews')}!`}
      color="temu-orange"
      debug={debug}
    />
  );
};

export default ReviewCooldownTimer;
