
import React, { useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Save the route the user was trying to access
    if (!isAuthenticated && !isInitializing) {
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
    }
  }, [isAuthenticated, isInitializing, location.pathname]);

  // Show loading spinner while checking authentication
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-temu-orange" />
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
