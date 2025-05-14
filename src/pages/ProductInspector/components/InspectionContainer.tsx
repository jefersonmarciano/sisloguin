
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useIsMobile } from '../../../hooks/use-mobile';
import { Product } from '../types';
import ProductInspectionForm from './ProductInspectionForm';

interface InspectionContainerProps {
  currentProduct: Product | null;
  onSafe: () => void;
  onRequiresAttention: () => void;
  onSkip?: () => void;
}

const InspectionContainer: React.FC<InspectionContainerProps> = ({
  currentProduct,
  onSafe,
  onRequiresAttention,
  onSkip
}) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (!currentProduct) {
    return (
      <div className="p-4 text-center">
        <p>{t('noProductAvailable')}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <ProductInspectionForm
        product={currentProduct}
        onSafe={onSafe}
        onRequiresAttention={onRequiresAttention}
      />
    </div>
  );
};

export default InspectionContainer;
