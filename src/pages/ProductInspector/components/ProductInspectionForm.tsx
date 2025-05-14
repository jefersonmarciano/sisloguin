
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useIsMobile } from '../../../hooks/use-mobile';

interface ProductInspectionFormProps {
  product: Product;
  onSafe: () => void;
  onRequiresAttention: () => void;
}

const ProductInspectionForm: React.FC<ProductInspectionFormProps> = ({ 
  product, 
  onSafe, 
  onRequiresAttention 
}) => {
  const { t } = useLanguage();
  const [concerns, setConcerns] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Reset error when concerns change
  useEffect(() => {
    if (concerns.length >= 50 || concerns.length === 0) {
      setError(null);
    }
  }, [concerns]);

  const validateAndSubmit = (handler: () => void) => {
    if (concerns.length < 50) {
      setError(t('pleaseEnterAtLeast50Characters'));
      return;
    }
    handler();
  };

  return (
    <div className="space-y-6 flex flex-col items-center">
      {/* Image first */}
      <div className="w-full max-w-md">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-contain rounded-lg mx-auto"
        />
      </div>
      
      {/* Title second */}
      <div className="text-center w-full">
        <h2 className="font-bold text-xl">{product.name}</h2>
        <div className="text-sm font-medium bg-temu-lightGray px-3 py-1 rounded-full inline-block mt-2">
          ${product.price.toFixed(2)}
        </div>
      </div>
      
      {/* Description third */}
      <div className="text-center w-full max-w-md">
        <p className="font-medium mb-1">{t('productDescription')}</p>
        <p className="text-gray-600">{product.description}</p>
      </div>
      
      {/* Product-specific question and textarea */}
      <div className="space-y-3 w-full max-w-md">
        <p className="font-medium text-center">{product.question || t('safetyQuestion')}</p>
        <textarea
          className={`w-full h-32 p-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-temu-orange focus:border-transparent`}
          placeholder={t('enterSafetyConcerns')}
          value={concerns}
          onChange={(e) => setConcerns(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-between text-xs">
          <span className={concerns.length < 50 ? "text-red-500" : "text-green-600"}>
            {concerns.length}/50 {t('charactersMinimum')}
          </span>
          <span className={concerns.length < 50 ? "text-gray-400" : "text-green-600 font-medium"}>
            {concerns.length < 50 ? t('keepWriting') : t('sufficientDetail')}
          </span>
        </div>
      </div>
      
      {/* Buttons */}
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 w-full max-w-md`}>
        <button 
          onClick={() => validateAndSubmit(onSafe)}
          className={`temu-button ${isMobile ? 'w-full' : 'flex-1'} bg-green-500 hover:bg-green-600 font-mono font-semibold tracking-wide`}
        >
          {t('safe')}
        </button>
        <button 
          onClick={() => validateAndSubmit(onRequiresAttention)}
          className={`temu-button ${isMobile ? 'w-full' : 'flex-1'} bg-amber-500 hover:bg-amber-600 font-mono font-semibold tracking-wide`}
        >
          {t('requiresAttention')}
        </button>
      </div>
    </div>
  );
};

export default ProductInspectionForm;
