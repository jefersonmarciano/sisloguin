import React, { useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LogoutButtonProps extends ButtonProps {
  showIcon?: boolean;
  text?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  showIcon = true,
  text = 'Logout',
  ...props
}) => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoggingOut(true);
    
    try {
      // Start clearing local storage right away
      localStorage.removeItem('sisloguinUser');
      localStorage.removeItem('temuUser');
      
      console.log("Iniciando processo de logout...");
      
      // Use window.location.replace for a more reliable redirect
      // that won't get caught in React Router history
      window.location.replace('/logout');
    } catch (error) {
      console.error("Erro ao iniciar logout:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      disabled={isLoggingOut}
      {...props}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {isLoggingOut ? 'Saindo...' : text}
    </Button>
  );
};

export default LogoutButton; 