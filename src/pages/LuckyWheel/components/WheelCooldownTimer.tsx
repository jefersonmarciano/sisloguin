import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import BaseCooldownTimer from '../../../components/cooldown/BaseCooldownTimer';

interface WheelCooldownTimerProps {
  endTime: Date;
  onComplete: () => void;
}

const WheelCooldownTimer: React.FC<WheelCooldownTimerProps> = ({ endTime, onComplete }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <BaseCooldownTimer
      endTime={endTime}
      onComplete={onComplete}
      title={t('dailyLimitReached')}
      description={t('wheelLimitDescription')}
      showBackButton={true}
      onBackClick={() => navigate("/")}
    />
  );
};

export default WheelCooldownTimer;