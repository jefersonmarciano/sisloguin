
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePasswordRecovery } from './hooks/usePasswordRecovery';
import PasswordUpdateForm from './components/PasswordUpdateForm';
import ProcessingState from './components/ProcessingState';
import RedirectNotice from './components/RedirectNotice';

const NewPassword: React.FC = () => {
  const { isPasswordRecovery, isProcessingToken } = usePasswordRecovery();
  const navigate = useNavigate();
  
  // If not in password recovery mode, redirect to auth
  useEffect(() => {
    if (!isPasswordRecovery && !isProcessingToken) {
      const timer = setTimeout(() => {
        navigate('/auth');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isPasswordRecovery, isProcessingToken, navigate]);

  // If still processing token, show loading state
  if (isProcessingToken) {
    return <ProcessingState />;
  }

  // If not in password recovery mode, show redirect notice
  if (!isPasswordRecovery && !isProcessingToken) {
    return <RedirectNotice />;
  }

  // If in password recovery mode, show password update form
  return <PasswordUpdateForm />;
};

export default NewPassword;
