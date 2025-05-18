
import React from 'react';
import { Award, DollarSign } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ProductInspectorHeaderProps {
  balance: number;
}

const ProductInspectorHeader: React.FC<ProductInspectorHeaderProps> = ({ balance }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Award className="h-7 w-7 text-temu-orange mr-2" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-temu-orange to-amber-500 bg-clip-text text-transparent">{t('productInspector')}</h1>
      </div>
      <div className="flex items-center gap-2 bg-gradient-to-r from-temu-orange/10 to-amber-500/10 py-2 px-4 rounded-full">
        <DollarSign className="h-5 w-5 text-temu-orange" />
        <span className="font-medium">${balance.toFixed(2) || '0.00'}</span>
      </div>
    </div>
  );
};

export default ProductInspectorHeader;
