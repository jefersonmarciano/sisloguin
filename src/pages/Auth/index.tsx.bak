
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import AuthContainer from './components/AuthContainer';
import { supabase } from '@/integrations/supabase/client';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const Auth = () => {
  const { isInitializing } = useRequireAuth({ redirectIfAuthenticated: true, redirectToSaved: true });
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check for password recovery on load
  useEffect(() => {
    // Parse hash fragment for recovery tokens
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const errorCode = hashParams.get('error_code');
    const errorDescription = hashParams.get('error_description');
    
    // If there's an expired OTP error, the component AuthContainer will handle it
    // We just need to log it here for debugging
    if (errorCode) {
      console.error('Password reset error:', errorCode, errorDescription);
    }
    
    // Check for recovery type in hash params
    const type = hashParams.get('type');
    if (type === 'recovery') {
      console.log('Recovery parameter found in URL, redirecting to new-password');
      navigate('/new-password');
      return;
    }

    // Listen for auth state changes to detect PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event detected in Auth component:', event);
      if (event === 'PASSWORD_RECOVERY') {
        console.log('PASSWORD_RECOVERY event detected, redirecting to new-password');
        navigate('/new-password');
        return;
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  // Show loading spinner during initialization
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-temu-orange" />
      </div>
    );
  }

  // The Auth component doesn't need handleLogin/handleRegister methods anymore
  // These will be handled directly by AuthContainer, which gets access to auth context methods
  return <AuthContainer />;
};

export default Auth;
