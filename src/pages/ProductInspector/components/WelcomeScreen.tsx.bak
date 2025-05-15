
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface WelcomeScreenProps {
  onStartInspection: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartInspection }) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-10">
      <h2 className="text-2xl font-bold mb-4">{t('becomeProductInspector')}</h2>
      <p className="text-gray-600 mb-6">
        {t('helpMakeMarketplaceSafer')}
      </p>
      <button 
        onClick={onStartInspection} 
        className="temu-button font-mono font-semibold tracking-wide"
      >
        {t('startInspecting')}
      </button>
    </div>
  );
};

export default WelcomeScreen;
