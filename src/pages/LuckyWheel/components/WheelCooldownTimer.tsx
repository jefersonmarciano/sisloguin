import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CooldownTimer from '@/components/common/CooldownTimer';
import { useLanguage } from '@/contexts/LanguageContext';

interface WheelCooldownTimerProps {
  hoursToWait: number;
  onComplete: () => void;
  debug?: boolean;
}

const WheelCooldownTimer: React.FC<WheelCooldownTimerProps> = ({ 
  hoursToWait, 
  onComplete,
  debug = false
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="relative">
      <CooldownTimer
        hoursToWait={hoursToWait}
        onComplete={onComplete}
        storageKey="wheelCooldownEnd"
        dbField="last_wheel_spin"
        dbCooldownEndField="wheel_cooldown_end"
        title={t('dailyLimitReached')}
        message={t('spinUsedForToday')}
        color="temu-orange"
        debug={debug}
      />
      
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <Button
          className="flex items-center gap-2"
          variant="outline"
          onClick={() => navigate("/")}
          aria-label="Return to dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </Button>
      </div>
    </div>
  );
};

export default WheelCooldownTimer;
