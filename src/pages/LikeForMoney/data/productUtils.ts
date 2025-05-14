
import { Language } from '../../../types/language';
import { Product } from '../types';
import { productsEN } from './productsEN';
import { productsEN2 } from './productsEN2';
import { productsES } from './productsES';
import { productsES2 } from './productsES2';

// Combine English product sets
export const allProductsEN: Product[] = [...productsEN, ...productsEN2];

// Combine Spanish product sets
export const allProductsES: Product[] = [...productsES, ...productsES2];

/**
 * Returns product data based on the specified language
 * @param language The language code ('en' or 'es')
 * @returns Array of products in the specified language
 */
export const getMockProducts = (language: Language = 'en'): Product[] => {
  return language === 'es' ? allProductsES : allProductsEN;
};

// For backward compatibility
export const mockProducts = allProductsEN;
