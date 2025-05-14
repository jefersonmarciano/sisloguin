
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuthService } from '@/hooks/useAuthService';

interface UpdatePasswordProps {
  onComplete: () => void;
}

export const UpdatePassword: React.FC<UpdatePasswordProps> = ({ onComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { updatePassword, loading } = useAuthService();
  
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

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
      const result = await updatePassword(password);
      
      if (result.success) {
        toast({
          title: t('passwordUpdateSuccess'),
          description: t('passwordUpdateSuccessMessage'),
        });
        
        // Redirect to login
        onComplete();
      } else {
        toast({
          variant: 'destructive',
          title: t('loginFailed'),
          description: result.error || t('passwordUpdateFailed'),
        });
      }
    } catch (error: any) {
      console.error('Password update error:', error);
      toast({
        variant: 'destructive',
        title: t('loginFailed'),
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('updatePassword')}</h2>
      <p>{t('enterNewPassword')}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('password')}</label>
          <Input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">{t('confirmPassword')}</label>
          <Input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••" 
            disabled={loading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-green-500 hover:bg-green-600" 
          disabled={loading}
        >
          {loading ? (
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
