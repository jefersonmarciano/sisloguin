
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Transaction } from '../types';
import { useLanguage } from '../../../contexts/LanguageContext';

interface WithdrawalHistoryProps {
  withdrawalHistory: Transaction[];
}

const WithdrawalHistory: React.FC<WithdrawalHistoryProps> = ({ withdrawalHistory }) => {
  const { t } = useLanguage();
  
  return (
    <div className="sisloguin-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{t('withdrawalHistory')}</h2>
        <a href="#" className="text-sisloguin-orange flex items-center text-sm">
          {t('viewAll')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      <div className="space-y-4">
        {withdrawalHistory.length > 0 ? (
          withdrawalHistory.slice(0, 5).map(withdrawal => (
            <div key={withdrawal.id} className="p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{t('withdrawal')}</p>
                  <p className="text-sm text-gray-500">{new Date(withdrawal.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-blue-600">${Math.abs(withdrawal.amount).toFixed(2)}</p>
                  <p className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full inline-block">
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            {t('noWithdrawalHistory')}
          </div>
        )}
      </div>
    </div>
  );
};

export default WithdrawalHistory;
