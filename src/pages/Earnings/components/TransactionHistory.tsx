import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'review' | 'wheel' | 'inspector' | 'withdraw' | 'like';
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg text-gray-100">{t('transactions')}</h2>
        <a href="#" className="text-temu-orange flex items-center text-sm hover:text-orange-400">
          {t('viewAll')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              <th className="py-2 px-4 font-medium text-gray-400">{t('date')}</th>
              <th className="py-2 px-4 font-medium text-gray-400">Activity</th>
              <th className="py-2 px-4 font-medium text-gray-400">{t('amount')}</th>
              <th className="py-2 px-4 font-medium text-gray-400">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-700">
                <td className="py-3 px-4 text-sm text-gray-300">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 font-medium text-gray-100">
                  {transaction.type === 'review' && 'Product Review'}
                  {transaction.type === 'wheel' && 'Lucky Wheel'}
                  {transaction.type === 'inspector' && 'Product Inspector'}
                  {transaction.type === 'like' && 'Like For Money'}
                  {transaction.type === 'withdraw' && 'Withdrawal'}
                </td>
                <td className={`py-3 px-4 font-medium ${transaction.amount > 0 ? 'text-green-400' : 'text-blue-400'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium
                    ${transaction.status === 'completed' ? 'bg-green-900/50 text-green-400' :
                      transaction.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' :
                      'bg-red-900/50 text-red-400'}`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-400">
                  {t('noTransactions')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;
