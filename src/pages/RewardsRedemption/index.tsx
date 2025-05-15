
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DollarSign } from 'lucide-react';
import { rewardOptions } from './data/rewardOptions';
import { useRewardsRedemption } from './hooks/useRewardsRedemption';
import RewardOption from './components/RewardOption';
import WithdrawalHistory from './components/WithdrawalHistory';
import MinimumEarningsDialog from './components/MinimumEarningsDialog';
import EarningsStatus from './components/EarningsStatus';

const RewardsRedemption: React.FC = () => {
  const { t } = useLanguage();
  const {
    balance,
    selectedReward,
    amount,
    setAmount,
    showEarningsDialog,
    setShowEarningsDialog,
    hasMinimumEarnings,
    amountNeeded,
    minimumWithdrawalAmount,
    handleRewardSelect,
    handleQuickAmountClick,
    handleSubmit,
    withdrawalHistory
  } = useRewardsRedemption(rewardOptions);
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <DollarSign className="h-6 w-6 text-sisloguin-orange mr-2" />
          <h1 className="text-2xl font-bold">{t('withdrawal')}</h1>
        </div>
        <div className="flex items-center bg-sisloguin-lightGray px-3 py-1 rounded-full">
          <DollarSign className="h-4 w-4 text-sisloguin-orange mr-1" />
          <span className="text-sm font-medium">${balance.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Show earnings status */}
      <EarningsStatus 
        hasMinimumEarnings={hasMinimumEarnings}
        balance={balance}
        amountNeeded={amountNeeded}
        minimumWithdrawalAmount={minimumWithdrawalAmount}
      />
      
      {/* Select Withdrawal Method */}
      <div className="sisloguin-card mb-6">
        <h2 className="font-bold text-lg mb-4">{t('withdrawFunds')}</h2>
        
        <div className="space-y-4">
          {rewardOptions.map((option) => (
            <RewardOption
              key={option.id}
              option={option}
              selectedReward={selectedReward}
              amount={amount}
              onSelect={handleRewardSelect}
              onAmountChange={setAmount}
              onQuickAmountClick={handleQuickAmountClick}
              onSubmit={handleSubmit}
            />
          ))}
        </div>
      </div>
      
      {/* Withdrawal History */}
      <WithdrawalHistory withdrawalHistory={withdrawalHistory} />
      
      {/* Dialog for minimum earnings warning */}
      <MinimumEarningsDialog 
        open={showEarningsDialog}
        onOpenChange={setShowEarningsDialog}
        amountNeeded={amountNeeded}
        minimumWithdrawalAmount={minimumWithdrawalAmount}
      />
    </div>
  );
};

export default RewardsRedemption;
