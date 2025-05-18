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
      className="mt-2 flex items-center justify-center mx-auto text-sm px-4 py-1.5 rounded-full 
        border border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:text-gray-100 
        transition-colors duration-200"
    >
      <Globe className="h-3.5 w-3.5 mr-1.5" />
      <span>{language === 'en' ? '🇺🇸 English' : '🇪🇸 Español'}</span>
    </button>
  );
};

export default LanguageToggle;
