
import { useState } from 'react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'review' | 'wheel' | 'inspector' | 'withdraw' | 'like';
  status: 'completed' | 'pending' | 'failed';
}

export const useEarningsChart = (transactions: Transaction[]) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  
  // Get date ranges based on selected period
  const getDateRange = () => {
    const today = new Date();
    const result = [];
    
    switch (period) {
      case 'day':
        // Last 24 hours in 2-hour intervals
        for (let i = 11; i >= 0; i--) {
          const date = new Date();
          date.setHours(today.getHours() - i * 2);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
          result.push(date);
        }
        break;
      case 'week':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          date.setHours(0, 0, 0, 0);
          result.push(date);
        }
        break;
      case 'month':
        // Last 30 days (simplified to 4 weeks)
        for (let i = 3; i >= 0; i--) {
          const date = new Date();
          // Each point is 1 week
          date.setDate(today.getDate() - (i * 7));
          date.setHours(0, 0, 0, 0);
          result.push(date);
        }
        break;
    }
    
    return result;
  };
  
  // Format date based on selected period
  const formatDateForChart = (date: Date) => {
    switch (period) {
      case 'day':
        return date.getHours() + ':00';
      case 'week':
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];
      case 'month':
        // Return week number relative to current date
        const weekNr = Math.floor((new Date().getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
        return weekNr === 0 ? 'This week' : `${weekNr} week${weekNr > 1 ? 's' : ''} ago`;
    }
  };
  
  // Check if a transaction date falls within the given range
  const isTransactionInRange = (transaction: { date: string }, startDate: Date, endDate: Date) => {
    const txDate = new Date(transaction.date);
    return txDate >= startDate && txDate <= endDate;
  };
  
  // Group transactions by date range for the chart
  const getChartData = () => {
    const dateRange = getDateRange();
    const chartData = [];
    
    for (let i = 0; i < dateRange.length; i++) {
      const currentDate = dateRange[i];
      let endDate: Date;
      
      // Calculate the end date for the range
      if (i === dateRange.length - 1) {
        // For the last point, use current time
        endDate = new Date();
      } else {
        // For other points, use the next point's date as end
        endDate = new Date(dateRange[i + 1].getTime() - 1);
      }
      
      // Filter transactions for this time range and get total earnings
      const rangeEarnings = transactions
        .filter(t => t.amount > 0 && isTransactionInRange(t, currentDate, endDate))
        .reduce((sum, t) => sum + t.amount, 0);
      
      chartData.push({
        date: formatDateForChart(currentDate),
        earnings: rangeEarnings
      });
    }
    
    return chartData;
  };

  return {
    period,
    setPeriod,
    getChartData
  };
};
