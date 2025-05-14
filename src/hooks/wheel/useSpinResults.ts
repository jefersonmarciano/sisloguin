
import { useState, useCallback } from 'react';
import { SpinResult } from '../../pages/LuckyWheel/types';

/**
 * Custom hook for tracking wheel spin results
 */
export const useSpinResults = () => {
  const [spinResults, setSpinResults] = useState<SpinResult[]>([]);

  const addSpinResult = useCallback((prize: number) => {
    const result: SpinResult = {
      prize,
      timestamp: new Date()
    };
    setSpinResults((prev) => [...prev, result]);
  }, []);

  const clearSpinResults = useCallback(() => {
    setSpinResults([]);
  }, []);

  const calculateTotalEarnings = useCallback(() => {
    return spinResults.reduce((total, result) => total + result.prize, 0);
  }, [spinResults]);

  return {
    spinResults,
    addSpinResult,
    clearSpinResults,
    calculateTotalEarnings
  };
};
