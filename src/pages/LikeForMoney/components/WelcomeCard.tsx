
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Star } from 'lucide-react';

interface WelcomeCardProps {
  startReview: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ startReview }) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-16 px-4 bg-gradient-to-b from-white to-orange-50">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-temu-orange/20 to-amber-500/20 rounded-full mb-6">
        <Star className="h-10 w-10 text-temu-orange" />
      </div>
      
      <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-temu-orange to-amber-500">
        {t('readyToEarnRewards')}
      </h2>
      
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {t('reviewProducts')}
      </p>
      
      <button 
        onClick={startReview} 
        className="py-3 px-8 bg-gradient-to-r from-temu-orange to-amber-500 hover:from-temu-orange/90 hover:to-amber-600 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-temu-orange focus:ring-offset-2"
      >
        {t('startReviewing')}
      </button>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-temu-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t('upTo')} $55.00 {t('daily')}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-temu-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t('secondsPerReview')}</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
