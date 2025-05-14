import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';
import { syncUserProfileFromSession } from '@/utils/auth';
import { toast } from '@/components/ui/use-toast';
import { shouldResetReviews } from '@/utils/auth';

export const useAuthMethods = (
  user: User | null,
  setUser: (user: User | null) => void,
  setIsAuthenticated: (isAuthenticated: boolean) => void
) => {
  // Login with email and password
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Se o erro for "Email not confirmed", exibir mensagem melhorada
        if (error.message.includes("Email not confirmed")) {
          console.log('Email not confirmed error');
          toast({
            title: 'Email não confirmado',
            description: 'Por favor, verifique seu email para ativar sua conta ou entre em contato com o suporte.',
            duration: 5000,
          });
        }
        throw error;
      }

      if (data.user) {
        console.log('Login successful, syncing user profile');
      }

      // No need to return data - onAuthStateChange will update the state
    } catch (error: any) {
      console.error('Login error:', error.message || error);
      
      // Mensagem de erro mais clara para o usuário
      let errorMessage = error.message || 'Failed to login. Please try again.';
      
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email não confirmado. Por favor, verifique seu email ou entre em contato com o suporte.";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou senha incorretos.";
      }
      
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: errorMessage
      });
      throw error;
    }
  }, []);

  // Register with email and password
  const register = useCallback(async (email: string, password: string, name?: string): Promise<void> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
          // Desabilitar confirmação por email para facilitar o desenvolvimento
          emailRedirectTo: window.location.origin + '/auth'
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in the profiles table if needed
        try {
          // Check if profile exists first
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error checking for existing profile:", profileError);
          }
            
          // If profile doesn't exist, create one
          if (!profileData) {
            await supabase.from('profiles').insert({
              id: data.user.id,
              full_name: name || email.split('@')[0],
              avatar_url: `https://i.pravatar.cc/150?u=${data.user.id}`
            });
          }
        } catch (error) {
          console.error("Error setting up user profile:", error);
        }
        
        // Initialize user_progress record
        try {
          await supabase.from('user_progress').insert({
            user_id: data.user.id,
            balance: 0,
            reviews_completed: 0,
            like_reviews_completed: 0,
            inspector_reviews_completed: 0,
            reviews_limit: 20,
            wheels_remaining: 3,
            theme: 'light',
            last_updated: new Date().toISOString()
          });
        } catch (error) {
          console.error("Error initializing user progress:", error);
        }
        
        // Notificar o usuário sobre o status do registro
        if (data.user?.identities?.length === 0) {
          toast({
            title: 'Usuário já existe',
            description: 'Este email já está registrado. Tente fazer login.',
          });
        } else if (data.user?.confirmed_at) {
          toast({
            title: 'Registro realizado com sucesso',
            description: 'Você pode fazer login agora.',
          });
        } else {
          toast({
            title: 'Registro realizado com sucesso',
            description: 'Verifique seu email para confirmar sua conta.',
          });
        }
      }

      // No need to return data - onAuthStateChange will update the state
    } catch (error: any) {
      console.error('Registration error:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message || 'Failed to register. Please try again.'
      });
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      // Limpar dados locais antes de fazer logout no Supabase
      localStorage.removeItem('temuUser');
      localStorage.removeItem('temu-auth-token');
      localStorage.removeItem('wheelCooldownEnd');
      localStorage.removeItem('inspectorCooldownEnd');
      localStorage.removeItem('likeCooldownEnd');
      
      // Limpar o armazenamento local do Supabase
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      
      if (error) throw error;
      
      // Atualizar o estado
      setUser(null);
      setIsAuthenticated(false);
      
      // The auth state listener will handle updating state
      console.log('Logged out successfully');
    } catch (error: any) {
      console.error('Logout error:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: error.message || 'Failed to logout. Please try again.'
      });
    }
  }, [setUser, setIsAuthenticated]);

  // Update balance
  const updateBalance = useCallback(async (amount: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .update({ 
          balance: user.balance + amount,
          last_updated: new Date().toISOString() 
        })
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          ...user,
          balance: user.balance + amount
        });
      }
    } catch (error: any) {
      console.error('Error updating balance:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Failed to update balance. Please try again.'
      });
    }
  }, [user, setUser]);

  // Complete a review
  const completeReview = useCallback((type: 'like' | 'inspector') => {
    if (!user) return;

    const updatedUser = { ...user };
    updatedUser.reviewsCompleted += 1;

    if (type === 'like') {
      updatedUser.likeReviewsCompleted += 1;
    } else if (type === 'inspector') {
      updatedUser.inspectorReviewsCompleted += 1;
    }

    setUser(updatedUser);

    // Update in Supabase
    const updateData: Record<string, any> = {
      reviews_completed: updatedUser.reviewsCompleted,
      like_reviews_completed: updatedUser.likeReviewsCompleted,
      inspector_reviews_completed: updatedUser.inspectorReviewsCompleted,
      last_updated: new Date().toISOString()
    };

    // Se atingiu o limite, salvar timestamp para garantir o período de cooldown
    const limitReached = type === 'like' 
      ? updatedUser.likeReviewsCompleted >= 10 
      : updatedUser.inspectorReviewsCompleted >= 10;
    
    if (limitReached) {
      const now = new Date();
      const nowIso = now.toISOString();
      
      // Calcular exatamente quando o cooldown termina (fim do período)
      const cooldownEndTime = new Date(now);
      cooldownEndTime.setHours(cooldownEndTime.getHours() + 6);
      const cooldownEndIso = cooldownEndTime.toISOString();
      
      console.log(`[Cooldown] Iniciando cooldown às ${nowIso}`);
      console.log(`[Cooldown] Terminará às ${cooldownEndIso}`);
      
      if (type === 'like') {
        // Salvar timestamp atual no banco para rastreamento
        updateData.last_like_review = nowIso;
        // Salvar também o timestamp exato em que o cooldown deve terminar
        updateData.like_cooldown_end = cooldownEndIso;
        
        // Salvar o timestamp de término no localStorage
        localStorage.setItem('likeCooldownEnd', cooldownEndTime.getTime().toString());
        console.log(`[Cooldown] Limite de Like atingido. Fim do cooldown: ${cooldownEndIso}`);
      } else {
        // Salvar timestamp atual no banco para rastreamento
        updateData.last_inspector_review = nowIso;
        // Salvar também o timestamp exato em que o cooldown deve terminar
        updateData.inspector_cooldown_end = cooldownEndIso;
        
        // Salvar o timestamp de término no localStorage
        localStorage.setItem('inspectorCooldownEnd', cooldownEndTime.getTime().toString());
        console.log(`[Cooldown] Limite de Inspector atingido. Fim do cooldown: ${cooldownEndIso}`);
      }
    }

    // Persistir no banco de dados
    supabase
      .from('user_progress')
      .update(updateData)
      .eq('user_id', user.id)
      .then(({ error }) => {
        if (error) {
          console.error('[Cooldown] Erro ao salvar progresso:', error);
        } else {
          console.log('[Cooldown] Progresso salvo com sucesso no banco');
        }
      });
  }, [user, setUser]);

  // Check and reset reviews if needed
  const checkAndResetReviews = useCallback(() => {
    if (!user) return;

    const shouldReset = shouldResetReviews(user.lastReviewReset);
    
    if (shouldReset) {
      const resetDate = new Date();
      const updatedUser = {
        ...user,
        reviewsCompleted: 0,
        likeReviewsCompleted: 0,
        inspectorReviewsCompleted: 0,
        lastReviewReset: resetDate
      };

      setUser(updatedUser);

      // Update in Supabase
      supabase
        .from('user_progress')
        .update({
          reviews_completed: 0,
          like_reviews_completed: 0,
          inspector_reviews_completed: 0,
          last_review_reset: resetDate.toISOString(),
          last_updated: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .then(({ error }) => {
          if (error) {
            console.error('Error resetting reviews:', error);
          }
        });
    }
  }, [user, setUser]);

  // Use wheel and get reward
  const useWheel = useCallback(async (): Promise<number> => {
    if (!user) return 0;

    const reward = Math.floor(Math.random() * 500) + 100;
    const now = new Date();
    const nowIso = now.toISOString();
    
    // Calcular o fim exato do período de cooldown (24 horas)
    const cooldownEndTime = new Date(now);
    cooldownEndTime.setHours(cooldownEndTime.getHours() + 24);
    const cooldownEndIso = cooldownEndTime.toISOString();
    
    // Salvar no localStorage para persistência local
    localStorage.setItem('wheelCooldownEnd', cooldownEndTime.getTime().toString());
    console.log(`[Cooldown] Wheel spin usado. Início: ${nowIso}`);
    console.log(`[Cooldown] Fim do cooldown: ${cooldownEndIso}`);
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .update({ 
          wheels_remaining: Math.max(0, user.wheelsRemaining - 1),
          balance: user.balance + reward,
          last_updated: nowIso,
          last_wheel_spin: nowIso,
          wheel_cooldown_end: cooldownEndIso 
        })
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          ...user,
          wheelsRemaining: Math.max(0, user.wheelsRemaining - 1),
          balance: user.balance + reward
        });
        console.log('[Cooldown] Dados da roleta atualizados com sucesso');
      }

      return reward;
    } catch (error) {
      console.error('[Cooldown] Erro ao usar wheel:', error);
      return 0;
    }
  }, [user, setUser]);

  // Update user avatar - versão ultradireta sem processamento complexo
  const updateUserAvatar = useCallback(async (avatarUrl: string): Promise<boolean> => {
    if (!user) {
      console.error("Usuário não autenticado");
      return false;
    }

    try {
      // Se for string vazia, remover foto
      if (avatarUrl === '') {
        console.log("Removendo foto de perfil");
        
        // Atualizar diretamente no banco de dados
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: '' })
          .eq('id', user.id);
          
        if (error) {
          console.error("Erro ao remover foto:", error);
          return false;
        }
        
        // Atualizar estado local
        setUser({
          ...user,
          avatar: ''
        });
        
        return true;
      }
      
      // Se não for base64, é uma URL externa - usar diretamente
      if (!avatarUrl.startsWith('data:image/')) {
        console.log("Atualizando com URL externa");
        
        const { error } = await supabase
          .from('profiles')
          .update({ avatar_url: avatarUrl })
          .eq('id', user.id);
          
        if (error) {
          console.error("Erro ao atualizar com URL externa:", error);
          return false;
        }
        
        setUser({
          ...user,
          avatar: avatarUrl
        });
        
        return true;
      }
      
      // Caso base64 - processar minimamente
      console.log("Processando upload de base64");
      
      try {
        // Extrair conteúdo base64 e mime type
        const matches = avatarUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        
        if (!matches || matches.length !== 3) {
          console.error("Formato de base64 inválido");
          return false;
        }
        
        const contentType = matches[1];
        const base64Data = matches[2];
        const byteCharacters = atob(base64Data);
        
        // Criar buffer simples
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 512) {
          const slice = byteCharacters.slice(i, i + 512);
          const byteNumbers = new Array(slice.length);
          for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        
        const blob = new Blob(byteArrays, { type: contentType });
        console.log("Blob criado com sucesso");
        
        // Definir caminho único
        const ext = contentType.includes('jpeg') ? 'jpg' : 
                    contentType.includes('png') ? 'png' : 
                    contentType.includes('gif') ? 'gif' : 'jpg';
        
        const fileName = `avatar_${Date.now()}.${ext}`;
        const filePath = `${user.id}/${fileName}`;
        
        // Upload direto sem verificar bucket
        const { error: uploadError } = await supabase.storage
          .from('profile_photos')
          .upload(filePath, blob, {
            contentType,
            upsert: true
          });
          
        if (uploadError) {
          console.error("Erro no upload:", uploadError);
          return false;
        }
        
        // Obter URL pública
        const { data: urlData } = supabase.storage
          .from('profile_photos')
          .getPublicUrl(filePath);
          
        if (!urlData) {
          console.error("Erro ao obter URL pública");
          return false;
        }
        
        const finalUrl = urlData.publicUrl;
        
        // Atualizar perfil
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar_url: finalUrl })
          .eq('id', user.id);
          
        if (updateError) {
          console.error("Erro ao atualizar perfil:", updateError);
          return false;
        }
        
        // Atualizar estado local
        setUser({
          ...user,
          avatar: finalUrl
        });
        
        return true;
      } catch (error) {
        console.error("Erro no processamento da imagem:", error);
        return false;
      }
    } catch (error) {
      console.error("Erro geral na atualização do avatar:", error);
      return false;
    }
  }, [user, setUser]);

  // Update user profile
  const updateUserProfile = useCallback(async (name: string, email: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Update user email if changed
      if (email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({ email });
        if (authError) throw authError;
      }

      // Update profile name
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update local user state
      setUser({
        ...user,
        name,
        email
      });

      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message || 'Failed to update profile. Please try again.'
      });
      return false;
    }
  }, [user, setUser]);

  // Change password
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (signInError) throw new Error('Current password is incorrect');

      // Then update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      toast({
        title: 'Password Updated',
        description: 'Your password has been successfully updated.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error changing password:', error.message || error);
      toast({
        variant: 'destructive',
        title: 'Password Change Failed',
        description: error.message || 'Failed to change password. Please try again.'
      });
      return false;
    }
  }, [user]);

  return {
    login,
    register,
    logout,
    updateBalance,
    completeReview,
    checkAndResetReviews,
    useWheel,
    updateUserAvatar,
    updateUserProfile,
    changePassword
  };
};
