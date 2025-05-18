
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '../../../contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

export const useProfileForm = () => {
  const { user, updateUserProfile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setName(user.fullName || user.name || '');
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
      
      // Use the Auth context method to update the user profile
      const success = await updateUserProfile(name, email);
      
      if (success) {
        toast({
          title: t('profileUpdated'),
          description: t('profileSuccessfullyUpdated'),
        });
      } else {
        throw new Error(t('updateFailed'));
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: t('updateFailed'),
        description: error.message || t('anErrorOccurredWhileUpdatingYourProfile'),
      });
    } finally {
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
