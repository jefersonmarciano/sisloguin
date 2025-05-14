import React from 'react';
import CooldownTimer from '@/components/common/CooldownTimer';
import { useLanguage } from '@/contexts/LanguageContext';

interface CooldownTimerProps {
  hoursToWait: number;
  onComplete: () => void;
  debug?: boolean;
}

const ProductInspectorCooldownTimer: React.FC<CooldownTimerProps> = ({ 
  hoursToWait, 
  onComplete,
  debug = false
}) => {
  const { t } = useLanguage();
  
  return (
    <CooldownTimer
      hoursToWait={hoursToWait}
      onComplete={onComplete}
      storageKey="inspectorCooldownEnd"
      dbField="last_inspector_review"
      dbCooldownEndField="inspector_cooldown_end"
      title={t('dailyLimitReached')}
      message={t('youveCompletedAllInspections')}
      color="blue"
      debug={debug}
    />
  );
};

export default ProductInspectorCooldownTimer;
