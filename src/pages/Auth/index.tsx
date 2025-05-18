import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AuthContainer from './components/AuthContainer';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

const Auth = () => {
  const { isAuthenticated, isInitializing, login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const fetchAndSaveCountryInfo = async (userId: string) => {
    try {
      // First check if country info already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('country_code')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // Ignore "no rows found" error
        throw fetchError;
      }

      // If country info doesn't exist, fetch it
      if (!existingProfile?.country_code) {
        const response = await fetch('https://ipwhois.app/json/');
        const locationData = await response.json();
        console.log('Fetched location data:', locationData);
        const countryInfo = {
          country_code: `${locationData.region}, ${locationData.country_code}`,
          updated_at: new Date().toISOString()
        };

        // Update the profile with country info
        const { error: updateError } = await supabase
          .from('profiles')
          .update(countryInfo)
          .eq('id', userId);

        if (updateError) throw updateError;
      }
    } catch (error) {
      console.error('Error fetching/saving country info:', error);
      // Fail silently - this shouldn't block the user from logging in
    }
  };

  // Check for password recovery on load
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const errorCode = hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');
    
    if (errorCode === 'otp_expired') {
      console.error('Password reset link expired:', errorDescription);
      toast({
        variant: 'destructive',
        title: t('resetPasswordLinkExpired'),
        description: t('resetPasswordLinkExpiredMessage'),
        action: (
          <Button
            variant="outline"
            onClick={() => navigate('/auth')}
          >
            {t('requestNewResetLink')}
          </Button>
        ),
      });
    }
    
    const type = hashParams.get('type');
    if (type === 'recovery') {
      console.log('Recovery parameter found in URL, redirecting to new-password');
      navigate('/new-password');
      return;
    }

    // Listen for auth state changes to detect PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event detected in Auth component:', event);
      if (event === 'PASSWORD_RECOVERY') {
        console.log('PASSWORD_RECOVERY event detected, redirecting to new-password');
        navigate('/new-password');
        return;
      }
      
      // When signed in, check and update country info if needed
      if (event === 'SIGNED_IN') {
        await fetchAndSaveCountryInfo(session.user.id);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate, t]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isInitializing) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // Handle login submission
  const handleLogin = async (email: string, password: string): Promise<void> => {
    const { user, error } = await login(email, password);
    if (user?.id && !error) {
      await fetchAndSaveCountryInfo(user.id);
      navigate('/dashboard');
    }
  };

  // Handle register submission
  const handleRegister = async (name: string, email: string, password: string, confirmPassword: string): Promise<void> => {
    const { user, error } = await register(email, password, name);
    if (user?.id && !error) {
      await fetchAndSaveCountryInfo(user.id);
      toast({
        title: 'Registration successful',
        description: 'Welcome to App Profit!'
      });
      navigate('/dashboard');
    }
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-temu-orange" />
      </div>
    );
  }

  return (
    <AuthContainer 
      onLogin={handleLogin} 
      onRegister={handleRegister} 
    />
  );
};

export default Auth;