import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

export const AuthHeader: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center mb-8">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <img 
            src="https://centermoneyguard.com/upload/logo.png" 
            alt="App Profit Logo" 
            className="h-28 brightness-90 contrast-125" 
          />
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-gray-100">{t('welcomeToTemuRewards')}</h2>
        <div className="mt-4">
          <LanguageToggle />
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;
