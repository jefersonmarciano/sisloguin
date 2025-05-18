import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
  handleLogin: (email: string, password: string) => Promise<void>;
  onForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ handleLogin, onForgotPassword }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!loginEmail || !loginPassword) {
      setLoginError(t('pleaseEnterEmailAndPassword'));
      return;
    }
    
    try {
      setIsSubmitting(true);
      await handleLogin(loginEmail, loginPassword);
    } catch (error: any) {
      console.error('Login error:', error);
      setLoginError(error.message || t('loginFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      {/* New User Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex gap-2 items-center text-blue-400 mb-2 font-medium">
          <UserPlus size={18} />
          <h3>{t('newUser')}</h3>
        </div>
        <p className="text-sm text-blue-300">
          {t('newUserInstructions')}
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-200">{t('email')}</label>
          <Input 
            type="email" 
            id="login-email"
            name="login-email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="email@example.com" 
            disabled={isSubmitting}
            className="bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-orange-500/50"
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-200">{t('password')}</label>
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto text-emerald-400 hover:text-emerald-300"
              onClick={onForgotPassword}
            >
              {t('forgotPassword')}
            </Button>
          </div>
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"} 
              id="login-password"
              name="login-password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
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
        </div>
        
        {loginError && (
          <div className="text-red-400 text-sm">{loginError}</div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('loggingIn')}
            </>
          ) : t('login')}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
