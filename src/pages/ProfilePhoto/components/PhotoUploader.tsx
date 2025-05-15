import React, { useRef, useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Camera, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';

interface PhotoUploaderProps {
  avatar: string | null | undefined;
  userName: string | undefined;
  onFileSelect: (file: File | null) => void;
  previewImage: string | null;
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>;
  disabled?: boolean;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  avatar,
  userName,
  onFileSelect,
  previewImage,
  setPreviewImage,
  disabled = false
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      toast({
        title: t('invalidFileType'),
        description: t('pleaseUploadValidImage'),
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('fileTooLarge'),
        description: t('pleaseUploadSmallerImage'),
        variant: "destructive"
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewImage(result);
      onFileSelect(file);
      // Reset error state on new image
      setImageLoadError(false);
    };
    reader.readAsDataURL(file);
  };
  
  const triggerFileInput = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  const cancelPreview = () => {
    if (disabled) return;
    
    if (previewImage) {
      setPreviewImage(null);
      onFileSelect(null);
    }
  };

  const handleImageError = () => {
    console.log("Image failed to load:", avatar);
    setImageLoadError(true);
  };

  // Determinar qual imagem mostrar
  const imageSource = previewImage || (avatar && !imageLoadError ? avatar : '');
  const showInitials = !imageSource || imageLoadError;

  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            {!showInitials && (
              <AvatarImage 
                src={imageSource} 
                alt="User avatar" 
                onError={handleImageError}
              />
            )}
            <AvatarFallback className="bg-sisloguin-orange text-white text-xl">
              {userName?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          {previewImage && !disabled && (
            <button 
              onClick={cancelPreview}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        accept="image/jpeg,image/png,image/gif" 
        className="hidden" 
        onChange={handleFileSelect}
        disabled={disabled}
      />
      
      <div 
        className={`border-2 border-dashed ${disabled ? 'border-gray-200 bg-gray-50 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-50 cursor-pointer'} rounded-lg p-8 w-full text-center transition-colors`}
        onClick={triggerFileInput}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className={`${disabled ? 'bg-gray-50' : 'bg-gray-100'} p-3 rounded-full`}>
            <Camera className={`h-6 w-6 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <p className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {disabled ? t('uploadDisabled') || 'Upload disabled during processing' : t('uploadNewPhoto')}
          </p>
          <p className="text-xs text-gray-500">{t('jpgPngGif')}</p>
        </div>
      </div>
    </>
  );
};

export default PhotoUploader;
