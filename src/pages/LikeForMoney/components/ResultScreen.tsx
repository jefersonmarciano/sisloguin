
import React from 'react';
import { ThumbsUp, ThumbsDown, SkipForward } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ResultScreenProps {
  currentAction: 'like' | 'dislike' | 'skip' | null;
  reward: number;
  onContinue: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  currentAction,
  reward,
  onContinue
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="p-6 flex flex-col items-center">
      <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 ${
        currentAction === 'like' ? 'bg-green-100' : 
        currentAction === 'dislike' ? 'bg-amber-100' : 'bg-gray-100'
      }`}>
        {currentAction === 'like' ? (
          <ThumbsUp className="h-8 w-8 text-green-500" />
        ) : currentAction === 'dislike' ? (
          <ThumbsDown className="h-8 w-8 text-amber-500" />
        ) : (
          <SkipForward className="h-8 w-8 text-gray-500" />
        )}
      </div>
      
      <h2 className="text-xl font-bold mb-2">
        {currentAction === 'like' ? "Product Liked!" : 
         currentAction === 'dislike' ? "Product Disliked" : "Review Skipped"}
      </h2>
      
      <p className="text-gray-700 mb-4 text-center">
        {currentAction === 'like' ? "Thank you for your positive feedback!" : 
         currentAction === 'dislike' ? "Thank you for your honest assessment." : 
         "No problem, we'll show you another product."}
      </p>
      
      <div className="bg-gradient-to-r from-temu-orange/10 to-amber-500/10 p-4 rounded-lg w-full max-w-xs mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">You earned:</span>
          <span className="text-xl font-bold text-green-600">
            ${reward.toFixed(2)}
          </span>
        </div>
      </div>
      
      <button 
        onClick={onContinue}
        className="px-6 py-2 bg-gradient-to-r from-temu-orange to-amber-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-300"
      >
        Continue
      </button>
    </div>
  );
};

export default ResultScreen;
