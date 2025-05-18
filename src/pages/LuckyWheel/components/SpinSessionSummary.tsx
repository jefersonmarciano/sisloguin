import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SpinSessionSummaryProps {
  results: number[];
  onContinue: () => void;
}

const SpinSessionSummary: React.FC<SpinSessionSummaryProps> = ({ results, onContinue }) => {
  const navigate = useNavigate();
  const totalWon = results.reduce((sum, result) => sum + result, 0);
  const wins = results.filter(r => r > 0).length;
  const emptySpins = results.filter(r => r === 0).length;
  const winRate = Math.round((wins / results.length) * 100);
  const bestPrize = Math.max(...results);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 flex flex-col items-center"
    >
      <div className="bg-gradient-to-r from-[#f97316] to-[#f59e0b] h-24 w-24 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <div className="bg-gray-800 h-20 w-20 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold bg-gradient-to-r from-[#f97316] to-[#f59e0b] bg-clip-text text-transparent">
            {results.length}
          </span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-gray-100">All Spins Used!</h2>
      <p className="text-gray-300 mb-8 text-center">
        You've used all your spins for today.
        Here's your wheel spinning summary:
      </p>
      
      <div className="bg-gradient-to-r from-[#f97316]/10 to-[#f59e0b]/10 rounded-lg p-6 w-full max-w-md mb-8 border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <span className="font-medium text-gray-300">Total Won:</span>
          <span className="text-xl font-bold text-green-400 flex items-center gap-2">
            ${totalWon.toFixed(2)}
            {totalWon > 20 && <Sparkles className="h-5 w-5 text-yellow-500" />}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Spins:</span>
            <span className="font-semibold text-gray-100">{results.length} completed</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Winning Spins:</span>
            <span className="font-semibold text-gray-100">{wins}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Empty Spins:</span>
            <span className="font-semibold text-gray-100">{emptySpins}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">Win Rate:</span>
            <span className="font-semibold text-gray-100">{winRate}%</span>
          </div>
          
          {bestPrize > 0 && (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-300">Best Prize:</span>
              <span className="font-semibold text-[#f97316]">${bestPrize.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <button 
          onClick={onContinue}
          className="w-full py-3 bg-gradient-to-r from-[#f97316] to-[#f59e0b] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          Continue
        </button>
        
        <button 
          onClick={() => navigate("/")}
          className="w-full mt-3 py-3 flex justify-center items-center gap-2 bg-gray-800 border border-gray-700 text-gray-300 font-medium rounded-lg shadow-sm hover:bg-gray-700 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>
      </div>
    </motion.div>
  );
};

export default SpinSessionSummary;
