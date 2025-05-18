
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { Sun, Moon, LogOut, Plus } from 'lucide-react';

const UserProgress: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { userProgress, loading, error, updateUserProgress, initializeUserProgress, fetchUserProgress } = useUserProgress();
  const [currentTheme, setCurrentTheme] = useState<string>('light');

  // Initialize user progress when component mounts
  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user, fetchUserProgress]);

  // Update theme from user progress data
  useEffect(() => {
    if (userProgress?.theme) {
      setCurrentTheme(userProgress.theme);
    }
  }, [userProgress]);

  // Add points to user balance
  const addPoints = async (amount: number = 10) => {
    if (!userProgress) {
      await initializeUserProgress();
    }
    
    const newBalance = Number(userProgress?.balance || 0) + amount;
    const result = await updateUserProgress({ balance: newBalance });
    
    if (result.success) {
      toast({
        title: language === 'en' ? 'Success' : 'Éxito',
        description: language === 'en' 
          ? `Added ${amount} points to your balance` 
          : `Agregado ${amount} puntos a tu saldo`
      });
    } else {
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Error',
        description: result.error
      });
    }
  };

  // Toggle between light and dark theme
  const toggleTheme = async () => {
    if (!userProgress) {
      await initializeUserProgress();
    }
    
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    
    const result = await updateUserProgress({ theme: newTheme });
    
    if (result.success) {
      toast({
        title: language === 'en' ? 'Theme Updated' : 'Tema Actualizado',
        description: language === 'en'
          ? `Theme changed to ${newTheme}`
          : `Tema cambiado a ${newTheme}`
      });
    } else {
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Error',
        description: result.error
      });
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
            <Button onClick={() => fetchUserProgress()}>
              {language === 'en' ? 'Try Again' : 'Intentar de nuevo'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Not authenticated state
  if (!user) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'en' ? 'Authentication Required' : 'Autenticación Requerida'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {language === 'en' 
                ? 'Please log in to view your progress' 
                : 'Inicia sesión para ver tu progreso'}
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate('/login')}>
              {language === 'en' ? 'Log In' : 'Iniciar sesión'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className={`p-4 max-w-md mx-auto transition-colors duration-300 ${currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <Card className={currentTheme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}>
        <CardHeader>
          <CardTitle>
            {language === 'en' ? 'User Progress' : 'Progreso del Usuario'}
          </CardTitle>
          <CardDescription>
            {language === 'en' 
              ? 'Track your balance and customize your experience' 
              : 'Sigue tu saldo y personaliza tu experiencia'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="balance" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="balance">
                {language === 'en' ? 'Balance' : 'Saldo'}
              </TabsTrigger>
              <TabsTrigger value="appearance">
                {language === 'en' ? 'Appearance' : 'Apariencia'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="balance" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'en' ? 'Current Balance' : 'Saldo Actual'}:
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold">
                    {userProgress?.balance || 0}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {language === 'en' ? 'points' : 'puntos'}
                  </span>
                </div>
                <Progress value={Math.min(100, Number(userProgress?.balance || 0) / 10)} className="h-2 mb-2" />
                <div className="mt-6">
                  <Button onClick={() => addPoints(10)} className="w-full flex items-center justify-center">
                    <Plus className="mr-2" />
                    {language === 'en' ? 'Add 10 Points' : 'Añadir 10 Puntos'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="appearance" className="space-y-4 pt-4">
              <div>
                <h3 className="text-lg font-medium mb-2">
                  {language === 'en' ? 'Theme' : 'Tema'}
                </h3>
                <Button 
                  onClick={toggleTheme} 
                  variant="outline" 
                  className="w-full flex items-center justify-center"
                >
                  {currentTheme === 'light' ? <Moon className="mr-2" /> : <Sun className="mr-2" />}
                  {currentTheme === 'light' 
                    ? (language === 'en' ? 'Switch to Dark Mode' : 'Cambiar a Modo Oscuro')
                    : (language === 'en' ? 'Switch to Light Mode' : 'Cambiar a Modo Claro')
                  }
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2" />
            {language === 'en' ? 'Logout' : 'Cerrar sesión'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserProgress;
