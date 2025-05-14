
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExpiredResetLinkProps {
  onBackToLogin: () => void;
  errorMessage?: string;
}

const ExpiredResetLink: React.FC<ExpiredResetLinkProps> = ({ onBackToLogin, errorMessage }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resetSent, setResetSent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        variant: 'destructive',
        title: t('formError'),
        description: t('pleaseEnterEmail'),
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Make sure to use the current window's origin to ensure we're using the correct domain
      const currentUrl = window.location.origin;
      
      // Make sure we redirect directly to new-password route
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${currentUrl}/new-password`,
      });
      
      if (error) throw error;
      
      setResetSent(true);
      toast({
        title: t('resetPasswordLinkSent'),
        description: t('checkYourEmail'),
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        variant: 'destructive',
        title: t('loginFailed'),
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-red-600">{t('expiredResetLink')}</h2>
      <p className="text-gray-700">{errorMessage || t('resetLinkExpired')}</p>
      
      {resetSent ? (
        <div className="text-center space-y-4">
          <p className="text-green-600">{t('resetPasswordLinkSent')}</p>
          <p>{t('checkYourEmail')}</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={onBackToLogin}
          >
            {t('backToLogin')}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p>{t('requestNewResetLink')}</p>
          
          <div>
            <label className="block text-sm font-medium mb-1">{t('email')}</label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com" 
              disabled={isSubmitting}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-600" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('sendingResetLink')}
              </>
            ) : t('sendNewResetLink')}
          </Button>
          
          <div className="text-center">
            <Button 
              variant="ghost" 
              type="button"
              onClick={onBackToLogin}
            >
              {t('backToLogin')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ExpiredResetLink;
