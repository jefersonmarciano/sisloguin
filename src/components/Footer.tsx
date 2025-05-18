import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-8 pb-20 px-4 mt-auto">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
            <img 
              src="../public/logo.png" 
            alt="App Profit Logo" 
            className="h-16 mx-auto brightness-90 contrast-125" 
          />
          <div className="text-sm text-gray-400 mt-2">{t('rewards')}</div>
        </div>
        
        <div className="text-xs text-center text-gray-500">
          <p>© {new Date().getFullYear()} App Profit. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
