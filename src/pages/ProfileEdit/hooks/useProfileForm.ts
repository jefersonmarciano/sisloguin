
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../hooks/use-toast';
import { useLanguage } from '../../../contexts/LanguageContext';

export const useProfileForm = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!name.trim() || !email.trim()) {
        throw new Error(t('nameAndEmailRequired'));
      }
      
      // Simulate a successful update
      setTimeout(() => {
        toast({
          title: t('profileUpdated'),
          description: t('profileSuccessfullyUpdated'),
        });
        setIsSubmitting(false);
      }, 500);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('updateFailed'),
        description: error.message || t('anErrorOccurredWhileUpdatingYourProfile'),
      });
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    isSubmitting,
    handleSubmit
  };
};
