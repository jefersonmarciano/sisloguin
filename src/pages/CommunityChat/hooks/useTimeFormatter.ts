
import { useCallback } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

export const useTimeFormatter = () => {
  const { language } = useLanguage();
  
  // Format timestamp to relative time with language support
  const formatTimestamp = useCallback((date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (language === 'es') {
      if (diffInSeconds < 60) return `hace ${diffInSeconds} segundos`;
      if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} minutos`;
      if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} horas`;
      return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    } else {
      // Default to English
      if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  }, [language]);
  
  return { formatTimestamp };
};
