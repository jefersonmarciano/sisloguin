
import React from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { usePasswordRecovery } from './hooks/usePasswordRecovery';
import PasswordUpdateForm from './components/PasswordUpdateForm';
import ProcessingState from './components/ProcessingState';
import RedirectNotice from './components/RedirectNotice';

const NewPassword: React.FC = () => {
  // We don't redirect in this component as it needs to be accessible
  // for both authenticated and unauthenticated users during password recovery
  const { isInitializing } = useRequireAuth({ redirectIfAuthenticated: false });
  const { isPasswordRecovery, isProcessingToken } = usePasswordRecovery();
  
  // If still initializing auth, don't render anything yet
  if (isInitializing) {
    return <ProcessingState />;
  }

  // If still processing token, show loading state
  if (isProcessingToken) {
    return <ProcessingState />;
  }

  // If not in password recovery mode, show redirect notice
  if (!isPasswordRecovery) {
    return <RedirectNotice />;
  }

  // If in password recovery mode, show password update form
  return <PasswordUpdateForm />;
};

export default NewPassword;
