// components/auth/ForgotPassword.tsx

import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

export const ForgotPassword: React.FC<{
  onCancel: () => void;
  onEmailSent?: (email: string) => void;
}> = ({ onCancel, onEmailSent }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast({
        variant: 'destructive',
        title: t('emailRequired'),
        description: t('pleaseEnterYourEmail'),
      });
      return;
    }

    try {
      setIsLoading(true);
      const siteURL = 'https://cloud-profit.lovable.app';
      console.log('siteURL:', siteURL);
      const redirectTo = `${siteURL}/new-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;

      toast({
        title: t('resetLinkSent'),
        description: t('pleaseCheckYourEmail'),
      });

      if (onEmailSent) onEmailSent(email);
    } catch (error: any) {
      console.error('Reset link error:', error);
      toast({
        variant: 'destructive',
        title: t('errorSendingResetLink'),
        description: error.message || t('pleaseTryAgainLater'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">{t('resetPassword')}</h2>
        <p className="text-sm text-gray-400 mt-2">
          {t('enterYourEmailToReceiveResetLink')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-200">
            {t('email')}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            autoComplete="email"
            className="w-full bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-500/50"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
            disabled={isLoading}
          >
            {t('cancel')}
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 hover:border-orange-500/50" 
            disabled={isLoading}
          >
            {isLoading ? t('sending') + '...' : t('sendResetLink')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
