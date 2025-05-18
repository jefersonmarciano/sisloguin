import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface InspectionWelcomeProps {
  onStartClick: () => void;
}

const InspectionWelcome: React.FC<InspectionWelcomeProps> = ({ onStartClick }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-8 border border-gray-700 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-temu-orange/20 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-temu-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-temu-orange to-blue-500">{t('becomeProductInspector')}</h2>
      <p className="text-gray-100 mb-8 max-w-md mx-auto">
        {t('inspectProducts')}
      </p>
      <button 
        onClick={onStartClick} 
        className="py-3 px-8 bg-gradient-to-r from-temu-orange to-blue-500 hover:from-temu-orange/90 hover:to-blue-600 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-temu-orange focus:ring-offset-2"
      >
        {t('startInspecting')}
      </button>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <div className="flex items-center gap-2 text-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-temu-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{t('upTo')} $65.00 {t('daily')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-temu-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>{t('helpKeepCustomersSafe')}</span>
        </div>
      </div>
    </div>
  );
};

export default InspectionWelcome;
