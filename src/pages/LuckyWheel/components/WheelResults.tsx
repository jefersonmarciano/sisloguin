
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
    <div className={cn("bg-white rounded-lg shadow-md p-4 border border-gray-100", className)}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg">Today's Spins</h2>
        <p className="text-green-600 font-semibold">
          Won: ${totalEarned.toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center gap-2 mb-4">
        <div className="flex flex-wrap gap-2">
          {results.map((result, index) => (
            <div 
              key={index}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                result > 0 ? "bg-orange-100" : "bg-gray-100"
              )}
            >
              {result > 0 ? (
                <div className="text-[#f97316] font-bold">${result.toFixed(2)}</div>
              ) : (
                <CircleX size={20} className="text-gray-600" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-600">
        <div className="flex justify-between">
          <span>Wins: {results.filter(r => r > 0).length}</span>
          <span>Empty spins: {results.filter(r => r === 0).length}</span>
          <span>Success rate: {results.length > 0 ? Math.round((results.filter(r => r > 0).length / results.length) * 100) : 0}%</span>
        </div>
      </div>
    </div>
  );
};

export default WheelResults;
