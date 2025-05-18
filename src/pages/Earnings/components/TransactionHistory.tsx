
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
    <div className="temu-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">{t('transactions')}</h2>
        <a href="#" className="text-temu-orange flex items-center text-sm">
          {t('viewAll')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="py-2 px-4 font-medium text-gray-500">{t('date')}</th>
              <th className="py-2 px-4 font-medium text-gray-500">Activity</th>
              <th className="py-2 px-4 font-medium text-gray-500">{t('amount')}</th>
              <th className="py-2 px-4 font-medium text-gray-500">{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 10).map((transaction) => (
              <tr key={transaction.id} className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 font-medium">
                  {transaction.type === 'review' && 'Product Review'}
                  {transaction.type === 'wheel' && 'Lucky Wheel'}
                  {transaction.type === 'inspector' && 'Product Inspector'}
                  {transaction.type === 'like' && 'Like For Money'}
                  {transaction.type === 'withdraw' && 'Withdrawal'}
                </td>
                <td className={`py-3 px-4 font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-blue-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium
                    ${transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
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
