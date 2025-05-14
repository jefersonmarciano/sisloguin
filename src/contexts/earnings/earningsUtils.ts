
import { Transaction } from './types';

// Get earnings by transaction type
export const calculateEarningsByType = (
  transactions: Transaction[], 
  type: Transaction['type']
): number => {
  return transactions
    .filter(t => t.type === type && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total earnings (all completed transactions)
export const calculateTotalEarnings = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total withdrawals
export const calculateWithdrawalsTotal = (transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.type === 'withdraw' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
};

// Check if withdrawal is allowed
export const checkWithdrawalEligibility = (
  transactions: Transaction[], 
  amount: number
): { allowed: boolean; reason?: string } => {
  const totalEarned = transactions
    .filter(t => t.type !== 'withdraw' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
    
  // Minimum $1000 earned to withdraw
  if (totalEarned < 1000) {
    return { 
      allowed: false, 
      reason: `You need to earn at least $1000 before withdrawing. Current earnings: $${totalEarned.toFixed(2)}`
    };
  }
  
  // Check if user has enough balance for this withdrawal
  const totalWithdrawn = calculateWithdrawalsTotal(transactions);
  const availableBalance = totalEarned - totalWithdrawn;
  
  if (amount > availableBalance) {
    return {
      allowed: false,
      reason: `Insufficient balance. Available for withdrawal: $${availableBalance.toFixed(2)}`
    };
  }
  
  return { allowed: true };
};
