
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProgress } from '@/hooks/useUserProgress';

interface DebugPanelProps {
  saveProgress: (newProgress: any) => Promise<any>;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ saveProgress }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { userProgress } = useUserProgress();
  
  return (
    <div className="mt-8 p-4 bg-muted rounded-lg">
      <h2 className="text-xl font-semibold mb-2">
        {language === 'en' ? 'Debug Information' : 'Informação de depuração'}
      </h2>
      <p className="text-sm text-muted-foreground mb-2">
        {language === 'en' 
          ? 'Detailed logs are being output to the browser console.' 
          : 'Os registros detalhados estão sendo enviados para o console do navegador.'}
      </p>
      <div className="flex gap-2">
        <Button 
          onClick={() => saveProgress({ balance: Number(userProgress?.balance || 0) + 5 })}
          variant="default"
          size="sm"
        >
          {language === 'en' ? 'Test Save Progress' : 'Testar Salvamento de Progresso'}
        </Button>
        <Button 
          onClick={() => console.log('Estado atual - User:', user, 'UserProgress:', userProgress)}
          variant="secondary"
          size="sm"
        >
          {language === 'en' ? 'Log Current State' : 'Registrar Estado Atual'}
        </Button>
      </div>
    </div>
  );
};

export default DebugPanel;
