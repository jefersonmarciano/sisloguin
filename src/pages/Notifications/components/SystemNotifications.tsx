import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

const SystemNotifications: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="temu-card bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="h-5 w-5 text-temu-orange" />
        <h2 className="font-medium">{t('recentNotifications')}</h2>
      </div>
      
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-100">{t('newRewardEarned')}</h3>
                <Badge variant="default" className="bg-temu-orange text-[10px]">{t('new')}</Badge>
              </div>
              <p className="text-xs text-gray-400 mt-1">{t('earnedFromLuckyWheel')}</p>
            </div>
            <span className="text-[10px] text-gray-400">{t('hoursAgo')}</span>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-100">{t('reviewCompleted')}</h3>
              <p className="text-xs text-gray-400 mt-1">{t('productReviewApproved')}</p>
            </div>
            <span className="text-[10px] text-gray-400">{t('dayAgo')}</span>
          </div>
        </div>
        
        <div className="p-3 rounded-lg bg-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-100">{t('dailyTaskReminder')}</h3>
              <p className="text-xs text-gray-400 mt-1">{t('dontForgetDailyTasks')}</p>
            </div>
            <span className="text-[10px] text-gray-400">{t('daysAgo')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemNotifications;
