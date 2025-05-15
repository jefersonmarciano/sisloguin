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
        // Limpar todos os dados locais manualmente primeiro
        localStorage.removeItem('temuUser');
        localStorage.removeItem('sisloguinUser'); // New key
        localStorage.removeItem('temu-auth-token');
        localStorage.removeItem('sisloguin-auth-token'); // New key
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('wheelCooldownEnd');
        localStorage.removeItem('inspectorCooldownEnd');
        localStorage.removeItem('likeCooldownEnd');
        sessionStorage.clear();
        
        setLogoutStatus('Tentando logout no Supabase...');
        
        // Clear all Supabase-related local storage keys
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.') || key.includes('auth')) {
            localStorage.removeItem(key);
          }
        });
        
        try {
          // Don't wait for a response from signOut - just fire it and continue
          supabase.auth.signOut({ scope: 'local' })
            .then(() => console.log('Supabase signOut successful'))
            .catch(err => console.error('Supabase signOut error:', err));
          
          // Immediately continue regardless of Supabase response
          setLogoutStatus('Limpeza realizada, preparando redirecionamento...');
        } catch (error) {
          console.error('Erro ao chamar signOut:', error);
          setLogoutStatus('Erro no logout, forçando redirecionamento...');
        }
      } catch (error) {
        console.error('Erro completo no logout:', error);
        setLogoutStatus('Erro no processo de logout, forçando redirecionamento...');
      } finally {
        setLogoutStatus('Redirecionando para página de login...');
        
        // Redirect with a short delay to show feedback to user
        const timer = window.setTimeout(() => {
          // Use replace instead of href to avoid adding to browser history
          window.location.replace('/auth');
        }, 1000);
        
        setLogoutTimer(timer);
      }
    };

    performLogout();
    
    // Fallback timer - ensure we redirect no matter what
    const fallbackTimer = window.setTimeout(() => {
      console.log('Fallback timer triggered - forcing redirect');
      window.location.replace('/auth');
    }, 3000);
    
    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Saindo...</h1>
        <div className="mb-4">
          <div className="w-8 h-8 border-4 border-sisloguin-orange border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">{logoutStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage; 