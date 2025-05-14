
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface EarningsStatusProps {
  hasMinimumEarnings: boolean;
  balance: number;
  amountNeeded: number;
  minimumWithdrawalAmount: number;
}

const EarningsStatus: React.FC<EarningsStatusProps> = ({
  hasMinimumEarnings,
  balance,
  amountNeeded,
  minimumWithdrawalAmount
}) => {
  const { t } = useLanguage();

  return (
    <div className={`mb-4 p-4 rounded-lg ${hasMinimumEarnings ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
      <div className="font-medium">
        {hasMinimumEarnings 
          ? t('eligibleForWithdrawal')
          : t('earnMore')}
      </div>
      <div className="text-sm mt-1">
        {hasMinimumEarnings 
          ? t('earnedSoFar').replace('${balance}', `$${balance.toFixed(2)}`)
          : t('needMoreToUnlock')
              .replace('${amount}', `$${amountNeeded.toFixed(2)}`)
              .replace('${minimum}', `$${minimumWithdrawalAmount.toFixed(2)}`)
              .replace('${balance}', `$${balance.toFixed(2)}`)}
      </div>
    </div>
  );
};

export default EarningsStatus;
