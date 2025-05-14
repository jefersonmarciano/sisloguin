
import React from 'react';
import { cn } from '../../../lib/utils';
import { CircleCheck, CircleX } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ResultSummaryProps {
  results: {correct: boolean, reward: number}[];
  totalEarned: number;
  className?: string;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ 
  results, 
  totalEarned,
  className 
}) => {
  const correctCount = results.filter(r => r.correct).length;
  const { t } = useLanguage();
  
  return (
    <div className={cn("bg-white rounded-lg shadow-md p-4 border border-gray-100", className)}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg">{t('currentSessionResults')}</h2>
        <p className="text-green-600 font-semibold">
          {t('earned')} ${totalEarned.toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center gap-1 mb-4">
        <div className="flex flex-wrap gap-1">
          {results.map((result, index) => (
            <div 
              key={index}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                result.correct ? "bg-green-100" : "bg-red-100"
              )}
            >
              {result.correct ? (
                <CircleCheck size={20} className="text-green-600" />
              ) : (
                <CircleX size={20} className="text-red-600" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>{t('accuracy')} {results.length > 0 ? Math.round((correctCount / results.length) * 100) : 0}%</p>
      </div>
    </div>
  );
};

export default ResultSummary;
