
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

export const AuthHeader: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center mb-6">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <img 
            src="https://centermoneyguard.com/upload/logo.png" 
            alt="App Profit Logo" 
            className="h-28" 
          />
        </div>
        <h2 className="mt-3 text-xl font-semibold">{t('welcomeToTemuRewards')}</h2>
        <LanguageToggle />
      </div>
    </div>
  );
};

export default AuthHeader;
