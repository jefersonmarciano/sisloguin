import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UpdatePasswordProps {
  onComplete: () => void;
}

export const UpdatePassword: React.FC<UpdatePasswordProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('loginFailed'),
        description: t('pleaseFillAllFields'),
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: t('loginFailed'),
        description: t('passwordsDoNotMatch'),
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: t('loginFailed'),
        description: t('passwordTooShort'),
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast({
        title: t('passwordUpdateSuccess'),
        description: t('passwordUpdateSuccessMessage'),
      });
      
      // Redirect to login
      onComplete();
    } catch (error: any) {
      console.error('Password update error:', error);
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
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">{t('updatePassword')}</h2>
        <p className="text-gray-400 mt-2">{t('enterNewPassword')}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">{t('password')}</label>
          <Input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            disabled={isSubmitting}
            className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-500/50"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">{t('confirmPassword')}</label>
          <Input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••" 
            disabled={isSubmitting}
            className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-500/50"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('updating')}
            </>
          ) : t('updatePassword')}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
