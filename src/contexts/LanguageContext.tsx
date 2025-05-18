import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import translations from '../translations';
import { Language, LanguageContextType } from '../types/language';

// Define available languages
const languages: Language[] = ['en', 'es', 'fr'];

// Create context with default value undefined
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Function to change language
  const changeLanguage = (lang: Language | string) => {
    // Validate if the provided language is supported
    if (languages.includes(lang as Language)) {
      setLanguage(lang as Language);
      localStorage.setItem('language', lang as string);
    }
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  // Load preferred language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && languages.includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ 
      language, 
      t, 
      changeLanguage,
      setLanguage: changeLanguage // Added this for backward compatibility
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
