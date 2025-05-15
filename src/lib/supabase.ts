import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Public Supabase credentials - safe to expose in browser
const supabaseUrl = 'https://nvavxffqfkvkcozcwjol.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52YXZ4ZmZxZmt2a2NvemN3am9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyODUzNDgsImV4cCI6MjA2MTg2MTM0OH0.V1e25UTdJy127fiVqCSwCjOBHOlBffKkarD5lSXT3L8';

// Função para obter o armazenamento personalizado que evita problemas de cookie
const getCustomStorage = () => {
  const inMemoryStore: Record<string, string> = {};

  // Implementação personalizada para evitar problemas de conflito
  return {
    getItem: (key: string) => {
      try {
        // Tenta primeiro do localStorage
        const item = localStorage.getItem(key);
        if (item) return item;
        
        // Fallback para armazenamento em memória
        return inMemoryStore[key] || null;
      } catch (error) {
        console.error('Erro ao acessar localStorage:', error);
        return inMemoryStore[key] || null;
      }
    },
    setItem: (key: string, value: string) => {
      try {
        // Tenta gravar no localStorage
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Erro ao gravar no localStorage:', error);
      }
      // Sempre mantém uma cópia em memória
      inMemoryStore[key] = value;
    },
    removeItem: (key: string) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Erro ao remover do localStorage:', error);
      }
      delete inMemoryStore[key];
    }
  };
};

// Create a single Supabase client instance to be used throughout the app
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    storage: getCustomStorage(),
    storageKey: 'sisloguin-auth-token',
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  realtime: {
    reconnectAfterMs: attempt => Math.min(1000 * attempt, 5000)
  }
});

// Export types for the user_progress table for better type safety
export type UserProgress = {
  id: string;
  user_id: string;
  balance: number;
  reviews_completed: number;
  like_reviews_completed: number;
  inspector_reviews_completed: number;
  reviews_limit: number;
  wheels_remaining: number;
  theme?: string;
  last_review_reset: string | null;
  created_at: string;
  last_updated?: string;
};

// Helper function to ensure timestamp is properly formatted
export const formatTimestamp = (date: Date): string => {
  return date.toISOString();
};
