import { User } from '@/types/auth';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'review' | 'wheel' | 'inspector' | 'withdraw' | 'like';
  status: 'completed' | 'pending' | 'failed';
}

export interface EarningsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  getEarningsByType: (type: Transaction['type']) => number;
  getTotalEarnings: () => number;
  getWithdrawalsTotal: () => number;
  canWithdraw: (amount: number) => { allowed: boolean; reason?: string };
  loading: boolean;
  error: string | null;
}