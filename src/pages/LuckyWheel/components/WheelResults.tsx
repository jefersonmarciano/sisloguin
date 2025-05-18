import React from 'react';
import { cn } from '../../../lib/utils';
import { Star, CircleX } from 'lucide-react';

interface WheelResultsProps {
  results: number[];
  className?: string;
}

const WheelResults: React.FC<WheelResultsProps> = ({ 
  results, 
  className 
}) => {
  const totalEarned = results.reduce((sum, prize) => sum + prize, 0);
  
  return (
    <div className={cn("bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-700", className)}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl text-gray-100">Today's Spins</h2>
        <p className="text-emerald-400 font-semibold text-lg">
          Won: ${totalEarned.toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center gap-3 mb-5">
        <div className="flex flex-wrap gap-3">
          {results.map((result, index) => (
            <div 
              key={index}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200",
                result > 0 
                  ? "bg-orange-500/20 border-2 border-orange-500" 
                  : "bg-gray-800 border-2 border-gray-700"
              )}
            >
              {result > 0 ? (
                <div className="text-orange-400 font-bold">${result.toFixed(2)}</div>
              ) : (
                <CircleX size={24} className="text-gray-500" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-sm text-gray-400 bg-gray-800/50 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-1">
            <Star size={16} className="text-emerald-400" />
            Wins: {results.filter(r => r > 0).length}
          </span>
          <span className="flex items-center gap-1">
            <CircleX size={16} className="text-gray-500" />
            Empty: {results.filter(r => r === 0).length}
          </span>
          <span className="text-emerald-400 font-medium">
            Success: {results.length > 0 ? Math.round((results.filter(r => r > 0).length / results.length) * 100) : 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default WheelResults;
