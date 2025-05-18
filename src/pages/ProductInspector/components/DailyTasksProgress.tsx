import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface DailyTasksProgressProps {
  reviewsCompleted: number;
  reviewsLimit: number;
}

const DailyTasksProgress: React.FC<DailyTasksProgressProps> = ({ 
  reviewsCompleted, 
  reviewsLimit 
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-4 border border-gray-700 mb-6 hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-100">{t('dailyTasks')}</h2>
        <div className="text-sm bg-gradient-to-r from-temu-orange/20 to-amber-500/20 py-1 px-3 rounded-full text-temu-orange font-medium">
          {reviewsCompleted}/{reviewsLimit} {t('inspectionsCompleted')}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-temu-orange to-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${(reviewsCompleted / reviewsLimit) * 100}%` }}
            role="progressbar"
            aria-valuenow={reviewsCompleted}
            aria-valuemin={0}
            aria-valuemax={reviewsLimit}
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center text-sm text-gray-400">
        <div>{t('earnPerInspection')}</div>
        <div>{t('potentialEarnings')}: {t('upTo')} $65.00 {t('daily')}</div>
      </div>
    </div>
  );
};

export default DailyTasksProgress;
