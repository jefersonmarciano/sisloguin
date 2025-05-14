import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Upload, X, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

const FallbackPhotoUploader: React.FC = () => {
  const { user, updateUserAvatar } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return <div>Você precisa estar autenticado.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!imageUrl) {
      setError('Por favor, digite uma URL de imagem.');
      return;
    }
    
    // Verificar se é uma URL válida
    try {
      new URL(imageUrl);
    } catch (e) {
      setError('URL inválida. Digite uma URL completa (ex: https://exemplo.com/imagem.jpg)');
      return;
    }
    
    // Verificar se termina com extensão de imagem comum
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = validExtensions.some(ext => 
      imageUrl.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExtension) {
      setError('A URL deve terminar com uma extensão de imagem válida (.jpg, .png, .gif ou .webp).');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Atualizar diretamente no banco
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: imageUrl })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar estado local
      if (updateUserAvatar) {
        await updateUserAvatar(imageUrl);
      }
      
      toast({
        title: 'Foto atualizada',
        description: 'Sua foto de perfil foi atualizada com sucesso.'
      });
      
      // Limpar o campo
      setImageUrl('');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar foto.');
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar sua foto de perfil.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemovePhoto = async () => {
    if (!user.avatar) return;
    
    setIsLoading(true);
    
    try {
      // Atualizar diretamente no banco
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: '' })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar estado local
      if (updateUserAvatar) {
        await updateUserAvatar('');
      }
      
      toast({
        title: 'Foto removida',
        description: 'Sua foto de perfil foi removida com sucesso.'
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao remover foto.');
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível remover sua foto de perfil.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-orange-800">Método Alternativo de Upload</h2>
      <p className="text-sm text-gray-500">
        Use este método se o upload direto não estiver funcionando.
        Você precisará fornecer a URL de uma imagem já hospedada na internet.
      </p>
      
      <div className="flex items-center justify-center mb-6">
        <Avatar className="w-24 h-24">
          <AvatarImage 
            src={user.avatar || ''} 
            alt={user.name} 
          />
          <AvatarFallback className="bg-temu-orange text-white text-2xl">
            {user.name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex">
            <Input
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="rounded-r-none focus-visible:ring-orange-500"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              className="rounded-l-none bg-temu-orange hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LinkIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          
          <p className="text-xs text-gray-500">
            Digite a URL completa de uma imagem já hospedada na internet.
          </p>
        </div>
        
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleRemovePhoto}
          disabled={isLoading || !user.avatar}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t('removePhoto')
          )}
        </Button>
      </form>
    </div>
  );
};

export default FallbackPhotoUploader; 