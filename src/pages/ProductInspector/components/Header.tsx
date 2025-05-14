
import React from 'react';
import { AlertTriangle, DollarSign } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface HeaderProps {
  balance: number;
}

const Header: React.FC<HeaderProps> = ({ balance }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex items-center mb-4 md:mb-0">
        <AlertTriangle className="h-6 w-6 text-temu-orange mr-2" />
        <h1 className="text-2xl font-bold">{t('productInspector')}</h1>
      </div>
      <div className="flex items-center">
        <DollarSign className="h-5 w-5 text-temu-orange" />
        <span className="font-medium">${balance.toFixed(2) || '0.00'}</span>
      </div>
    </div>
  );
};

export default Header;
