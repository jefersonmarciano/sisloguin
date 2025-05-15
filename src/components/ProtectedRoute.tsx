
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const ProtectedRoute: React.FC = () => {
  const { isInitializing } = useRequireAuth();
  
  // Show loading spinner while checking authentication
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-sisloguin-orange" />
      </div>
    );
  }
  
  // Render the protected route - the redirect happens in the hook if needed
  return <Outlet />;
};

export default ProtectedRoute;
