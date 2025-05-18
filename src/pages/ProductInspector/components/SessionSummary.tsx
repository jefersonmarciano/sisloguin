import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SessionSummaryProps {
  results: {correct: boolean, reward: number}[];
  onContinue: () => void;
}

const SessionSummary: React.FC<SessionSummaryProps> = ({ results, onContinue }) => {
  const totalEarned = results.reduce((sum, result) => sum + result.reward, 0);
  const correctAssessments = results.filter(r => r.correct).length;
  const accuracy = Math.round((correctAssessments / results.length) * 100);
  const { t } = useLanguage();

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
      
      <h2 className="text-2xl font-bold mb-2 text-gray-100">{t('sessionComplete')}</h2>
      <p className="text-gray-300 mb-8 text-center">
        {t('greatJob')}
        {t('performanceSummary')}
      </p>
      
      <div className="bg-gradient-to-r from-temu-orange/10 to-amber-500/10 rounded-lg p-6 w-full max-w-md mb-8 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <span className="font-medium text-gray-300">{t('totalEarned')}</span>
          <span className="text-xl font-bold text-green-400">${totalEarned.toFixed(2)}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">{t('inspections')}</span>
            <span className="font-semibold text-gray-100">{results.length} {t('completed')}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">{t('correctAssessments')}</span>
            <span className="font-semibold flex items-center gap-1 text-gray-100">
              {correctAssessments} <Check size={16} className="text-green-400" />
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">{t('incorrectAssessments')}</span>
            <span className="font-semibold flex items-center gap-1 text-gray-100">
              {results.length - correctAssessments} <X size={16} className="text-red-400" />
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-300">{t('accuracyRate')}</span>
            <span className="font-semibold text-gray-100">{accuracy}%</span>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <button 
          onClick={onContinue}
          className="w-full py-3 bg-gradient-to-r from-temu-orange to-amber-500 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
        >
          {t('continueButton')}
        </button>
      </div>
    </motion.div>
  );
};

export default SessionSummary;
