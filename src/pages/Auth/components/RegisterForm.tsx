import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface RegisterFormProps {
  handleRegister: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ handleRegister }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registerName, setRegisterName] = useState<string>('');
  const [registerEmail, setRegisterEmail] = useState<string>('');
  const [registerPassword, setRegisterPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [registerError, setRegisterError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    
    // Validation
    if (!registerName || !registerEmail || !registerPassword || !confirmPassword) {
      setRegisterError(t('pleaseFillAllFields'));
      return;
    }
    
    if (registerPassword !== confirmPassword) {
      setRegisterError(t('passwordsDoNotMatch'));
      return;
    }
    
    if (registerPassword.length < 6) {
      setRegisterError(t('passwordTooShort'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      await handleRegister(registerName, registerEmail, registerPassword, confirmPassword);
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegisterError(error.message || t('registrationFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-200">{t('name')}</label>
        <Input 
          type="text" 
          id="register-name"
          name="register-name"
          value={registerName}
          onChange={(e) => setRegisterName(e.target.value)}
          placeholder={t('yourName')} 
          disabled={isSubmitting}
          className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-500/50"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-200">{t('email')}</label>
        <Input 
          type="email" 
          id="register-email"
          name="register-email"
          value={registerEmail}
          onChange={(e) => setRegisterEmail(e.target.value)}
          placeholder="email@example.com" 
          disabled={isSubmitting}
          className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-500/50"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-200">{t('password')}</label>
        <div className="relative">
          <Input 
            type={showPassword ? "text" : "password"}
            id="register-password"
            name="register-password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            placeholder="••••••••" 
            disabled={isSubmitting}
            className="pr-10 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-500/50"
          />
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-300"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-1">{t('passwordRequirements')}</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-200">{t('confirmPassword')}</label>
        <div className="relative">
          <Input 
            type={showConfirmPassword ? "text" : "password"}
            id="register-confirm-password"
            name="register-confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••" 
            disabled={isSubmitting}
            className="pr-10 bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-500/50"
          />
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-300"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        </div>
      </div>
      
      {registerError && (
        <div className="text-red-400 text-sm">{registerError}</div>
      )}
      
      <Button 
        type="submit" 
        className="w-full bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 hover:border-orange-500/50" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('registering')}
          </>
        ) : t('register')}
      </Button>
    </form>
  );
};

export default RegisterForm;
