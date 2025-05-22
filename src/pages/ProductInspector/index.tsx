import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { mockProducts } from './mockData';
import { useInspector } from './hooks/useInspector';
import { supabase } from '../../lib/supabase';

// Import components
import ProductInspectorHeader from './components/ProductInspectorHeader';
import DailyTasksProgress from './components/DailyTasksProgress';
import ResultSummary from './components/ResultSummary';
import InspectionContainer from './components/InspectionContainer';
import InspectionWelcome from './components/InspectionWelcome';
import SessionSummary from './components/SessionSummary';
import ResultScreen from './components/ResultScreen';
import CooldownTimer from './components/CooldownTimer';

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
  const handleSafeWithFeedback = async () => {
    await handleSafe();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      await addCooldown();
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };
  
  const handleRequiresAttentionWithFeedback = async () => {
    await handleRequiresAttention();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      await addCooldown();
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };
  
  const addCooldown = async () => {
    if (!user) return;
    
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    
    const { error } = await supabase
      .from('user_cooldowns')
      .upsert({
        user_id: user.id,
        feature: 'product_inspector',
        end_time: endTime.toISOString(),
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,feature'
      });
    
    if (error) {
      console.error('Error setting cooldown:', error);
    } else {
      setShowCooldown(true);
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
      
      <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700 hover:shadow-lg transition-all duration-300">
        {showCooldown ? (
          <CooldownTimer 
            hoursToWait={24} 
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
