import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import PhotoUploader from './components/PhotoUploader';
import { usePhotoStorage } from './hooks/usePhotoStorage';
import { Loader2 } from 'lucide-react';
import StorageTestButton from './components/StorageTestButton';

const ProfilePhoto = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isUploading, handlePhotoUpload, handleRemovePhoto } = usePhotoStorage();
  const [uploadStartTime, setUploadStartTime] = useState<number | null>(null);
  const [uploadElapsed, setUploadElapsed] = useState<number>(0);
  const [showDebug, setShowDebug] = useState(false);

  // Contabilizar o tempo decorrido durante o upload
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isUploading && !uploadStartTime) {
      setUploadStartTime(Date.now());
      setUploadElapsed(0);
      
      interval = setInterval(() => {
        setUploadElapsed(prev => prev + 1);
      }, 1000);
    } else if (!isUploading && uploadStartTime) {
      setUploadStartTime(null);
      setUploadElapsed(0);
      
      if (interval) {
        clearInterval(interval);
      }
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isUploading, uploadStartTime]);

  // Mostrar ferramentas de debug após 3 cliques consecutivos no título
  const [debugClicks, setDebugClicks] = useState(0);
  const handleDebugClick = () => {
    setDebugClicks(prev => {
      const newValue = prev + 1;
      if (newValue >= 3) {
        setShowDebug(true);
        return 0;
      }
      return newValue;
    });
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    
    // Se estiver deselecionando um arquivo, limpe o preview também
    if (!file) {
      setPreviewImage(null);
    }
  };
  
  const handleSavePhoto = async () => {
    if (previewImage) {
      console.log("Chamando handlePhotoUpload");
      await handlePhotoUpload(previewImage);
      console.log("Upload concluído");
      
      // Se a operação for bem-sucedida, limpar o estado do preview
      if (!isUploading) {
        setPreviewImage(null);
        setSelectedFile(null);
      }
    }
  };

  const handleRemove = async () => {
    console.log("Chamando handleRemovePhoto");
    await handleRemovePhoto();
    console.log("Remoção concluída");
    
    setPreviewImage(null);
    setSelectedFile(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>{t('pleaseLogin')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold" onClick={handleDebugClick}>{t('changeProfilePhoto')}</h1>
      </div>
      
      <div className="temu-card">
        <div className="flex flex-col items-center justify-center space-y-4">
          <PhotoUploader
            avatar={user?.avatar}
            userName={user?.name}
            onFileSelect={handleFileSelect}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            disabled={isUploading}
          />
          
          <div className="text-center">
            <h2 className="font-medium text-lg">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
          
          {isUploading && (
            <div className="flex items-center text-temu-orange">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span className="text-sm">
                {uploadElapsed < 10 
                  ? t('processing') || 'Processing...' 
                  : `${t('stillWorking') || 'Still working...'} (${uploadElapsed}s)`}
              </span>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleSavePhoto} 
              className="bg-temu-orange hover:bg-orange-600"
              disabled={previewImage === null || isUploading}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('saving')}
                </span>
              ) : (
                previewImage ? t('savePhoto') : t('uploadPhoto')
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRemove}
              disabled={(previewImage === null && (!user?.avatar || user?.avatar === '')) || isUploading}
            >
              {isUploading ? (
                <span className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('removing')}
                </span>
              ) : (
                t('removePhoto')
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Ferramentas de diagnóstico */}
      {showDebug && (
        <div className="temu-card border-orange-200">
          <h3 className="text-md font-semibold text-orange-700 mb-2">Ferramentas de Diagnóstico</h3>
          <p className="text-sm text-gray-600 mb-4">
            Use estas ferramentas para diagnosticar problemas com o upload de fotos.
          </p>
          
          <StorageTestButton />
          
          <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500">
            Para ocultar esta seção, atualize a página.
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhoto;
