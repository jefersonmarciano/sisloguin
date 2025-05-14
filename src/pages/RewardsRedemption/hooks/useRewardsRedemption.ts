
import { useState, useEffect } from 'react';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useEarnings } from '../../../contexts/EarningsContext';
import { RewardOption } from '../types';

export const useRewardsRedemption = (rewardOptions: RewardOption[]) => {
  const { toast } = useToast();
  const { user, updateBalance } = useAuth();
  const { addTransaction, transactions, canWithdraw, getTotalEarnings } = useEarnings();
  
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [showEarningsDialog, setShowEarningsDialog] = useState(false);
  
  // Get total earnings from EarningsContext
  const totalEarnings = getTotalEarnings();
  
  // Use total earnings as the main balance value
  const balance = totalEarnings;
  
  // Sync user balance with total earnings
  useEffect(() => {
    if (user && user.balance !== totalEarnings) {
      // Update user balance to match total earnings
      updateBalance(totalEarnings - user.balance);
      console.log('Syncing user balance with total earnings:', totalEarnings);
    }
  }, [user, totalEarnings, updateBalance]);
  
  // Calculate total earnings (excluding withdrawals)
  const totalEarned = transactions
    .filter(t => t.type !== 'withdraw' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);
  
  // Calculate how much more is needed to reach minimum withdrawal amount based on balance
  const minimumWithdrawalAmount = 1000;
  const amountNeeded = Math.max(0, minimumWithdrawalAmount - balance);
  
  // Check if user has enough balance for the minimum required amount
  const hasMinimumEarnings = balance >= minimumWithdrawalAmount;
  
  const handleRewardSelect = (id: string) => {
    // Only set selection, never deselect
    setSelectedReward(id);
    
    // Set default amount to minimum for this reward
    const option = rewardOptions.find(r => r.id === id);
    if (option) {
      setAmount(option.minAmount.toString());
    }
  };
  
  // Add a click handler for quick amount buttons to prevent bubbling
  const handleQuickAmountClick = (quickAmount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setAmount(quickAmount.toString());
  };
  
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!selectedReward || !amount) {
      toast({
        title: "Error",
        description: "Please select a withdrawal option and enter an amount",
        variant: "destructive",
      });
      return;
    }
    
    const rewardAmount = parseFloat(amount);
    if (isNaN(rewardAmount) || rewardAmount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user has earned at least $1000 to be eligible for withdrawal
    if (!hasMinimumEarnings) {
      // Show dialog instead of just a toast
      setShowEarningsDialog(true);
      return;
    }
    
    // Check if user can withdraw this amount
    const withdrawalCheck = canWithdraw(rewardAmount);
    
    if (!withdrawalCheck.allowed) {
      toast({
        title: "Withdrawal not allowed",
        description: withdrawalCheck.reason || "You cannot withdraw at this time",
        variant: "destructive",
      });
      return;
    }
    
    if (rewardAmount > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough funds for this withdrawal",
        variant: "destructive",
      });
      return;
    }
    
    const selectedOption = rewardOptions.find(r => r.id === selectedReward);
    if (selectedOption && rewardAmount < selectedOption.minAmount) {
      toast({
        title: "Minimum amount required",
        description: `The minimum withdrawal amount for ${selectedOption.type} is $${selectedOption.minAmount.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }
    
    // Process withdrawal
    updateBalance(-rewardAmount); // Subtract amount from balance
    
    // Add transaction with negative amount to represent withdrawal
    addTransaction({
      amount: -rewardAmount,
      type: 'withdraw',
      status: 'completed'
    });
    
    toast({
      title: "Withdrawal requested",
      description: `Your withdrawal for $${rewardAmount.toFixed(2)} to ${selectedOption?.type} has been submitted!`,
    });
    
    // Reset form
    setSelectedReward(null);
    setAmount('');
  };
  
  // Filter withdrawal history
  const withdrawalHistory = transactions
    .filter(t => t.type === 'withdraw')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  return {
    balance,
    selectedReward,
    amount,
    setAmount,
    showEarningsDialog,
    setShowEarningsDialog,
    hasMinimumEarnings,
    amountNeeded,
    minimumWithdrawalAmount,
    handleRewardSelect,
    handleQuickAmountClick,
    handleSubmit,
    withdrawalHistory
  };
};
