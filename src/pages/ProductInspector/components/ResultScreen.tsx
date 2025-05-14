
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ResultScreenProps {
  results: {correct: boolean; reward: number}[];
  onContinue: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ results, onContinue }) => {
  // Get the latest result
  const latestResult = results.length > 0 ? results[results.length - 1] : null;
  const { t } = useLanguage();
  
  return (
    <div className="p-6 flex flex-col items-center">
      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
        {latestResult?.correct ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )}
      </div>
      
      <h2 className="text-xl font-bold mb-2">
        {latestResult?.correct 
          ? t('correctAssessment') 
          : t('incorrectAssessment')}
      </h2>
      
      <p className="text-gray-700 mb-4 text-center">
        {latestResult?.correct 
          ? t('greatJobAccurateAssessment') 
          : t('keepPracticingFeedback')}
      </p>
      
      <div className="bg-gradient-to-r from-temu-orange/10 to-amber-500/10 p-4 rounded-lg w-full max-w-xs mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">{t('youEarned')}:</span>
          <span className="text-xl font-bold text-green-600">
            ${latestResult ? latestResult.reward.toFixed(2) : "0.00"}
          </span>
        </div>
      </div>
      
      <button 
        onClick={onContinue}
        className="px-6 py-2 bg-gradient-to-r from-temu-orange to-amber-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-300"
      >
        {t('continueButton')}
      </button>
    </div>
  );
};

export default ResultScreen;
