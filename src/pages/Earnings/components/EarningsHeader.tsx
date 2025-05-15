
import React from 'react';
import { DollarSign } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

const EarningsHeader: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <DollarSign className="h-6 w-6 text-sisloguin-orange mr-2" />
        <h1 className="text-2xl font-bold">{t('earnings')}</h1>
      </div>
      <div className="text-sm text-gray-500">
        {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default EarningsHeader;
