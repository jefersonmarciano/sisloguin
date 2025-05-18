import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import translations from '@/translations';

export const LanguageToggle: React.FC = () => {
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-sm text-gray-300 mb-2">Choose your language</p>
      <div className="relative">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="appearance-none bg-gray-800/50 border border-gray-700 text-gray-300 
            rounded-full pl-10 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-transparent cursor-pointer"
        >
          <option value="en">🇺🇸 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
        </select>
        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageToggle;
