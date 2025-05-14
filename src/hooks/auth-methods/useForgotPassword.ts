
// This file is kept for backward compatibility
// It now imports and re-exports methods from useAuthService
import { useState } from 'react';
import { useAuthService } from '../useAuthService';

export const useForgotPassword = () => {
  const { resetPassword, loading: isLoading } = useAuthService();

  return {
    resetPassword,
    isLoading
  };
};
