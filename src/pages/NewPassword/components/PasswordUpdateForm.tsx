
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface PasswordUpdateFormProps {
  onSubmitSuccess?: () => void;
}

const PasswordUpdateForm: React.FC<PasswordUpdateFormProps> = ({ onSubmitSuccess }) => {
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
      
      // Redirect to login after successful password update
      setTimeout(() => {
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
        navigate('/auth');
      }, 2000);
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
    <div className="animate-fade-in flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{t('updatePassword')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{t('enterNewPassword')}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t('password')}</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">{t('confirmPassword')}</label>
              <Input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••" 
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
                  {t('updating')}
                </>
              ) : t('updatePassword')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordUpdateForm;
