
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export function useUserSession() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [progress, setProgress] = useState<any>(null);

  // Function to fetch progress for a specific user
  const fetchProgress = async (userId: string) => {
    console.log('Buscando progresso para usuário:', userId);
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Erro ao buscar progresso:', error.message);
        toast({
          variant: 'destructive',
          title: language === 'en' ? 'Error' : 'Erro',
          description: error.message
        });
      } else if (data) {
        console.log('Progresso carregado:', data);
        setProgress(data);
      } else {
        console.log('Nenhum progresso encontrado para o usuário');
        setProgress({ balance: 0, theme: 'light' });
      }
    } catch (err) {
      console.error('Erro inesperado ao buscar progresso:', err);
    }
  };

  // Function to save progress with direct Supabase access
  const saveProgress = async (newProgress: any) => {
    if (!user) {
      console.log('Usuário não autenticado. Não foi possível salvar o progresso.');
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Erro',
        description: language === 'en' ? 'User not authenticated' : 'Usuário não autenticado'
      });
      return { success: false, error: 'User not authenticated' };
    }

    console.log('Salvando progresso para user_id:', user.id, 'Dados:', newProgress);

    const { data, error } = await supabase
      .from('user_progress')
      .upsert([{ 
        user_id: user.id, 
        ...newProgress, 
        last_updated: new Date().toISOString() 
      }]);

    if (error) {
      console.error('Erro ao salvar progresso:', error.message, 'Detalhes:', error);
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Erro',
        description: error.message
      });
      return { success: false, error: error.message };
    } else {
      console.log('Progresso salvo com sucesso:', data);
      toast({
        title: language === 'en' ? 'Success' : 'Sucesso',
        description: language === 'en' ? 'Progress saved successfully' : 'Progresso salvo com sucesso'
      });
      return { success: true, data };
    }
  };

  // Monitorar alterações de autenticação
  useEffect(() => {
    console.log('useUserSession montado - verificando autenticação inicial');
    
    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão inicial - dados completos:', session);
      console.log('Usuário na sessão inicial:', session?.user ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        auth_provider: session?.user?.app_metadata?.provider
      } : 'Nenhum usuário na sessão');
      
      if (session?.user) {
        console.log('Sessão ativa detectada, buscando progresso para:', session.user.id);
        fetchProgress(session.user.id);
      } else {
        console.log('Nenhuma sessão ativa detectada');
      }
    });

    // Configurar ouvinte para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Evento de autenticação detectado:', event);
      console.log('Dados da sessão após evento:', session);
      console.log('Usuário após evento de autenticação:', session?.user ? {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        auth_provider: session?.user?.app_metadata?.provider
      } : 'Nenhum usuário na sessão');
      
      if (session?.user) {
        console.log(`Evento ${event}: usuário autenticado, buscando progresso para:`, session.user.id);
        fetchProgress(session.user.id);
      } else {
        console.log(`Evento ${event}: usuário desconectado, reset de progress`);
        setProgress({ balance: 0, theme: 'light' });
      }
    });

    // Cleanup do listener
    return () => {
      console.log('useUserSession desmontado - removendo listener de autenticação');
      subscription.unsubscribe();
    };
  }, [language]);

  return {
    progress,
    saveProgress
  };
}
