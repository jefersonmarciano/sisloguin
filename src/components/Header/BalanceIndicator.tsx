
import React from 'react';
import { DollarSign } from 'lucide-react';

interface BalanceIndicatorProps {
  balance: number;
}

const BalanceIndicator: React.FC<BalanceIndicatorProps> = ({ balance }) => {
  return (
    <div className="hidden md:flex items-center bg-sisloguin-lightGray px-2 py-1 rounded-full">
      <DollarSign className="h-3 w-3 text-sisloguin-orange" />
      <span className="text-xs font-medium">${balance.toFixed(2)}</span>
    </div>
  );
};

export default BalanceIndicator;
