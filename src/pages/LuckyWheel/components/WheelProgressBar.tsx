import React from 'react';
import { cn } from '../../../lib/utils';
import { useLanguage } from '../../../contexts/LanguageContext';

interface WheelProgressBarProps {
  spinsRemaining: number;
  totalSpins: number;
  className?: string;
}

const WheelProgressBar: React.FC<WheelProgressBarProps> = ({ 
  spinsRemaining, 
  totalSpins,
  className
}) => {
  const { t } = useLanguage();
  
  return (
    <div className={cn("bg-gray-800 rounded-xl shadow-md p-4 border border-gray-700 hover:shadow-lg transition-all duration-300", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg bg-gradient-to-r from-temu-orange to-amber-500 bg-clip-text text-transparent">{t('todaysSpins')}</h2>
        <div className="text-sm bg-gradient-to-r from-temu-orange/20 to-amber-500/20 py-1 px-3 rounded-full text-temu-orange font-medium animate-pulse">
          {spinsRemaining}/{totalSpins} {t('remaining')}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-temu-orange to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${(spinsRemaining / totalSpins) * 100}%` }}
            role="progressbar"
            aria-valuenow={spinsRemaining}
            aria-valuemin={0}
            aria-valuemax={totalSpins}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-300">
        <div>{t('earnPerSpin')}</div>
        <div>{t('potentialEarningsDaily')}</div>
      </div>
    </div>
  );
};

export default WheelProgressBar;
