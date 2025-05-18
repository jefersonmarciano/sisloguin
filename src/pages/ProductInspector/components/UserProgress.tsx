
import React from 'react';
import ProgressBar from './ProgressBar';
import { useLanguage } from '../../../contexts/LanguageContext';

interface UserProgressProps {
  completed: number;
  limit: number;
}

const UserProgress: React.FC<UserProgressProps> = ({ completed, limit }) => {
  const { t } = useLanguage();
  
  return (
    <div className="temu-card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{t('dailyTasks')}</h2>
        <div className="text-sm text-gray-500">
          Inspections completed: {completed}/{limit}
        </div>
      </div>
      
      <div className="mb-4">
        <ProgressBar completed={completed} limit={limit} />
      </div>
    </div>
  );
};

export default UserProgress;
