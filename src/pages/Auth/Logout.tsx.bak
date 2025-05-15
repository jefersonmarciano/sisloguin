import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [logoutStatus, setLogoutStatus] = useState<string>('Iniciando logout...');
  const [logoutTimer, setLogoutTimer] = useState<number | null>(null);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [logoutTimer]);

  useEffect(() => {
    const performLogout = async () => {
      try {
        setLogoutStatus('Limpando dados locais...');
        // Limpar todos os dados locais manualmente
        localStorage.removeItem('temuUser');
        localStorage.removeItem('temu-auth-token');
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('wheelCooldownEnd');
        localStorage.removeItem('inspectorCooldownEnd');
        localStorage.removeItem('likeCooldownEnd');
        sessionStorage.clear();
        
        setLogoutStatus('Tentando logout no Supabase...');
        
        // Definir um timeout para garantir que o processo de logout não fique preso
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout durante logout')), 3000)
        );
        
        try {
          // Race entre o logout e o timeout
          await Promise.race([
            supabase.auth.signOut({ scope: 'local' }), 
            timeoutPromise
          ]);
          setLogoutStatus('Logout realizado com sucesso');
        } catch (error) {
          console.error('Erro no logout:', error);
          setLogoutStatus('Erro no logout, forçando redirecionamento...');
        }
      } catch (error) {
        console.error('Erro completo no logout:', error);
        setLogoutStatus('Erro completo no logout, forçando redirecionamento...');
      } finally {
        setLogoutStatus('Redirecionando para página de login...');
        
        // Garantir que vamos redirecionar não importa o que aconteça
        const timer = window.setTimeout(() => {
          // Forçar refresh para limpar qualquer estado residual
          window.location.href = '/auth';
        }, 1500);
        
        setLogoutTimer(timer);
      }
    };

    performLogout();
    
    // Garantir redirecionamento em qualquer caso após 5 segundos
    const fallbackTimer = window.setTimeout(() => {
      window.location.href = '/auth';
    }, 5000);
    
    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Saindo...</h1>
        <div className="mb-4">
          <div className="w-8 h-8 border-4 border-temu-orange border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">{logoutStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage; 