import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const usePhotoStorage = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, updateUserAvatar } = useAuth();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const uploadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Limpar timeout quando componente for desmontado
  useEffect(() => {
    return () => {
      if (uploadTimeoutRef.current) {
        clearTimeout(uploadTimeoutRef.current);
      }
    };
  }, []);

  // Função para definir o estado de upload com um timeout de segurança
  const setUploadingWithSafety = (uploading: boolean) => {
    // Limpar qualquer timeout existente
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current);
      uploadTimeoutRef.current = null;
    }
    
    setIsUploading(uploading);
    
    // Se estamos iniciando um upload, definir um timeout de segurança
    if (uploading) {
      uploadTimeoutRef.current = setTimeout(() => {
        console.log("⚠️ Upload timeout - resetting state");
        setIsUploading(false);
        toast({
          variant: 'destructive',
          title: t('uploadTimeout') || 'Upload Timeout',
          description: t('uploadTakingTooLong') || 'The upload is taking too long. Please try again.'
        });
      }, 15000); // 15 segundos de timeout
    }
  };

  const handlePhotoUpload = async (imageData: string | null) => {
    if (!imageData || !user) {
      return false;
    }
    
    setUploadingWithSafety(true);
    
    try {
      console.log("Iniciando upload de foto no hook usePhotoStorage");
      
      // Usa o método melhorado de updateUserAvatar que agora lida com uploads base64
      const success = await updateUserAvatar(imageData);
      
      console.log("Resultado do upload:", success);
      
      if (success) {
        toast({
          title: t('photoUpdated'),
          description: t('profilePhotoSuccessfullyUpdated'),
        });
      }
      
      return success;
    } catch (error) {
      console.error("Avatar upload error:", error);
      // Não mostrar erro ao usuário, pois o updateUserAvatar já faz isso
      return false;
    } finally {
      setUploadingWithSafety(false);
    }
  };
  
  const handleRemovePhoto = async () => {
    setUploadingWithSafety(true);
    
    try {
      console.log("Iniciando remoção de foto");
      
      // Reset para avatar vazio
      const success = await updateUserAvatar('');
      
      console.log("Resultado da remoção:", success);
      
      if (success) {
        toast({
          title: t('photoRemoved'),
          description: t('profilePhotoSuccessfullyRemoved'),
        });
      }
      
      return success;
    } catch (error) {
      console.error("Error removing avatar:", error);
      return false;
    } finally {
      setUploadingWithSafety(false);
    }
  };

  return {
    isUploading,
    handlePhotoUpload,
    handleRemovePhoto
  };
};
