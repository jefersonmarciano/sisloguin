import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

interface CooldownData {
  end_time: string;
}

const LikeForMoney: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  // State for cooldown
  const [cooldownEndTime, setCooldownEndTime] = useState<string | null>(null);
  const [isCheckingCooldown, setIsCheckingCooldown] = useState(true);
  
  // Review UI states
  const [showResultScreen, setShowResultScreen] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [currentAction, setCurrentAction] = useState<'like' | 'dislike' | 'skip' | null>(null);

  const {
    loading,
    currentProduct,
    isReviewing,
    timeRemaining,
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

  // Check for existing cooldown on mount
  useEffect(() => {
    const checkCooldown = async () => {
      if (!user) {
        setIsCheckingCooldown(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_cooldowns')
        .select('end_time')
        .eq('user_id', user.id)
        .eq('feature', 'like_review')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching cooldown:', error);
      }

      if (data) {
        const now = new Date();
        const endTime = new Date((data as CooldownData).end_time);

        if (now < endTime) {
          setCooldownEndTime(endTime.toISOString());
        } else {
          await clearCooldown();
        }
      }
      setIsCheckingCooldown(false);
    };

    checkCooldown();
  }, [user]);

  const clearCooldown = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_cooldowns')
      .delete()
      .eq('user_id', user.id)
      .eq('feature', 'like_review');

    if (error) {
      console.error('Error clearing cooldown:', error);
    } else {
      setCooldownEndTime(null);
    }
  };

  const addCooldown = async () => {
    if (!user) return;
    
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 6);
    
    const { error } = await supabase
      .from('user_cooldowns')
      .upsert({
        user_id: user.id,
        feature: 'like_review',
        end_time: endTime.toISOString(),
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,feature'
      });
    
    if (error) {
      console.error('Error setting cooldown:', error);
    } else {
      setCooldownEndTime(endTime.toISOString());
    }
  };

  // Action handlers
  const handleLikeWithFeedback = async () => {
    setCurrentAction('like');
    await handleLike();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      await addCooldown();
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };

  const handleDislikeWithFeedback = async () => {
    setCurrentAction('dislike');
    await handleDislike();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      await addCooldown();
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };

  const handleSkipWithFeedback = async () => {
    setCurrentAction('skip');
    await handleSkip();
    if (reviewsCompleted + 1 >= reviewsLimit) {
      await addCooldown();
      setShowSessionSummary(true);
    } else {
      setShowResultScreen(true);
    }
  };

  // Loading state
  if (loading || isCheckingCooldown) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-pulse p-8 text-center">
          <p className="text-lg font-medium text-gray-700">{t('loading')}...</p>
        </div>
      </div>
    );
  }

  // Cooldown active - show only cooldown timer
  if (cooldownEndTime) {
    return (
      <LikeForMoneyLayout>
        <div className="flex items-center justify-center h-full">
          <ReviewCooldownTimer 
            endTime={new Date(cooldownEndTime)}
            onComplete={() => {
              clearCooldown();
              setResults([]);
              checkAndResetReviews();
            }}
          />
        </div>
      </LikeForMoneyLayout>
    );
  }

  // Normal operation
  return (
    <LikeForMoneyLayout>
      <MainProgressBar 
        reviewsCompleted={reviewsCompleted} 
        reviewsLimit={reviewsLimit} 
      />
      
      {results.length > 0 && !showResultScreen && !showSessionSummary && !isReviewing && (
        <ReviewResultSummary 
          results={results} 
          totalEarned={earnedToday}
          className="mb-6"
        />
      )}
      
      <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-700 hover:shadow-lg transition-all duration-300">
        {showSessionSummary ? (
          <ReviewSessionSummary 
            results={results}
            onContinue={() => {
              setShowSessionSummary(false);
              setCooldownEndTime(new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString());
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