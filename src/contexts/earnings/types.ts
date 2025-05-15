import { User } from '@/types/auth';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'review' | 'wheel' | 'inspector' | 'withdraw' | 'like';
  status: 'completed' | 'pending' | 'failed';
  created_at?: string;
}

export interface EarningsContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  getEarningsByType: (type: Transaction['type']) => number;
  getTotalEarnings: () => number;
  getWithdrawalsTotal: () => number;
  canWithdraw: (amount: number) => { allowed: boolean; reason?: string };
}
