
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white border-t border-gray-200 pt-8 pb-20 px-4 mt-auto">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <img 
            src="https://centermoneyguard.com/upload/logo.png" 
            alt="App Profit Logo" 
            className="h-16 mx-auto" 
          />
          <div className="text-sm text-gray-600 mt-2">{t('rewards')}</div>
        </div>
        
        <div className="text-xs text-center text-gray-500">
          <p>© {new Date().getFullYear()} App Profit. {t('allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
