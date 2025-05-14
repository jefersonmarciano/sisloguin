import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type UseRequireAuthOptions = {
  redirectTo?: string;
  redirectIfAuthenticated?: boolean;
  redirectToSaved?: boolean;
};

/**
 * Custom hook to handle authentication requirements and redirects
 * 
 * @param options.redirectTo - Path to redirect unauthenticated users to (default: '/auth')
 * @param options.redirectIfAuthenticated - If true, redirects authenticated users away from the page
 * @param options.redirectToSaved - If true, redirects to the path saved in sessionStorage after login
 * @returns Object with auth state information
 */
export const useRequireAuth = ({
  redirectTo = '/auth',
  redirectIfAuthenticated = false,
  redirectToSaved = false,
}: UseRequireAuthOptions = {}) => {
  const { isAuthenticated, isInitializing, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  // Adicionar um timeout para evitar estados de carregamento infinito
  useEffect(() => {
    // Define um timeout máximo para o estado de verificação de autenticação
    timeoutRef.current = window.setTimeout(() => {
      if (isCheckingAuth) {
        console.log('Auth check timeout reached, forcing completion');
        setIsCheckingAuth(false);
        
        // Se após o timeout ainda estamos inicializando, vamos forçar uma decisão
        // baseada em dados do localStorage
        if (isInitializing) {
          const hasLocalStorageUser = localStorage.getItem('temuUser') !== null;
          
          // Se temos usuário no localStorage e estamos em uma página que requer login
          if (hasLocalStorageUser && !redirectIfAuthenticated) {
            console.log('Found cached user, proceeding without redirect');
          } 
          // Se estamos em uma página de autenticação
          else if (location.pathname === '/auth') {
            console.log('Already on auth page, no redirect needed');
          }
          // Caso padrão - redirecionar para a página de autenticação
          else if (!redirectIfAuthenticated) {
            console.log('No cached user, redirecting to auth page');
            navigate(redirectTo, { replace: true });
          }
        }
      }
    }, 4000); // 4 segundos é tempo suficiente para decidir

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isCheckingAuth, isInitializing, redirectIfAuthenticated, navigate, redirectTo, location.pathname]);

  useEffect(() => {
    // Skip redirection logic during initialization
    if (isInitializing) {
      return;
    }

    // Prevent infinite redirect loops
    if (
      (redirectIfAuthenticated && isAuthenticated && location.pathname === '/dashboard') ||
      (!redirectIfAuthenticated && !isAuthenticated && location.pathname === redirectTo)
    ) {
      setIsCheckingAuth(false);
      return;
    }

    if (redirectIfAuthenticated && isAuthenticated) {
      // Save current location for post-auth redirect if needed
      const savedRedirect = sessionStorage.getItem('redirectAfterLogin');
      const redirectPath = redirectToSaved && savedRedirect ? savedRedirect : '/dashboard';
      
      // Clear saved redirect after using it
      if (redirectToSaved && savedRedirect) {
        sessionStorage.removeItem('redirectAfterLogin');
      }
      
      console.log(`Redirecting authenticated user from ${location.pathname} to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    } else if (!redirectIfAuthenticated && !isAuthenticated) {
      // Save current location for post-auth redirect
      if (location.pathname !== '/auth' && location.pathname !== '/new-password') {
        console.log(`Saving current location ${location.pathname} for post-auth redirect`);
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
      }
      
      console.log(`Redirecting unauthenticated user from ${location.pathname} to ${redirectTo}`);
      navigate(redirectTo, { replace: true });
    }
    
    setIsCheckingAuth(false);
  }, [isAuthenticated, isInitializing, navigate, redirectTo, redirectIfAuthenticated, redirectToSaved, location.pathname]);

  return {
    isAuthenticated,
    isInitializing: isInitializing || isCheckingAuth,
    user
  };
};
