
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
        />
      </div>
      
      <Button 
        type="submit" 
        className="bg-sisloguin-orange hover:bg-orange-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? t('saving') : t('saveChanges')}
      </Button>
    </form>
  );
};

export default ProfileForm;
