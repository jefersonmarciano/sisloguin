
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Product } from '../types';

interface ProductReviewCardProps {
  product: Product;
  handleLike: () => void;
  handleDislike: () => void;
  handleSkip: () => void;
  isMobile: boolean;
  timeRemaining: number;
}

const ProductReviewCard: React.FC<ProductReviewCardProps> = ({
  product,
  handleLike,
  handleDislike,
  handleSkip,
  isMobile,
  timeRemaining
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6 flex flex-col items-center">
        {/* Product image */}
        <div className="w-full max-w-md">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-64 object-contain rounded-lg mx-auto"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/400x300?text=Image+Not+Found";
            }}
          />
        </div>
        
        {/* Product information */}
        <div className="text-center w-full">
          <h2 className="font-bold text-xl">{product.name}</h2>
          <p className="text-2xl font-medium text-temu-orange mt-2">${product.price.toFixed(2)}</p>
        </div>
        
        {/* Product description */}
        <div className="text-center w-full max-w-md">
          <p className="text-gray-700">{product.description}</p>
        </div>
        
        {/* Review question and actions */}
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm w-full max-w-md text-center">
          <p className="font-medium text-gray-800 mb-4">{product.question}</p>
          
          {/* Timer indicator */}
          <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
            <div 
              className="bg-temu-orange h-full rounded-full transition-all duration-1000"
              style={{ width: `${(timeRemaining / 30) * 100}%` }}
            />
          </div>
          
          {/* Like/Dislike buttons */}
          <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4 mt-6`}>
            <button 
              onClick={handleLike}
              className="py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {t('like')}
            </button>
            <button 
              onClick={handleDislike}
              className="py-3 px-6 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
              </svg>
              {t('dislike')}
            </button>
          </div>
          
          {/* Skip button */}
          <button 
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline w-full text-center block mt-4 transition-colors"
          >
            {t('skipProduct')}
          </button>
        </div>

        {/* Rewards information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800 w-full max-w-md">
          <p className="font-medium">{t('rewardsText')}</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>{t('likeReward')}</li>
            <li>{t('dislikeReward')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewCard;
