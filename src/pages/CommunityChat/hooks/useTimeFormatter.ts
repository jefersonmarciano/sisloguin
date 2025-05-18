// src/pages/CommunityChat/hooks/useTimeFormatter.ts
import { useLanguage } from '@/contexts/LanguageContext';

// Export as named export
export const useTimeFormatter = () => {
  const { language } = useLanguage();

  const formatTimestamp = (timestamp: number | Date) => {
    // Convert to Date if it's a number (Unix timestamp)
    const date = typeof timestamp === 'number' 
      ? new Date(timestamp) 
      : timestamp;

    // Fallback in case the date is invalid
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat(language, {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: language === 'en' ? 'numeric' : undefined,
    }).format(date);
  };

  return { formatTimestamp };
};

// Alternatively, you could also export as default
// export default useTimeFormatter;