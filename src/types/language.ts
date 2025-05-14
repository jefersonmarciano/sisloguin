
export type Language = 'en' | 'es';

export interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language | string) => void; // Updated to accept string
  setLanguage: (lang: Language | string) => void; // For backward compatibility
}

export interface TranslationKey {
  [key: string]: string;
}
