
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    changeLanguage(newLanguage);
  };
  
  return (
    <button 
      onClick={toggleLanguage}
      className="mt-2 flex items-center justify-center mx-auto text-sm px-3 py-1 rounded-full border border-gray-200 hover:bg-gray-50"
    >
      <Globe className="h-3.5 w-3.5 mr-1.5" />
      <span>{language === 'en' ? '🇺🇸 English' : '🇪🇸 Español'}</span>
    </button>
  );
};

export default LanguageToggle;
