import React, { useState, useEffect, useRef } from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface BaseCooldownTimerProps {
  endTime: Date; // <-- Now using this instead of hoursToWait
  onComplete: () => void;
  title?: string;
  description?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const BaseCooldownTimer: React.FC<BaseCooldownTimerProps> = ({
  endTime,
  onComplete,
  title,
  description,
  showBackButton = false,
  onBackClick
}) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateTimer = () => {
    const now = new Date().getTime();
    const target = endTime.getTime();
    const diff = target - now;

    if (diff <= 0) {
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      if (intervalRef.current) clearInterval(intervalRef.current);
      onComplete();
      return;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setTimeLeft({ hours, minutes, seconds });
  };

  useEffect(() => {
    updateTimer(); // Set immediately
    intervalRef.current = setInterval(updateTimer, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endTime, onComplete]);

  const totalSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const maxSeconds = Math.max(1, Math.floor((endTime.getTime() - Date.now()) / 1000) + totalSeconds); // Avoid div by 0
  const progressPercentage = Math.max(0, 100 - (totalSeconds / maxSeconds) * 100);

  return (
    <div className="p-8 flex flex-col items-center bg-gray-800/50 border border-gray-700 rounded-lg">
      <div className="bg-orange-900/20 h-24 w-24 rounded-full flex items-center justify-center mb-6 border border-orange-700/50">
        <Clock className="h-12 w-12 text-orange-400" />
      </div>

      <h2 className="text-xl font-bold mb-2 text-gray-100">{title || t('dailyLimitReached')}</h2>
      <p className="text-gray-400 mb-8 text-center">
        {description || t('dailyLimitDescription')}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-xs">
        <div className="bg-gray-700 rounded-lg p-3 text-center border border-gray-600">
          <span className="block text-2xl font-bold text-gray-100">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-xs text-gray-400">{t('hours')}</span>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center border border-gray-600">
          <span className="block text-2xl font-bold text-gray-100">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-xs text-gray-400">{t('minutes')}</span>
        </div>
        <div className="bg-gray-700 rounded-lg p-3 text-center border border-gray-600">
          <span className="block text-2xl font-bold text-gray-100">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-xs text-gray-400">{t('seconds')}</span>
        </div>
      </div>

      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden border border-gray-600">
        <div
          className="h-full bg-orange-500 transition-all duration-1000"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {showBackButton && onBackClick && (
        <button
          className="mt-8 flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-700 text-gray-100"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
        </button>
      )}
    </div>
  );
};

export default BaseCooldownTimer;
