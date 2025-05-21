import React from 'react';
import { RewardOption as RewardOptionType } from '../types';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  
  // Add a click handler for the input field to prevent event bubbling
  const handleInputClick = (e: React.MouseEvent) => {
    // Stop event from bubbling up to parent (which would toggle selection)
    e.stopPropagation();
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const amountValue = parseFloat(amount);
    
    if (amountValue < 1000) {
      toast({
        title: t('minimumAmountRequired'),
        description: t('minimumAmountRequiredDescription'),
        variant: 'destructive',
      });
      return;
    }
    
    onSubmit(e);
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
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        selectedReward === option.id 
          ? 'border-temu-orange bg-orange-900/20' 
          : 'border-gray-700 hover:border-temu-orange'
      }`}
      onClick={() => onSelect(option.id)}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img src={option.image} alt={getTranslatedOptionType()} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-100">{getTranslatedOptionType()}</h3>
          <p className="text-sm text-gray-400">{getTranslatedOptionDescription()}</p>
        </div>
        <div className="text-sm text-gray-400">
          Min: ${option.minAmount.toFixed(2)}
        </div>
      </div>
      
      {selectedReward === option.id && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400 mb-2">{t('processing')}: {option.processingTime}</p>
          <p className="text-sm text-gray-400 font-bold mb-2">{t('minimumBalanceRequired')}: $1000.00</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('amount')} {t('withdrawal').toLowerCase()}</label>
              <div className="flex">
                <span className="flex items-center justify-center bg-gray-700 border border-gray-600 border-r-0 px-3 rounded-l-md text-gray-300">$</span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => onAmountChange(e.target.value)}
                  onClick={handleInputClick} // Prevent event bubbling
                  className="flex-1 border border-gray-600 rounded-r-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-temu-orange bg-gray-700 text-gray-100 placeholder-gray-500"
                  placeholder={`${t('minimumBalanceRequired')} $${option.minAmount.toFixed(2)}`}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('quickSelect')}</label>
              <div className="flex space-x-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={(e) => onQuickAmountClick(quickAmount, e)} // Use the new handler with stopPropagation
                    className={`px-3 py-1 rounded-md border transition-colors ${
                      amount === quickAmount.toString() 
                        ? 'border-temu-orange bg-orange-900/20 text-temu-orange' 
                        : 'border-gray-600 hover:border-temu-orange text-gray-300'
                    }`}
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-temu-orange hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
