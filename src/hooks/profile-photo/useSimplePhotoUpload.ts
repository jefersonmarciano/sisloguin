import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useSimplePhotoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { user, updateUserAvatar } = useAuth();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const attemptRef = useRef<number>(0);
  
  // Limpar timeout quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Converte uma string base64 para um Blob
   */
  const base64ToBlob = (base64: string, mimeType: string = 'image/jpeg'): Blob | null => {
    try {
      // Remover cabeçalho da string base64 (ex: data:image/jpeg;base64,)
      const base64Data = base64.split(',')[1];
      if (!base64Data) {
        console.error('Formato base64 inválido');
        return null;
      }

      // Converter para blob
      const byteString = atob(base64Data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      return new Blob([ab], { type: mimeType });
    } catch (error) {
      console.error('Erro ao converter base64 para blob:', error);
      return null;
    }
  };

  // Função para definir isUploading com segurança (com timeout)
  const setUploadingWithSafety = (value: boolean) => {
    // Se estamos desativando o loading, limpamos qualquer timeout
    if (!value) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsUploading(false);
      attemptRef.current = 0;
      return;
    }
    
    // Se estamos ativando o loading, definimos um timeout
    setIsUploading(true);
    attemptRef.current++;
    
    // Definir timeout para resetar após 30 segundos
    timeoutRef.current = setTimeout(() => {
      console.log("Timeout de upload atingido, resetando estado", {
        attempt: attemptRef.current
      });
      
      setIsUploading(false);
      
      toast({
        variant: 'destructive',
        title: 'Tempo limite atingido',
        description: 'O processo está demorando muito. Tente novamente com uma foto menor.'
      });
    }, 30000); // 30 segundos
  };

  /**
   * Faz upload de uma foto de perfil (base64 ou URL)
   */
  const uploadPhoto = async (photoData: string): Promise<boolean> => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para alterar sua foto.'
      });
      return false;
    }
    
    // Verificar tamanho da imagem para avisar usuário
    if (photoData.length > 500000) { // ~500KB em base64
      console.warn("Imagem grande detectada", { size: photoData.length });
    }
    
    console.log("[SimpleUpload] Iniciando upload...", {
      isBase64: photoData.startsWith('data:'),
      isEmpty: photoData === '',
      length: photoData.length
    });

    setUploadingWithSafety(true);

    try {
      // Usar a função updateUserAvatar do AuthContext
      console.log("[SimpleUpload] Chamando updateUserAvatar");
      const success = await updateUserAvatar(photoData);
      
      console.log("[SimpleUpload] Resultado:", success);
      
      if (!success) {
        throw new Error('Falha ao atualizar avatar');
      }
      
      toast({
        title: photoData === '' ? 'Foto Removida' : 'Foto Atualizada',
        description: photoData === '' ? 'Sua foto de perfil foi removida.' : 'Sua foto de perfil foi atualizada com sucesso.'
      });
      
      return true;
    } catch (error: any) {
      console.error('[SimpleUpload] Erro completo:', error);
      
      // Verificar se é um timeout ou outro erro
      const isTimeoutError = error.message?.toLowerCase().includes('timeout') || 
                            timeoutRef.current === null;
      
      toast({
        variant: 'destructive',
        title: isTimeoutError ? 'Tempo Limite Excedido' : 'Erro',
        description: isTimeoutError 
          ? 'A operação demorou muito tempo. Tente com uma imagem menor.' 
          : (error.message || 'Não foi possível atualizar sua foto')
      });
      
      return false;
    } finally {
      setUploadingWithSafety(false);
    }
  };

  return {
    isUploading,
    uploadPhoto
  };
}; 