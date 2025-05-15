import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface WelcomeScreenProps {
  handleSpin: () => void;
  isSpinning: boolean;
  wheelsRemaining: number;
  dailyWheelEarnings: number;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  handleSpin,
  isSpinning,
  wheelsRemaining,
  dailyWheelEarnings
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center p-8">
      <h2 className="font-bold text-xl mb-6">{t('spinTheWheel')}</h2>
      
      <div className="mt-8">
        <Button 
          onClick={handleSpin}
          disabled={isSpinning || wheelsRemaining <= 0}
          className={`py-3 px-10 bg-sisloguin-orange hover:bg-sisloguin-orange/90 text-white rounded-lg text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sisloguin-orange focus:ring-offset-2 ${isSpinning ? 'animate-pulse' : ''} ${(isSpinning || wheelsRemaining <= 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label={isSpinning ? t('wheelSpinning') : t('wheelSpinToPrizes')}
        >
          {isSpinning ? t('spinning') : t('spin')}
        </Button>
      </div>
      
      <div className="flex justify-center gap-2 my-4">
        <span className="sr-only">Spins: {wheelsRemaining}/1</span>
        {Array.from({ length: 1 }).map((_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`w-3 h-3 rounded-full ${
              i < wheelsRemaining ? "bg-[#f97316]" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      <div className="mt-4 w-full">
        <div className="flex justify-between items-center px-2">
          <span className="text-gray-500">{t('todaysWinnings')}:</span>
          <span className="font-bold text-green-500">
            ${dailyWheelEarnings.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
