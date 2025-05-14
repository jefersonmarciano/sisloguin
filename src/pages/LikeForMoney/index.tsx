
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useIsMobile } from '../../hooks/use-mobile';
import ReviewResultSummary from './components/ReviewResultSummary';
import ReviewCooldownTimer from './components/ReviewCooldownTimer';
import ProductReviewCard from './components/ProductReviewCard';
import WelcomeCard from './components/WelcomeCard';
import ReviewSessionSummary from './components/ReviewSessionSummary';
import { useReviewState } from './hooks/useReviewState';
import LikeForMoneyLayout from './components/LikeForMoneyLayout';
import MainProgressBar from './components/MainProgressBar';
import ResultScreen from './components/ResultScreen';

const LikeForMoney: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [currentAction, setCurrentAction] = useState<'like' | 'dislike' | 'skip' | null>(null);
  
  const {
    loading,
    currentProduct,
    isReviewing,
    timeRemaining,
    showCooldown,
    reviewsCompleted,
    reviewsLimit,
    earnedToday,
    results,
    setResults,
    setShowCooldown,
    startReview,
    handleLike,
    handleDislike,
    handleSkip,
    checkAndResetReviews
  } = useReviewState();

  // Enhanced handlers with feedback
  const handleLikeWithFeedback = () => {
    setCurrentAction('like');
    handleLike();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };

  const handleDislikeWithFeedback = () => {
    setCurrentAction('dislike');
    handleDislike();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };

  const handleSkipWithFeedback = () => {
    setCurrentAction('skip');
    handleSkip();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };
  
  // If still loading, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-pulse p-8 text-center">
          <p className="text-lg font-medium text-gray-700">{t('loading')}...</p>
        </div>
      </div>
    );
  }
  
  return (
    <LikeForMoneyLayout>
      <MainProgressBar 
        reviewsCompleted={reviewsCompleted} 
        reviewsLimit={reviewsLimit} 
      />
      
      {results.length > 0 && !showCooldown && !showResultScreen && !showSessionSummary && !isReviewing && (
        <ReviewResultSummary 
          results={results} 
          totalEarned={earnedToday}
          className="mb-6"
        />
      )}
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
        {showCooldown ? (
          <ReviewCooldownTimer 
            hoursToWait={6} 
            onComplete={() => {
              setShowCooldown(false);
              setResults([]);
              checkAndResetReviews();
            }}
          />
        ) : showSessionSummary ? (
          <ReviewSessionSummary 
            results={results}
            onContinue={() => {
              setShowSessionSummary(false);
              setShowCooldown(true);
            }}
          />
        ) : showResultScreen ? (
          <ResultScreen 
            currentAction={currentAction}
            reward={results.length > 0 ? results[results.length - 1].reward : 0}
            onContinue={() => setShowResultScreen(false)}
          />
        ) : isReviewing && currentProduct ? (
          <ProductReviewCard 
            product={currentProduct}
            handleLike={handleLikeWithFeedback}
            handleDislike={handleDislikeWithFeedback}
            handleSkip={handleSkipWithFeedback}
            isMobile={isMobile}
            timeRemaining={timeRemaining}
          />
        ) : (
          <WelcomeCard startReview={startReview} />
        )}
      </div>
    </LikeForMoneyLayout>
  );
};

export default LikeForMoney;
