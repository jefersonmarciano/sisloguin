import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import BaseCooldownTimer from '../../../components/cooldown/BaseCooldownTimer';

interface ReviewCooldownTimerProps {
  endTime: Date;
  onComplete: () => void;
}

const ReviewCooldownTimer: React.FC<ReviewCooldownTimerProps> = ({ endTime, onComplete }) => {
  const { t } = useLanguage();

  return (
    <BaseCooldownTimer
      endTime={endTime}
      onComplete={onComplete}
      title={t('dailyLimitReached')}
      description={t('You have reached your daily limit for reviews.')}
      showBackButton={true}
    />
  );
};

export default ReviewCooldownTimer;
