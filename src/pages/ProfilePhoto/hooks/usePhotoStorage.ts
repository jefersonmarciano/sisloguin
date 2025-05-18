
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

export const usePhotoStorage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, updateUserAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Function to create the avatars bucket if it doesn't exist
  const createAvatarBucket = async () => {
    try {
      // First check if bucket exists
      const { data: buckets, error: listError } = await supabase.storage.listBuckets();
      
      if (listError) {
        console.error("Error listing buckets:", listError);
        return false;
      }
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'avatars') || false;
      
      // If bucket doesn't exist, create it
      if (!bucketExists) {
        const { data, error } = await supabase.storage.createBucket('avatars', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (error) {
          console.error("Error creating bucket:", error);
          return false;
        }
        
        return true;
      }
      
      return bucketExists;
    } catch (error) {
      console.error("Error creating bucket:", error);
      return false;
    }
  };

  const handlePhotoUpload = async (imageData: string | null) => {
    if (!imageData) {
      return false;
    }
    
    if (!user) {
      return false;
    }
    
    setIsUploading(true);
    
    try {
      // Always use the base64 data for avatar updates
      // This is a more reliable approach that works regardless of bucket setup
      const success = await updateUserAvatar(imageData);
      
      if (success) {
        // Only show success toast when we succeed
        toast({
          title: t('photoUpdated'),
          description: t('profilePhotoSuccessfullyUpdated'),
        });
      }
      
      // Try to create the bucket for future use, but don't depend on it
      createAvatarBucket().catch(err => {
        // Silently log error without showing to user
        console.warn("Failed to create bucket:", err);
      });
      
      return success;
    } catch (error) {
      console.error("Avatar upload error:", error);
      // Don't show error to user
      return false;
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemovePhoto = async () => {
    setIsUploading(true);
    
    try {
      // Reset to default avatar or placeholder
      const success = await updateUserAvatar('');
      
      if (success) {
        toast({
          title: t('photoRemoved'),
          description: t('profilePhotoSuccessfullyRemoved'),
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error removing avatar:", error);
      // Don't show error to user
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    handlePhotoUpload,
    handleRemovePhoto
  };
};
