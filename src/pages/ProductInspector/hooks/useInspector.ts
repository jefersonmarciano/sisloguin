import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useEarnings } from '../../../contexts/EarningsContext';
import { useToast } from '../../../hooks/use-toast';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Product, MultiLanguageProduct } from '../types';

export const useInspector = (products: MultiLanguageProduct[]) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { user, completeReview, checkAndResetReviews } = useAuth();
  const { addTransaction } = useEarnings();
  
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [isInspecting, setIsInspecting] = useState(false);
  const [earnedToday, setEarnedToday] = useState(0);
  const [results, setResults] = useState<{correct: boolean, reward: number}[]>([]);
  const [showCooldown, setShowCooldown] = useState(false);
  const [randomizedProducts, setRandomizedProducts] = useState<MultiLanguageProduct[]>([]);
  
  // Get the number of inspector reviews completed
  const reviewsCompleted = user?.inspectorReviewsCompleted || 0;
  const reviewsLimit = 10;
  
  // Randomize products on initial load
  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setRandomizedProducts(shuffled);
    }
  }, [products]);
  
  // Convert MultiLanguageProduct to Product based on current language
  const getLocalizedProduct = useCallback((product: MultiLanguageProduct): Product => {
    const localizedContent = language === 'es' ? product.es : product.en;
    return {
      id: product.id,
      name: localizedContent.name,
      description: localizedContent.description,
      image: localizedContent.image,
      price: product.price,
      question: localizedContent.question,
      issues: product.issues
    };
  }, [language]);
  
  const currentMultiLangProduct = randomizedProducts.length > 0 ? 
    randomizedProducts[currentProductIndex % randomizedProducts.length] : null;
  
  const currentProduct = currentMultiLangProduct ? 
    getLocalizedProduct(currentMultiLangProduct) : null;
  
  const hasIssues = currentMultiLangProduct?.issues && currentMultiLangProduct.issues.length > 0;
  
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

  useEffect(() => {
    // Check if reviews need to be reset when component loads
    checkAndResetReviews();
  }, [checkAndResetReviews]);
  
  const startInspection = useCallback(() => {
    setIsInspecting(true);
  }, []);
  
  const handleSafe = useCallback(() => {
    if (!currentProduct) return;
    
    // Updated rewards between 3-7 dollars
    const reward = hasIssues ? 3.25 : 6.50;
    const correct = !hasIssues;
    
    setEarnedToday((prev) => prev + reward);
    setResults(prev => [...prev, {correct, reward}]);
    
    // Update user balance and complete a review
    completeReview('inspector');
    
    // Add transaction to history
    addTransaction({
      amount: reward,
      type: 'inspector',
      status: 'completed'
    });
    
    toast({
      title: correct ? t("correctAssessment") : t("incorrectAssessment"),
      description: `${t("youEarned")} $${reward.toFixed(2)} ${t("forThisInspection")}!`,
      variant: correct ? "default" : "destructive",
    });
    
    nextProduct();
  }, [currentProduct, hasIssues, completeReview, addTransaction, toast, t]);
  
  const handleRequiresAttention = useCallback(() => {
    if (!currentProduct) return;
    
    // Updated rewards between 3-7 dollars
    const reward = hasIssues ? 3.25 : 1.625;
    const correct = hasIssues;
    
    setEarnedToday((prev) => prev + reward);
    setResults(prev => [...prev, {correct, reward}]);
    
    // Update user balance and complete a review
    completeReview('inspector');
    
    // Add transaction to history
    addTransaction({
      amount: reward,
      type: 'inspector',
      status: 'completed'
    });
    
    toast({
      title: correct ? t("correctAssessment") : t("incorrectAssessment"),
      description: `${t("youEarned")} $${reward.toFixed(2)} ${t("forThisInspection")}!`,
      variant: correct ? "default" : "destructive",
    });
    
    nextProduct();
  }, [currentProduct, hasIssues, completeReview, addTransaction, toast, t]);
  
  const nextProduct = useCallback(() => {
    // Check if we reached the limit
    const newReviewsCompleted = reviewsCompleted + 1;
    
    if (newReviewsCompleted >= reviewsLimit) {
      setShowCooldown(true);
    } else {
      setCurrentProductIndex((prev) => prev + 1);
      setIsInspecting(false);
    }
  }, [reviewsCompleted, reviewsLimit]);
  
  return {
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
  };
};
