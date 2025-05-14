
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Transaction } from './types';
import { User } from '@/types/auth';
import { calculateTotalEarnings } from './earningsUtils';

export const useEarningsPersistence = (transactions: Transaction[]) => {
  // Save transactions to localStorage and sync with Supabase when they change
  useEffect(() => {
    localStorage.setItem('temuTransactions', JSON.stringify(transactions));
    
    // Get the current user from localStorage
    const currentUser = localStorage.getItem('temuUser');
    if (!currentUser) return;
    
    const userObject: User = JSON.parse(currentUser);
    if (!userObject || !userObject.id) return;
    
    const syncTransactions = async () => {
      try {
        // Calculate total earnings
        const totalEarned = calculateTotalEarnings(transactions);
        
        // Update user progress in Supabase
        await supabase
          .from('user_progress')
          .update({ 
            balance: totalEarned,
            last_updated: new Date().toISOString()
          })
          .eq('user_id', userObject.id)
          .then(result => result);
          
        // Update profiles table - fix: remove balance field since it doesn't exist in profiles table
        // Note: If profiles table should track balance, you would need to add that column
        // to the profiles table schema in Supabase
        console.log('EarningsContext: Synced transactions total with Supabase:', totalEarned);
      } catch (error) {
        console.error('Error syncing transactions with Supabase:', error);
      }
    };
    
    syncTransactions();
  }, [transactions]);

  return {
    // This hook primarily handles side effects, but could be expanded
    // to return persistence-related functions if needed
  };
};
