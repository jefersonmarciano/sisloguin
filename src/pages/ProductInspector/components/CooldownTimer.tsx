import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import BaseCooldownTimer from '../../../components/cooldown/BaseCooldownTimer';

interface CooldownTimerProps {
  hoursToWait: number;
  onComplete: () => void;
}

const CooldownTimer: React.FC<CooldownTimerProps> = ({ hoursToWait = 24, onComplete }) => {
  const { t } = useLanguage();

  return (
    <BaseCooldownTimer
      hoursToWait={hoursToWait}
      onComplete={onComplete}
      title={t('dailyLimitReached')}
      description={t('inspectorLimitDescription')}
    />
  );
};

export default CooldownTimer;
