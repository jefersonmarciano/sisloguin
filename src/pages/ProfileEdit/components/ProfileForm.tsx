
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface ProfileFormProps {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  isSubmitting: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  name,
  setName,
  email,
  setEmail,
  isSubmitting,
  handleSubmit
}) => {
  const { t } = useLanguage();
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input 
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input 
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
          required
          disabled={isSubmitting}
        />
        <p className="text-xs text-gray-500">{t('changeEmailNote') || 'Se você alterar seu email, precisará verificá-lo novamente.'}</p>
      </div>
      
      <Button 
        type="submit" 
        className="bg-temu-orange hover:bg-orange-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('saving')}
          </>
        ) : t('saveChanges')}
      </Button>
    </form>
  );
};

export default ProfileForm;
