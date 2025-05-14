import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface RegisterFormProps {
  handleRegister: (email: string, password: string, name?: string) => Promise<void>;
}

interface FormValues {
  name: string;
  email: string;
  password: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ handleRegister }) => {
  const { t } = useLanguage();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await handleRegister(data.email, data.password, data.name);
    } catch (error) {
      console.error('Registration error in form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">{t('name')}</Label>
        <Input
          id="name"
          type="text"
          {...register('name', { required: t('nameRequired') })}
          placeholder={t('namePlaceholder')}
          className="w-full"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">{t('email')}</Label>
        <Input
          id="email"
          type="email"
          {...register('email', {
            required: t('emailRequired'),
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('invalidEmail')
            }
          })}
          placeholder={t('emailPlaceholder')}
          className="w-full"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">{t('password')}</Label>
        <Input
          id="password"
          type="password"
          {...register('password', { required: t('passwordRequired'), minLength: 6 })}
          placeholder={t('passwordPlaceholder')}
          className="w-full"
        />
        {errors.password && <p className="text-red-500 text-sm">{t('passwordLength')}</p>}
      </div>
      <Button disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path d="M12 2V4M12 20V22M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M2 12H4M20 12H22M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {t('signingUp')}
          </>
        ) : (
          t('register')
        )}
      </Button>
    </form>
  );
};

export default RegisterForm;
