import React from 'react';
import { cn } from '../../../lib/utils';
import { ThumbsUp, ThumbsDown, CircleX } from 'lucide-react';

interface ReviewResultSummaryProps {
  results: {type: 'like' | 'dislike' | 'skip', reward: number}[];
  totalEarned: number;
  className?: string;
}

const ReviewResultSummary: React.FC<ReviewResultSummaryProps> = ({ 
  results, 
  totalEarned,
  className 
}) => {
  const likeCount = results.filter(r => r.type === 'like').length;
  const dislikeCount = results.filter(r => r.type === 'dislike').length;
  const skipCount = results.filter(r => r.type === 'skip').length;
  
  return (
    <div className={cn("bg-gray-800 rounded-lg shadow-md p-4 border border-gray-700", className)}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg text-gray-100">Current Session Results</h2>
        <p className="text-green-400 font-semibold">
          Earned: ${totalEarned.toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center gap-1 mb-4">
        <div className="flex flex-wrap gap-1">
          {results.map((result, index) => (
            <div 
              key={index}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                result.type === 'like' ? "bg-green-900" : 
                result.type === 'dislike' ? "bg-amber-900" : "bg-gray-700"
              )}
            >
              {result.type === 'like' ? (
                <ThumbsUp size={16} className="text-green-400" />
              ) : result.type === 'dislike' ? (
                <ThumbsDown size={16} className="text-amber-400" />
              ) : (
                <CircleX size={16} className="text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="flex items-center gap-1">
          <ThumbsUp size={14} className="text-green-400" />
          <span className="text-gray-300">Likes: {likeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsDown size={14} className="text-amber-400" />
          <span className="text-gray-300">Dislikes: {dislikeCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <CircleX size={14} className="text-gray-400" />
          <span className="text-gray-300">Skipped: {skipCount}</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewResultSummary;
