
export interface TranslatedProductContent {
  name: string;
  description: string;
  image: string;
  question?: string;
}

export interface MultiLanguageProduct {
  id: string;
  price: number;
  issues?: string[];
  en: TranslatedProductContent;
  es: TranslatedProductContent;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  question?: string;
  issues?: string[];
}

export interface TransactionData {
  amount: number;
  type: string;
  status: string;
}
