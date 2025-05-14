
import React, { useEffect, useState } from 'react';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Loader } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ThemeOption {
  value: string;
  label: string;
}

interface ProgressTabsProps {
  saveProgress?: (updates: any) => Promise<any>;
}

const ProgressTabs: React.FC<ProgressTabsProps> = ({ saveProgress }) => {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const { userProgress, loading, error, updateUserProgress, initializeUserProgress } = useUserProgress();
  const [activeTheme, setActiveTheme] = useState<string>('light');
  
  // Available themes
  const themes: ThemeOption[] = [
    { value: 'light', label: language === 'en' ? 'Light' : 'Claro' },
    { value: 'dark', label: language === 'en' ? 'Dark' : 'Oscuro' },
    { value: 'system', label: language === 'en' ? 'System' : 'Sistema' }
  ];

  useEffect(() => {
    if (isAuthenticated && user && !userProgress) {
      initializeUserProgress();
    }
  }, [isAuthenticated, user, userProgress, initializeUserProgress]);

  useEffect(() => {
    // Set active theme if userProgress is loaded
    if (userProgress && userProgress.theme) {
      setActiveTheme(userProgress.theme);
    }
  }, [userProgress]);

  const addPoints = async () => {
    if (!userProgress) return;
    
    const newBalance = Number(userProgress.balance) + 10;
    
    // Use the saveProgress function if provided, otherwise use updateUserProgress
    const update = { balance: newBalance };
    const result = saveProgress 
      ? await saveProgress(update)
      : await updateUserProgress(update);
    
    if (result.success) {
      const message = language === 'en' ? 'Added 10 points!' : '¡Añadidos 10 puntos!';
      toast({
        title: message,
        description: language === 'en' 
          ? `Your balance is now ${newBalance}` 
          : `Tu saldo ahora es ${newBalance}`
      });
    } else {
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Error',
        description: result.error
      });
    }
  };

  const changeTheme = async (theme: string) => {
    if (!userProgress) return;
    
    setActiveTheme(theme);
    
    // Use the saveProgress function if provided, otherwise use updateUserProgress
    const update = { theme };
    const result = saveProgress 
      ? await saveProgress(update) 
      : await updateUserProgress(update);
    
    if (result.success) {
      const message = language === 'en' 
        ? `Theme changed to ${theme}` 
        : `Tema cambiado a ${theme}`;
      toast({ title: message });
    } else {
      toast({
        variant: 'destructive',
        title: language === 'en' ? 'Error' : 'Error',
        description: result.error
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-center bg-muted rounded-lg">
        <p>{language === 'en' ? 'Please login to see your progress' : 'Inicia sesión para ver tu progreso'}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader className="h-6 w-6 animate-spin" />
        <span className="ml-2">{language === 'en' ? 'Loading...' : 'Cargando...'}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center bg-destructive/10 text-destructive rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'en' ? 'Your Progress' : 'Tu Progreso'}
      </h2>
      
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
            <Button onClick={addPoints} className="mt-4 w-full">
              {language === 'en' ? 'Add 10 Points' : 'Añadir 10 Puntos'}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4 pt-4">
          <div>
            <h3 className="text-lg font-medium mb-2">
              {language === 'en' ? 'Theme' : 'Tema'}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {themes.map(theme => (
                <Button 
                  key={theme.value}
                  variant={activeTheme === theme.value ? "default" : "outline"} 
                  onClick={() => changeTheme(theme.value)}
                  className="w-full"
                >
                  {theme.label}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressTabs;
