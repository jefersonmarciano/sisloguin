import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Upload, X, Camera, Bug, LinkIcon } from 'lucide-react';
import { useSimplePhotoUpload } from '@/hooks/profile-photo/useSimplePhotoUpload';
import { useToast } from '@/components/ui/use-toast';
import DiagnosticButton from './components/DiagnosticButton';
import FallbackPhotoUploader from './FallbackPhotoUploader';

const SimpleProfilePhoto = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const { isUploading, uploadPhoto } = useSimplePhotoUpload();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [debugClicks, setDebugClicks] = useState(0);
  const [uploadErrors, setUploadErrors] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  if (!user) {
    return (
      <div className="text-center p-4">
        {t('userNotAuthenticated')}
      </div>
    );
  }

  // Função para comprimir a imagem
  const compressImage = useCallback((dataUrl: string, maxWidth = 800, quality = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        setIsCompressing(true);
        const image = new Image();
        image.onload = () => {
          // Limitar tamanho máximo
          let width = image.width;
          let height = image.height;
          
          // Redimensionar se a largura for maior que o limite
          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }
          
          // Criar canvas para desenhar imagem redimensionada
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          // Desenhar imagem no canvas
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setIsCompressing(false);
            reject(new Error('Falha ao criar contexto 2D'));
            return;
          }
          
          ctx.drawImage(image, 0, 0, width, height);
          
          // Converter para dataURL com qualidade reduzida
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          
          console.log('Compressão:', {
            antes: Math.round(dataUrl.length / 1024),
            depois: Math.round(compressedDataUrl.length / 1024)
          });
          
          setIsCompressing(false);
          resolve(compressedDataUrl);
        };
        
        image.onerror = () => {
          setIsCompressing(false);
          reject(new Error('Falha ao carregar imagem para compressão'));
        };
        
        image.src = dataUrl;
      } catch (error) {
        setIsCompressing(false);
        reject(error);
      }
    });
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Verificar tipo e tamanho do arquivo
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast({
        variant: 'destructive',
        title: t('invalidFileType'),
        description: t('pleaseUploadValidImage')
      });
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB máximo
      toast({
        variant: 'destructive',
        title: t('fileTooLarge'),
        description: t('pleaseUploadSmallerImage')
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const originalImage = e.target.result.toString();
        
        try {
          // Comprimir a imagem se for maior que 300KB
          if (originalImage.length > 300000) {
            toast({
              title: 'Otimizando imagem',
              description: 'Aguarde enquanto sua imagem é otimizada...'
            });
            
            // Comprimir com diferentes parâmetros dependendo do tamanho
            let quality = 0.7;
            let maxWidth = 800;
            
            if (originalImage.length > 1000000) { // 1MB+
              quality = 0.5;
              maxWidth = 600;
            }
            
            if (originalImage.length > 3000000) { // 3MB+
              quality = 0.4;
              maxWidth = 500;
            }
            
            const compressedImage = await compressImage(originalImage, maxWidth, quality);
            setPreviewImage(compressedImage);
          } else {
            // Não comprimir imagens pequenas
            setPreviewImage(originalImage);
          }
        } catch (error) {
          console.error('Erro na compressão:', error);
          // Se falhar na compressão, usar imagem original
          setPreviewImage(originalImage);
          toast({
            variant: 'destructive',
            title: 'Erro na otimização',
            description: 'Falha ao otimizar imagem. Usando imagem original.'
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSavePhoto = async () => {
    if (previewImage) {
      try {
        const success = await uploadPhoto(previewImage);
        if (success) {
          setPreviewImage(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          setUploadErrors(0);
        } else {
          // Incrementar contador de erros
          setUploadErrors(prev => prev + 1);
          
          // Se tiver 2 ou mais erros, sugerir método alternativo
          if (uploadErrors >= 1) {
            toast({
              title: 'Problema detectado',
              description: 'Parece que há problemas com o upload. Tente o método alternativo.',
              variant: 'destructive'
            });
            setShowFallback(true);
          }
        }
      } catch (error) {
        setUploadErrors(prev => prev + 1);
        console.error('Erro ao fazer upload:', error);
      }
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await uploadPhoto('');
    } catch (error) {
      setUploadErrors(prev => prev + 1);
      console.error('Erro ao remover foto:', error);
      
      if (uploadErrors >= 1) {
        setShowFallback(true);
      }
    }
  };

  const isProcessing = isUploading || isCompressing;

  // Função para habilitar diagnóstico após 3 cliques no título
  const handleTitleClick = () => {
    setDebugClicks(prev => {
      const newCount = prev + 1;
      if (newCount >= 3) {
        setShowDiagnostic(true);
        return 0;
      }
      return newCount;
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 
        className="text-2xl font-bold mb-6 text-center cursor-pointer"
        onClick={handleTitleClick}
      >
        {t('changeProfilePhoto')}
      </h1>
      
      <div className="flex flex-col items-center space-y-4 mb-6">
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage 
              src={previewImage || user.avatar} 
              alt={user.name} 
            />
            <AvatarFallback className="bg-sisloguin-orange text-white text-2xl">
              {user.name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          
          {previewImage && !isProcessing && (
            <button 
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              onClick={handleRemovePreview}
              disabled={isProcessing}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="text-center">
          <p className="font-medium">{user.name}</p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>
      
      {!showFallback ? (
        <>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 text-center">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isProcessing}
            />
            
            <button 
              className="flex flex-col items-center justify-center w-full cursor-pointer disabled:cursor-not-allowed"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <div className="bg-gray-100 p-3 rounded-full mb-2">
                <Camera className="h-6 w-6 text-gray-600" />
              </div>
              <p className="font-medium mb-1">{t('uploadNewPhoto')}</p>
              <p className="text-sm text-gray-500">{t('jpgPngGif')}</p>
            </button>
          </div>
          
          {isCompressing && (
            <div className="mb-4 p-2 bg-blue-50 rounded text-center">
              <p className="text-blue-600 flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Otimizando imagem...
              </p>
            </div>
          )}
          
          <div className="flex space-x-3 mb-4">
            <Button
              className="flex-1"
              onClick={handleSavePhoto}
              disabled={!previewImage || isProcessing}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t('savePhoto')}
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRemovePhoto}
              disabled={isProcessing || !user.avatar}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('removing')}
                </>
              ) : (
                t('removePhoto')
              )}
            </Button>
          </div>
          
          {uploadErrors > 0 && (
            <Button
              variant="link"
              className="w-full text-orange-500"
              onClick={() => setShowFallback(true)}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Tentar método alternativo
            </Button>
          )}
        </>
      ) : (
        <div className="mb-4">
          <FallbackPhotoUploader />
          <Button
            variant="link"
            className="mt-4 text-sm text-gray-500"
            onClick={() => setShowFallback(false)}
          >
            Voltar ao método padrão
          </Button>
        </div>
      )}

      {showDiagnostic && (
        <div className="mt-6 p-4 border border-orange-200 rounded-lg bg-orange-50">
          <div className="flex items-center gap-2 mb-3">
            <Bug className="text-orange-500" size={16} />
            <h3 className="text-orange-800 font-medium">Ferramentas de Diagnóstico</h3>
          </div>
          <DiagnosticButton />
          <p className="mt-2 text-xs text-gray-500">Esta ferramenta ajuda a identificar problemas no sistema de upload de fotos.</p>
        </div>
      )}
    </div>
  );
};

export default SimpleProfilePhoto; 