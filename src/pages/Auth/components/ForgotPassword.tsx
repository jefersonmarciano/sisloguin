
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuthService } from '@/hooks/useAuthService';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

interface FormData {
  email: string;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const { t } = useLanguage();
  const { resetPassword, loading } = useAuthService();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    const result = await resetPassword(data.email);
    if (result.success) {
      setIsSuccess(true);
    }
  };
  
  if (isSuccess) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{t('checkYourEmail')}</h2>
        <p>{t('passwordResetLinkSent')}</p>
        <Button onClick={onBackToLogin} className="mt-4 w-full">
          {t('backToLogin')}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('forgotPassword')}</h2>
      <p>{t('forgotPasswordDescription')}</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t('email')}</label>
          <Input 
            {...register('email', { 
              required: t('emailRequired'),
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: t('invalidEmail')
              }
            })}
            placeholder="name@example.com"
            disabled={loading}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('sending')}
            </>
          ) : t('sendPasswordResetLink')}
        </Button>
        
        <Button 
          type="button"
          variant="outline" 
          className="w-full mt-2" 
          onClick={onBackToLogin}
          disabled={loading}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToLogin')}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
