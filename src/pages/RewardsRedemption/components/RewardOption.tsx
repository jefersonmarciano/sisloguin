
import React from 'react';
import { RewardOption as RewardOptionType } from '../types';
import { useLanguage } from '../../../contexts/LanguageContext';

interface RewardOptionProps {
  option: RewardOptionType;
  selectedReward: string | null;
  amount: string;
  onSelect: (id: string) => void;
  onAmountChange: (value: string) => void;
  onQuickAmountClick: (quickAmount: number, e: React.MouseEvent) => void;
  onSubmit: (e: React.MouseEvent) => void;
}

const RewardOption: React.FC<RewardOptionProps> = ({
  option,
  selectedReward,
  amount,
  onSelect,
  onAmountChange,
  onQuickAmountClick,
  onSubmit
}) => {
  const { t } = useLanguage();
  
  // Add a click handler for the input field to prevent event bubbling
  const handleInputClick = (e: React.MouseEvent) => {
    // Stop event from bubbling up to parent (which would toggle selection)
    e.stopPropagation();
  };
  
  const quickAmounts = [5, 10, 20, 50];
  
  // Get translated option type and description based on option.type
  const getTranslatedOptionType = () => {
    if (option.type === 'PayPal') return t('paypal');
    if (option.type === 'Amazon Gift Card') return t('amazonGiftCard');
    if (option.type === 'App Profit Gift Card') return t('appProfitGiftCard');
    return option.type;
  };
  
  const getTranslatedOptionDescription = () => {
    if (option.type === 'PayPal') return t('paypalDescription');
    if (option.type === 'Amazon Gift Card') return t('amazonGiftCardDescription');
    if (option.type === 'App Profit Gift Card') return t('appProfitGiftCardDescription');
    return option.description;
  };
  
  return (
    <div 
      key={option.id}
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedReward === option.id ? 'border-sisloguin-orange bg-orange-50' : 'border-gray-200 hover:border-sisloguin-orange'}`}
      onClick={() => onSelect(option.id)}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img src={option.image} alt={getTranslatedOptionType()} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{getTranslatedOptionType()}</h3>
          <p className="text-sm text-gray-500">{getTranslatedOptionDescription()}</p>
        </div>
        <div className="text-sm text-gray-500">
          Min: ${option.minAmount.toFixed(2)}
        </div>
      </div>
      
      {selectedReward === option.id && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500 mb-2">{t('processing')}: {option.processingTime}</p>
          <p className="text-sm text-gray-500 font-bold mb-2">{t('minimumBalanceRequired')}: $1000.00</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('amount')} {t('withdrawal').toLowerCase()}</label>
              <div className="flex">
                <span className="flex items-center justify-center bg-gray-100 border border-gray-300 border-r-0 px-3 rounded-l-md">$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  onClick={handleInputClick} // Prevent event bubbling
                  className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sisloguin-orange"
                  placeholder={`${t('minimumBalanceRequired')} $${option.minAmount.toFixed(2)}`}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('quickSelect')}</label>
              <div className="flex space-x-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={(e) => onQuickAmountClick(quickAmount, e)} // Use the new handler with stopPropagation
                    className={`px-3 py-1 rounded-md border transition-colors ${
                      amount === quickAmount.toString() 
                        ? 'border-sisloguin-orange bg-orange-50 text-sisloguin-orange' 
                        : 'border-gray-200 hover:border-sisloguin-orange'
                    }`}
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSubmit(e);
              }}
              className="sisloguin-button w-full"
            >
              {t('withdrawal')} {amount && `$${parseFloat(amount).toFixed(2)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardOption;
