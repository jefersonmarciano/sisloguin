import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { LogOut, RefreshCw, Plus, PaintBucket } from 'lucide-react';
import { LogoutButton } from '@/components/LogoutButton';

const TestUserProgress: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userProgress, loading, error, updateUserProgress, fetchUserProgress } = useUserProgress();
  const [sessionInfo, setSessionInfo] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');
  
  // Check session on load
  useEffect(() => {
    checkSession();
  }, []);
  
  // Refresh data whenever user changes
  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user, fetchUserProgress]);

  // Check current Supabase session
  const checkSession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setSessionInfo(`Session active: ${data.session.user.email}`);
    } else {
      setSessionInfo('No active session');
    }
  };

  // Add points to test saving
  const addPoints = async (amount: number = 10) => {
    if (!userProgress) return;
    
    const newBalance = Number(userProgress.balance || 0) + amount;
    const result = await updateUserProgress({ balance: newBalance });
    
    if (result.success) {
      toast({
        title: language === 'en' ? 'Progress Saved' : 'Progreso Guardado',
        description: language === 'en' 
          ? `Added ${amount} points to your balance` 
          : `Agregado ${amount} puntos a tu saldo`
      });
      setTestResult('✅ Save test: Points added successfully');
    } else {
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Error',
        description: result.error
      });
      setTestResult('❌ Save test: Failed to save points');
    }
  };

  // Toggle theme to test saving
  const toggleTheme = async () => {
    if (!userProgress) return;
    
    const currentTheme = userProgress.theme || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    const result = await updateUserProgress({ theme: newTheme });
    
    if (result.success) {
      toast({
        title: language === 'en' ? 'Theme Updated' : 'Tema Actualizado',
        description: language === 'en'
          ? `Theme changed to ${newTheme}`
          : `Tema cambiado a ${newTheme}`
      });
      setTestResult('✅ Save test: Theme changed successfully');
    } else {
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Error',
        description: result.error
      });
      setTestResult('❌ Save test: Failed to change theme');
    }
  };

  // Test logout and redirect to login
  const handleLogout = async () => {
    await logout();
    toast({
      title: language === 'en' ? 'Logged Out' : 'Sesión Cerrada',
      description: language === 'en'
        ? 'You have been logged out. Log back in to test persistence.'
        : 'Has cerrado sesión. Inicia sesión nuevamente para probar la persistencia.'
    });
    navigate('/login');
  };

  // Refresh user progress data
  const refreshData = async () => {
    await fetchUserProgress();
    toast({
      title: language === 'en' ? 'Data Refreshed' : 'Datos Actualizados',
      description: language === 'en'
        ? 'User progress data has been refreshed from the database'
        : 'Los datos de progreso del usuario se han actualizado desde la base de datos'
    });
    setTestResult('✅ Load test: Data refreshed successfully');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>{language === 'en' ? 'Loading...' : 'Cargando...'}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">
              {language === 'en' ? 'Error' : 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={refreshData}>
              {language === 'en' ? 'Try Again' : 'Intentar de nuevo'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'User Progress Persistence Test' : 'Prueba de Persistencia de Progreso'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border p-3 rounded-lg bg-muted/20">
            <h3 className="font-medium mb-2">
              {language === 'en' ? 'Session Status' : 'Estado de la Sesión'}:
            </h3>
            <p className="text-sm">{sessionInfo}</p>
          </div>
          
          {user ? (
            <>
              <div className="border p-3 rounded-lg bg-muted/20">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? 'Current User' : 'Usuario Actual'}:
                </h3>
                <p className="text-sm">{user.email}</p>
              </div>
              
              <div className="border p-3 rounded-lg bg-muted/20">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? 'Current Progress' : 'Progreso Actual'}:
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>{language === 'en' ? 'Balance' : 'Saldo'}:</strong></p>
                  <p>{userProgress?.balance || 0}</p>
                  <p><strong>{language === 'en' ? 'Theme' : 'Tema'}:</strong></p>
                  <p>{userProgress?.theme || 'light'}</p>
                </div>
              </div>
              
              <div className="border p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                <h3 className="font-medium mb-2">
                  {language === 'en' ? 'Test Result' : 'Resultado de la Prueba'}:
                </h3>
                <p className="text-sm">{testResult || '---'}</p>
              </div>
            </>
          ) : (
            <div className="border p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30">
              <p>
                {language === 'en' 
                  ? 'Please log in to test persistence' 
                  : 'Inicia sesión para probar la persistencia'}
              </p>
              <Button 
                className="mt-2" 
                onClick={() => navigate('/login')}
              >
                {language === 'en' ? 'Go to Login' : 'Ir a Iniciar sesión'}
              </Button>
            </div>
          )}
        </CardContent>
        
        {user && (
          <CardFooter className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button onClick={() => addPoints(10)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {language === 'en' ? 'Add 10 Points' : 'Añadir 10 Puntos'}
              </Button>
              <Button onClick={toggleTheme} className="flex items-center gap-2" variant="outline">
                <PaintBucket className="h-4 w-4" />
                {language === 'en' ? 'Toggle Theme' : 'Cambiar Tema'}
              </Button>
              <Button onClick={refreshData} className="flex items-center gap-2" variant="secondary">
                <RefreshCw className="h-4 w-4" />
                {language === 'en' ? 'Refresh Data' : 'Actualizar Datos'}
              </Button>
              <LogoutButton variant="destructive" text={language === 'en' ? 'Logout' : 'Cerrar sesión'} />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {language === 'en' 
                ? 'To test persistence: Add points or change theme, logout, login again, and check if changes persist.' 
                : 'Para probar la persistencia: Añade puntos o cambia el tema, cierra sesión, inicia sesión nuevamente y comprueba si los cambios persisten.'}
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default TestUserProgress;
