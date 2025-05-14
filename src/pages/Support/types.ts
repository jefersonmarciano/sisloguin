
export interface TranslatedText {
  en: string;
  es: string;
}

export interface FAQItem {
  id: string;
  question: TranslatedText;
  answer: TranslatedText;
}
