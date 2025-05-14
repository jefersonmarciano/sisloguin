
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Transaction, EarningsContextType } from './types';
import { useEarningsPersistence } from './useEarningsPersistence';
import { useBalanceSync } from './useBalanceSync';
import { 
  calculateEarningsByType, 
  calculateTotalEarnings, 
  calculateWithdrawalsTotal,
  checkWithdrawalEligibility
} from './earningsUtils';

// Create the context with undefined as initial value
const EarningsContext = createContext<EarningsContextType | undefined>(undefined);

interface EarningsProviderProps {
  children: ReactNode;
}

// Starting with no initial transactions
const initialTransactions: Transaction[] = [];

export const EarningsProvider = ({ children }: EarningsProviderProps) => {
  // Initialize transactions state from localStorage or empty array
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('temuTransactions');
    return savedTransactions ? JSON.parse(savedTransactions) : initialTransactions;
  });
  
  // Use our custom hooks for persistence and balance syncing
  useEarningsPersistence(transactions);
  useBalanceSync(transactions);

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>): void => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };

  // Get earnings by type using our utility function
  const getEarningsByType = (type: Transaction['type']): number => {
    return calculateEarningsByType(transactions, type);
  };

  // Get total earnings using our utility function
  const getTotalEarnings = (): number => {
    return calculateTotalEarnings(transactions);
  };
  
  // Get withdrawals total using our utility function
  const getWithdrawalsTotal = (): number => {
    return calculateWithdrawalsTotal(transactions);
  };
  
  // Check if user can withdraw using our utility function
  const canWithdraw = (amount: number): { allowed: boolean; reason?: string } => {
    return checkWithdrawalEligibility(transactions, amount);
  };

  return (
    <EarningsContext.Provider value={{ 
      transactions, 
      addTransaction, 
      getEarningsByType, 
      getTotalEarnings,
      getWithdrawalsTotal,
      canWithdraw
    }}>
      {children}
    </EarningsContext.Provider>
  );
};

// Custom hook to use the earnings context
export const useEarnings = (): EarningsContextType => {
  const context = useContext(EarningsContext);
  if (context === undefined) {
    throw new Error('useEarnings must be used within an EarningsProvider');
  }
  return context;
};
