import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockProducts } from './mockData';
import { useInspector } from './hooks/useInspector';

// Import components
import ProductInspectorHeader from './components/ProductInspectorHeader';
import DailyTasksProgress from './components/DailyTasksProgress';
import ResultSummary from './components/ResultSummary';
import InspectionContainer from './components/InspectionContainer';
import InspectionWelcome from './components/InspectionWelcome';
import SessionSummary from './components/SessionSummary';
import ResultScreen from './components/ResultScreen';
import ProductInspectorCooldownTimer from './components/CooldownTimer';

const ProductInspector: React.FC = () => {
  const { user, checkAndResetReviews } = useAuth();
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  
  const {
    currentProduct,
    isInspecting,
    earnedToday,
    results,
    showCooldown,
    setShowCooldown,
    reviewsCompleted,
    reviewsLimit,
    startInspection,
    handleSafe,
    handleRequiresAttention,
    setResults
  } = useInspector(mockProducts);
  
  const balance = user?.balance || 0;
  
  // Show result screen after each assessment
  const handleSafeWithFeedback = () => {
    handleSafe();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };
  
  const handleRequiresAttentionWithFeedback = () => {
    handleRequiresAttention();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };
  
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4">
      <ProductInspectorHeader balance={balance} />
      
      <DailyTasksProgress 
        reviewsCompleted={reviewsCompleted} 
        reviewsLimit={reviewsLimit} 
      />
      
      {results.length > 0 && !showCooldown && !showResultScreen && !showSessionSummary && !isInspecting && (
        <ResultSummary 
          results={results} 
          totalEarned={earnedToday}
          className="mb-6"
        />
      )}
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
        {showCooldown ? (
          <ProductInspectorCooldownTimer 
            hoursToWait={6} 
            onComplete={() => {
              setShowCooldown(false);
              setResults([]);
              checkAndResetReviews();
            }}
          />
        ) : showSessionSummary ? (
          <SessionSummary 
            results={results}
            onContinue={() => {
              setShowSessionSummary(false);
              setShowCooldown(true);
            }}
          />
        ) : showResultScreen ? (
          <ResultScreen 
            results={results}
            onContinue={() => setShowResultScreen(false)}
          />
        ) : isInspecting ? (
          <InspectionContainer
            currentProduct={currentProduct}
            onSafe={handleSafeWithFeedback}
            onRequiresAttention={handleRequiresAttentionWithFeedback}
          />
        ) : (
          <InspectionWelcome onStartClick={startInspection} />
        )}
      </div>
    </div>
  );
};

export default ProductInspector;
