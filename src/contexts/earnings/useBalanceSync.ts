
import { useEffect } from 'react';
import { Transaction } from './types';
import { User } from '@/types/auth';
import { calculateTotalEarnings } from './earningsUtils';

export const useBalanceSync = (transactions: Transaction[]) => {
  // Create effect to check for auth user changes and update balance accordingly
  useEffect(() => {
    // This is a more React-friendly way to access auth state changes
    // without direct dependency on useAuth in the provider
    const syncUserBalanceWithEarnings = () => {
      const currentUser = localStorage.getItem('temuUser');
      if (currentUser) {
        const userObject: User = JSON.parse(currentUser);
        const totalEarned = calculateTotalEarnings(transactions);
        
        // If balance doesn't match earnings, update local storage
        if (userObject && userObject.balance !== totalEarned) {
          userObject.balance = totalEarned;
          localStorage.setItem('temuUser', JSON.stringify(userObject));
          console.log('EarningsContext: Syncing local user balance with total earnings:', totalEarned);
        }
      }
    };
    
    // Run immediately
    syncUserBalanceWithEarnings();
    
    // Set up event listener for auth state changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'temuUser') {
        syncUserBalanceWithEarnings();
      }
    });
    
    return () => {
      window.removeEventListener('storage', (event) => {
        if (event.key === 'temuUser') {
          syncUserBalanceWithEarnings();
        }
      });
    };
  }, [transactions]);
};
