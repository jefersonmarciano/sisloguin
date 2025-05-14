
import React from 'react';
import { cn } from '../../../lib/utils';

interface ProgressBarProps {
  completed: number;
  limit: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, limit }) => {
  const completionPercentage = Math.min((completed / limit) * 100, 100);
  
  return (
    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
      <div 
        className={cn(
          "h-full rounded-full transition-all duration-500",
          completionPercentage >= 100 ? "bg-green-500" : "bg-blue-500"
        )}
        style={{ width: `${completionPercentage}%` }}
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={limit}
      />
    </div>
  );
};

export default ProgressBar;
