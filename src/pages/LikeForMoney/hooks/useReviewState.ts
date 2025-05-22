import { useState, useEffect } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useEarnings } from '../../../contexts/EarningsContext';
import { Product } from '../types';
import { getMockProducts } from '../mockData';

export const useReviewState = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { user, completeReview, checkAndResetReviews } = useAuth();
  const { addTransaction } = useEarnings();
  
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isReviewing, setIsReviewing] = useState(false);
  const [earnedToday, setEarnedToday] = useState(0);
  const [results, setResults] = useState<{type: 'like' | 'dislike' | 'skip', reward: number}[]>([]);
  const [showCooldown, setShowCooldown] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get the number of like reviews completed
  const reviewsCompleted = user?.likeReviewsCompleted || 0;
  const reviewsLimit = 10;
  
  // Load products based on current language and randomize them
  useEffect(() => {
    try {
      const productData = getMockProducts(language);
      // Randomize products order
      const randomizedProducts = [...productData].sort(() => Math.random() - 0.5);
      setProducts(randomizedProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error loading products:", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }, [language, toast]);
  
  useEffect(() => {
    // Check if reviews need to be reset when component loads
    checkAndResetReviews();
  }, [checkAndResetReviews]);
  
  // Check if daily limit is reached
  useEffect(() => {
    if (reviewsCompleted >= reviewsLimit) {
      if (user?.lastReviewReset) {
        const lastReset = new Date(user.lastReviewReset);
        const endTime = lastReset.getTime() + (24 * 60 * 60 * 1000);
        const now = Date.now();
        if (now < endTime) {
          setShowCooldown(true);
        } else {
          checkAndResetReviews();
        }
      } else {
        setShowCooldown(true);
      }
    }
  }, [reviewsCompleted, user?.lastReviewReset, checkAndResetReviews]);
  
  const currentProduct = products.length > 0 ? products[currentProductIndex % products.length] : null;
  
  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isReviewing && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isReviewing) {
      handleSkip();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isReviewing, timeRemaining]);
  
  const startReview = () => {
    setIsReviewing(true);
    setTimeRemaining(30);
  };
  
  const handleLike = () => {
    // Updated reward value to $1.00 per like
    const reward = 1.00;
    setEarnedToday((prev) => prev + reward);
    setResults(prev => [...prev, {type: 'like', reward}]);
    
    // Update user balance and complete a review
    completeReview('like');
    
    // Add transaction to history
    addTransaction({
      amount: reward,
      type: 'like',
      status: 'completed'
    });
    
    toast({
      title: t('reviewSubmitted'),
      description: `${t('youEarned')} $${reward.toFixed(2)} ${t('forThisReview')}!`,
    });
    
    nextProduct();
  };
  
  const handleDislike = () => {
    // Updated reward value to $0.75 per dislike
    const reward = 0.75;
    setEarnedToday((prev) => prev + reward);
    setResults(prev => [...prev, {type: 'dislike', reward}]);
    
    // Update user balance and complete a review
    completeReview('like');
    
    // Add transaction to history
    addTransaction({
      amount: reward,
      type: 'like',
      status: 'completed'
    });
    
    toast({
      title: t('reviewSubmitted'),
      description: `${t('youEarned')} $${reward.toFixed(2)} ${t('forThisReview')}!`,
    });
    
    nextProduct();
  };
  
  const handleSkip = () => {
    setResults(prev => [...prev, {type: 'skip', reward: 0}]);
    
    toast({
      title: t('reviewSkipped'),
      description: t('didNotReceiveReward'),
      variant: "destructive",
    });
    
    nextProduct();
  };
  
  const nextProduct = () => {
    // Check if we reached the limit
    const newReviewsCompleted = reviewsCompleted + 1;
    
    if (newReviewsCompleted >= reviewsLimit) {
      setShowCooldown(true);
    } else {
      setCurrentProductIndex((prev) => prev + 1);
      setIsReviewing(false);
      setTimeRemaining(30);
    }
  };

  return {
    loading,
    products,
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
  };
};
