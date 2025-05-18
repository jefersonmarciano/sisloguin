import React from 'react';
import { BarChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';

interface EarningsChartProps {
  period: 'day' | 'week' | 'month';
  setPeriod: (period: 'day' | 'week' | 'month') => void;
  chartData: Array<{ date: string; earnings: number }>;
}

const EarningsChart: React.FC<EarningsChartProps> = ({ period, setPeriod, chartData }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg flex items-center text-gray-100">
          <BarChart className="h-5 w-5 text-temu-orange mr-2" />
          {t('earningsActivity')}
        </h2>
        
        <div className="flex space-x-2 text-sm">
          <button 
            className={`px-3 py-1 rounded-full ${period === 'day' ? 'bg-temu-orange text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setPeriod('day')}
          >
            {t('day')}
          </button>
          <button 
            className={`px-3 py-1 rounded-full ${period === 'week' ? 'bg-temu-orange text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setPeriod('week')}
          >
            {t('week')}
          </button>
          <button 
            className={`px-3 py-1 rounded-full ${period === 'month' ? 'bg-temu-orange text-white' : 'bg-gray-700 text-gray-300'}`}
            onClick={() => setPeriod('month')}
          >
            {t('month')}
          </button>
        </div>
      </div>
      
      <div className="h-64">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} stroke="#9CA3AF" />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => `$${value}`}
                stroke="#9CA3AF"
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Earnings']}
                contentStyle={{ 
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#F3F4F6'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="earnings" 
                stroke="#F97316" 
                fillOpacity={1} 
                fill="url(#colorEarnings)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            {t('noEarningsActivity')}
          </div>
        )}
      </div>
    </div>
  );
};

export default EarningsChart;
