import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import AuthHeader from './AuthHeader';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPassword from './ForgotPassword';
import UpdatePassword from './UpdatePassword';

interface AuthContainerProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({
  onLogin,
  onRegister,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState<boolean>(false);
  
  // Listen for password recovery event from Supabase
  useEffect(() => {
    // Use setTimeout to prevent Supabase auth callback deadlock
    setTimeout(() => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth event detected:', event);
        if (event === 'PASSWORD_RECOVERY') {
          console.log('Password recovery flow detected');
          setShowUpdatePassword(true);
          setShowForgotPassword(false);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }, 0);
  }, []);
  
  // Check URL for hash params upon mount
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type === 'recovery') {
      console.log('Recovery parameter found in URL');
      setShowUpdatePassword(true);
      setShowForgotPassword(false);
    }
  }, []);
  
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowUpdatePassword(false);
  };
  
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowUpdatePassword(false);
  };
  
  return (
    <div className="animate-fade-in flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-xl shadow-xl border border-gray-800">
        <AuthHeader />
        
        {showUpdatePassword ? (
          <UpdatePassword onComplete={handleBackToLogin} />
        ) : showForgotPassword ? (
          <ForgotPassword onBackToLogin={handleBackToLogin} />
        ) : (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'login' | 'register')}>
            <TabsList className="grid grid-cols-2 mb-8 bg-gray-800/50 p-1 rounded-lg">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
              >
                {t('login')}
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-gray-100"
              >
                {t('register')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                handleLogin={onLogin} 
                onForgotPassword={handleForgotPasswordClick} 
              />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm handleRegister={onRegister} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AuthContainer;
