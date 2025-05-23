import React from 'react';
import { ThumbsUp, ThumbsDown, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewSessionSummaryProps {
  results: {type: 'like' | 'dislike' | 'skip', reward: number}[];
  onContinue: () => void;
}

const ReviewSessionSummary: React.FC<ReviewSessionSummaryProps> = ({ results, onContinue }) => {
  const totalEarned = results.reduce((sum, result) => sum + result.reward, 0);
  const likes = results.filter(r => r.type === 'like').length;
  const dislikes = results.filter(r => r.type === 'dislike').length;
  const skips = results.filter(r => r.type === 'skip').length;
  const completionRate = Math.round(((likes + dislikes) / results.length) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 flex flex-col items-center"
    >
      <div className="bg-gradient-to-r from-temu-orange to-amber-500 h-24 w-24 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <div className="bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold bg-gradient-to-r from-temu-orange to-amber-500 bg-clip-text text-transparent">
            {results.length}
          </span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-gray-100">Session Complete!</h2>
      <p className="text-gray-300 mb-8 text-center">
        Great job! You've completed today's product reviews.
        Here's your performance summary:
      </p>
      
      <div className="bg-gradient-to-r from-temu-orange/10 to-amber-500/10 rounded-lg p-6 w-full max-w-md mb-8 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-gray-300">Total Earned:</span>
          <span className="text-xl font-bold text-green-400">${totalEarned.toFixed(2)}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Reviews:</span>
            <span className="font-semibold text-gray-100">{results.length} completed</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Likes:</span>
            <span className="font-semibold flex items-center gap-1 text-gray-100">
              {likes} <ThumbsUp size={16} className="text-green-400" />
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Dislikes:</span>
            <span className="font-semibold flex items-center gap-1 text-gray-100">
              {dislikes} <ThumbsDown size={16} className="text-amber-400" />
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Skipped:</span>
            <span className="font-semibold flex items-center gap-1 text-gray-100">
              {skips} <SkipForward size={16} className="text-gray-400" />
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Completion Rate:</span>
            <span className="font-semibold text-gray-100">{completionRate}%</span>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <button 
          onClick={onContinue}
          className="w-full py-3 bg-gradient-to-r from-temu-orange to-amber-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewSessionSummary;
