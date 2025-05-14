import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, ButtonProps } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

interface LogoutButtonProps extends ButtonProps {
  redirectTo?: string;
  showIcon?: boolean;
  text?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  redirectTo = '/auth',
  showIcon = true,
  text = 'Logout',
  ...props
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Navegando para página de logout...");
    navigate('/logout');
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
      {isLoggingOut ? 'Logging out...' : text}
    </Button>
  );
};

export default LogoutButton; 