import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Transaction, EarningsContextType } from './types';
import { useUserProgress } from './useUserProgress';
import { User } from '@/types/auth';
import {
  calculateEarningsByType,
  calculateTotalEarnings,
  calculateWithdrawalsTotal,
  checkWithdrawalEligibility
} from './earningsUtils';
import { useAuth } from '../AuthContext';
import { supabase } from '@/lib/supabase';

const EarningsContext = createContext<EarningsContextType | undefined>(undefined);

interface EarningsProviderProps {
  children: ReactNode;
}

export const EarningsProvider = ({ children }: EarningsProviderProps) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTransactions = data.map(t => ({
        id: t.id,
        date: t.date,
        amount: t.amount,
        type: t.activity as Transaction['type'],
        status: t.status as Transaction['status']
      }));

      setTransactions(formattedTransactions);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  // Add a new transaction to Supabase
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>): Promise<void> => {
    if (!user?.id) return;

    try {
      const newTransaction = {
        activity: transaction.type,
        amount: transaction.amount,
        date: new Date().toISOString().split('T')[0],
        status: transaction.status,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert(newTransaction)
        .select();

      if (error) throw error;

      if (data && data[0]) {
        const formattedTransaction: Transaction = {
          id: data[0].id,
          date: data[0].date,
          amount: data[0].amount,
          type: data[0].activity as Transaction['type'],
          status: data[0].status as Transaction['status']
        };

        setTransactions(prev => [formattedTransaction, ...prev]);
      }
    } catch (err) {
      console.error('Error adding transaction:', err);
      throw err;
    }
  };

  // Fetch transactions when user changes
  useEffect(() => {
    fetchTransactions();
  }, [user?.id]);

  // Get earnings by type
  const getEarningsByType = (type: Transaction['type']): number => {
    return calculateEarningsByType(transactions, type);
  };

  // Get total earnings
  const getTotalEarnings = (): number => {
    return calculateTotalEarnings(transactions);
  };

  // Get withdrawals total
  const getWithdrawalsTotal = (): number => {
    return calculateWithdrawalsTotal(transactions);
  };

  // Check if user can withdraw
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
      canWithdraw,
      loading,
      error
    }}>
      {children}
    </EarningsContext.Provider>
  );
};

export const useEarnings = (): EarningsContextType => {
  const context = useContext(EarningsContext);
  if (context === undefined) {
    throw new Error('useEarnings must be used within an EarningsProvider');
  }
  return context;
};