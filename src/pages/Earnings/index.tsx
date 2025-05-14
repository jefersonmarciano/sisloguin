
import React, { useEffect } from 'react';
import { useEarnings } from '../../contexts/EarningsContext';
import { useAuth } from '../../contexts/AuthContext';
import { useEarningsChart } from './hooks/useEarningsChart';
import EarningsHeader from './components/EarningsHeader';
import EarningsSummaryCards from './components/EarningsSummaryCards';
import EarningsChart from './components/EarningsChart';
import TransactionHistory from './components/TransactionHistory';

const Earnings: React.FC = () => {
  const { transactions, getTotalEarnings } = useEarnings();
  const { user, updateBalance } = useAuth();
  const { period, setPeriod, getChartData } = useEarningsChart(transactions);
  
  // Calculate total earnings (excluding withdrawals)
  const totalEarnings = getTotalEarnings();
  
  // Generate chart data based on selected period
  const chartData = getChartData();
  
  // Ensure user balance is synced with total earnings
  useEffect(() => {
    if (user && user.balance !== totalEarnings) {
      // Update user balance to match total earnings
      updateBalance(totalEarnings - user.balance);
      console.log('Syncing user balance with total earnings:', totalEarnings);
    }
  }, [user, totalEarnings, updateBalance]);
  
  // Use consistent balance across the entire page
  const currentBalance = totalEarnings;
  
  return (
    <div className="animate-fade-in">
      <EarningsHeader />
      
      <EarningsSummaryCards 
        currentBalance={currentBalance} 
        totalEarnings={totalEarnings} 
      />
      
      <EarningsChart 
        period={period} 
        setPeriod={setPeriod} 
        chartData={chartData} 
      />
      
      <TransactionHistory transactions={transactions} />
    </div>
  );
};

export default Earnings;
