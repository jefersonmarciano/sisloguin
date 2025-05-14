
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import AuthHeader from './AuthHeader';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPassword from './ForgotPassword';
import UpdatePassword from './UpdatePassword';
import ExpiredResetLink from './ExpiredResetLink';

export const AuthContainer: React.FC = () => {
  const { t } = useLanguage();
  const { login, signup } = useAuth(); // Changed from register to signup
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState<boolean>(false);
  const [showExpiredLinkError, setShowExpiredLinkError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [initialized, setInitialized] = useState<boolean>(false);
  
  // Check URL for hash params and errors upon mount
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    const errorCode = hashParams.get('error_code');
    const errorDesc = hashParams.get('error_description');
    
    if (errorCode === 'otp_expired' || errorCode === 'access_denied') {
      console.log('Password reset link expired or invalid');
      setShowExpiredLinkError(true);
      setErrorMessage(errorDesc ? decodeURIComponent(errorDesc.replace(/\+/g, ' ')) : '');
      // Clear the error from the URL
      window.history.replaceState(null, '', window.location.pathname);
    } else if (type === 'recovery') {
      console.log('Recovery parameter found in URL');
      setShowUpdatePassword(true);
      setShowForgotPassword(false);
      setShowExpiredLinkError(false);
    }

    // Mark initialization as complete
    setInitialized(true);
  }, []);
  
  // Listen for password recovery event from Supabase
  useEffect(() => {
    // Only set up the subscription after initial URL check is complete
    if (!initialized) return;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event detected:', event);
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery flow detected');
        setShowUpdatePassword(true);
        setShowForgotPassword(false);
        setShowExpiredLinkError(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [initialized]);
  
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowUpdatePassword(false);
    setShowExpiredLinkError(false);
  };
  
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowUpdatePassword(false);
    setShowExpiredLinkError(false);
  };
  
  return (
    <div className="animate-fade-in flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <AuthHeader />
        
        {showExpiredLinkError ? (
          <ExpiredResetLink 
            onBackToLogin={handleBackToLogin}
            errorMessage={errorMessage} 
          />
        ) : showUpdatePassword ? (
          <UpdatePassword onComplete={handleBackToLogin} />
        ) : showForgotPassword ? (
          <ForgotPassword onBackToLogin={handleBackToLogin} />
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="login">{t('login')}</TabsTrigger>
              <TabsTrigger value="register">{t('register')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                handleLogin={login}
                onForgotPassword={handleForgotPasswordClick} 
              />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm handleRegister={signup} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
