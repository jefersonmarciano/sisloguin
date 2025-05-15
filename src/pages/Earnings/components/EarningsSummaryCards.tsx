
import React from 'react';
import { DollarSign } from 'lucide-react';
import { useEarnings } from '../../../contexts/EarningsContext';
import { useLanguage } from '../../../contexts/LanguageContext';

interface EarningsSummaryCardsProps {
  currentBalance: number;
  totalEarnings: number;
}

const EarningsSummaryCards: React.FC<EarningsSummaryCardsProps> = ({ 
  currentBalance,
  totalEarnings 
}) => {
  const { getEarningsByType } = useEarnings();
  const { t } = useLanguage();
  
  // Calculate total withdrawn
  const totalWithdrawn = Math.abs(getEarningsByType('withdraw'));
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="sisloguin-card">
        <h3 className="text-sm font-medium text-gray-500 mb-1">{t('currentBalance')}</h3>
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-sisloguin-orange mr-1" />
          <span className="text-2xl font-bold">{currentBalance.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="sisloguin-card">
        <h3 className="text-sm font-medium text-gray-500 mb-1">{t('totalEarned')}</h3>
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-green-500 mr-1" />
          <span className="text-2xl font-bold">{totalEarnings.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="sisloguin-card">
        <h3 className="text-sm font-medium text-gray-500 mb-1">{t('totalWithdrawn')}</h3>
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-blue-500 mr-1" />
          <span className="text-2xl font-bold">{totalWithdrawn.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default EarningsSummaryCards;
