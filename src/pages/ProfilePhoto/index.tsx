import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import PhotoUploader from './components/PhotoUploader';
import { usePhotoStorage } from './hooks/usePhotoStorage';

const ProfilePhoto = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { isUploading, handlePhotoUpload, handleRemovePhoto } = usePhotoStorage();

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };
  
  const handleSavePhoto = async () => {
    if (previewImage) {
      await handlePhotoUpload(previewImage);
    }
  };

  const handleRemove = async () => {
    await handleRemovePhoto();
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
    <div className="animate-fade-in space-y-6 bg-gray-800/50 text-gray-100 p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('changeProfilePhoto')}</h1>
      </div>
      <div className="temu-card bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100">
        <div className="flex flex-col items-center justify-center space-y-4">
          <PhotoUploader
            avatar={user?.avatarUrl || user?.avatar}
            userName={user?.fullName || user?.name}
            onFileSelect={handleFileSelect}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
          />
          <div className="text-center">
            <h2 className="font-medium text-lg">{user?.fullName || user?.name}</h2>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              onClick={handleSavePhoto} 
              className="bg-temu-orange hover:bg-orange-600 text-white"
              disabled={previewImage === null && (!user?.avatarUrl && !user?.avatar)}
            >
              {isUploading ? t('saving') : previewImage ? t('savePhoto') : t('uploadPhoto')}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRemove}
              disabled={(previewImage === null && (!user?.avatarUrl && !user?.avatar)) || isUploading}
              className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
            >
              {isUploading ? t('removing') : t('removePhoto')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhoto;
