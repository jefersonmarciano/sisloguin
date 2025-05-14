
import { useState, useCallback, useMemo } from 'react';
import { useToast } from '../../../hooks/use-toast';
import { useAuth } from '../../../contexts/AuthContext';
import { useEarnings } from '../../../contexts/EarningsContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { WheelSegment } from '../types';
import confetti from 'canvas-confetti';

export const useWheelSpin = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, updateBalance, useWheel } = useAuth();
  const { addTransaction } = useEarnings();
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDegrees, setSpinDegrees] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentPrize, setCurrentPrize] = useState<number | null>(null);
  const [wheelResults, setWheelResults] = useState<number[]>([]);
  
  // Wheel segments with updated higher values (3-7 dollars and one $100 prize)
  const segments: WheelSegment[] = useMemo(() => [
    { value: 3.00, color: '#f97316', label: '$3.00' },
    { value: 5.00, color: '#3498db', label: '$5.00' },
    { value: 4.00, color: '#2ecc71', label: '$4.00' },
    { value: 0.00, color: '#374151', label: t('tryAgain') },
    { value: 7.00, color: '#9b59b6', label: '$7.00' },
    { value: 100.00, color: '#e67e22', label: '$100.00' },
    { value: 6.00, color: '#f39c12', label: '$6.00' },
    { value: 0.00, color: '#374151', label: t('tryAgain') },
  ], [t]);
  
  const segmentAngle = 360 / segments.length;

  // Handle spin logic with enhanced animations for a more realistic feel
  const handleSpin = useCallback((wheelsRemaining: number) => {
    if (isSpinning || wheelsRemaining <= 0) return;

    setIsSpinning(true);
    setShowResult(false);

    // Haptic feedback for mobile
    if (navigator.vibrate) navigator.vibrate(100);
    
    // Calculate random result
    const winningSegmentIndex = Math.floor(Math.random() * segments.length);
    const prize = segments[winningSegmentIndex].value;
    
    // Calculate a smooth spin with full rotations + the result angle
    // More rotations (8-10) for more dramatic effect and proper randomness perception
    const fullRotations = 8 + Math.floor(Math.random() * 3);
    const resultAngle = 360 - (winningSegmentIndex * segmentAngle);
    const totalDegrees = fullRotations * 360 + resultAngle;
    
    // Set the total spin degrees for a complete animation
    setSpinDegrees(totalDegrees);
    setCurrentPrize(prize);
    
    // Handle result after animation completes
    setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);
      
      // Update user balance and wheels remaining
      updateBalance(prize);
      
      // Use wheel (decrement remaining wheels)
      useWheel();
      
      // Add transaction to history
      addTransaction({
        amount: prize,
        type: 'wheel',
        status: 'completed'
      });

      // Save result
      setWheelResults(prev => [...prev, prize]);

      // Trigger confetti for non-zero prizes
      if (prize > 0) {
        confetti({
          particleCount: prize >= 100 ? 200 : 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: prize >= 100 ? ['#FFD700', '#f97316', '#FFDF00'] : undefined
        });
      }
      
      if (prize > 0) {
        toast({
          title: t('congratulations'),
          description: `${t('youWon')} $${prize.toFixed(2)}!`,
          variant: "default",
        });
      } else {
        toast({
          title: t('tryAgain'),
          description: t('betterLuckNextTime'),
          variant: "default",
        });
      }
    }, 8000); // 8 seconds for the complete animation
  }, [isSpinning, segments, segmentAngle, addTransaction, updateBalance, toast, useWheel, t]);

  const closeResult = useCallback(() => {
    setShowResult(false);
    setSpinDegrees(0);
  }, []);

  return {
    isSpinning,
    spinDegrees,
    showResult,
    setShowResult,
    currentPrize,
    wheelResults,
    setWheelResults,
    segments,
    handleSpin,
    closeResult
  };
};
