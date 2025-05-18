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
          className="w-full h-64 object-contain rounded-lg mx-auto bg-gray-800/50 p-2"
        />
      </div>
      
      {/* Title second */}
      <div className="text-center w-full">
        <h2 className="font-bold text-xl text-gray-100">{product.name}</h2>
        <div className="text-sm font-medium bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full inline-block mt-2 border border-emerald-500/30">
          ${product.price.toFixed(2)}
        </div>
      </div>
      
      {/* Description third */}
      <div className="text-center w-full max-w-md">
        <p className="font-medium mb-1 text-gray-200">{t('productDescription')}</p>
        <p className="text-gray-400">{product.description}</p>
      </div>
      
      {/* Product-specific question and textarea */}
      <div className="space-y-3 w-full max-w-md">
        <p className="font-medium text-center text-gray-200">{product.question || t('safetyQuestion')}</p>
        <textarea
          className={`w-full h-32 p-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-100 placeholder-gray-500
            ${error ? 'border-red-500/50' : 'border-gray-700'}`}
          placeholder={t('enterSafetyConcerns')}
          value={concerns}
          onChange={(e) => setConcerns(e.target.value)}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-between text-xs">
          <span className={concerns.length < 50 ? "text-red-400" : "text-emerald-400"}>
            {concerns.length}/50 {t('charactersMinimum')}
          </span>
          <span className={concerns.length < 50 ? "text-gray-500" : "text-emerald-400 font-medium"}>
            {concerns.length < 50 ? t('keepWriting') : t('sufficientDetail')}
          </span>
        </div>
      </div>
      
      {/* Buttons */}
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3 w-full max-w-md`}>
        <button 
          onClick={() => validateAndSubmit(onSafe)}
          className={`${isMobile ? 'w-full' : 'flex-1'} px-6 py-2.5 rounded-lg font-medium transition-all duration-200
            bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30
            hover:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/50`}
        >
          {t('safe')}
        </button>
        <button 
          onClick={() => validateAndSubmit(onRequiresAttention)}
          className={`${isMobile ? 'w-full' : 'flex-1'} px-6 py-2.5 rounded-lg font-medium transition-all duration-200
            bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30
            hover:border-orange-500/50 focus:ring-2 focus:ring-orange-500/50`}
        >
          {t('requiresAttention')}
        </button>
      </div>
    </div>
  );
};

export default ProductInspectionForm;
