import React from 'react';
import ProgressTabs from '@/components/ProgressTabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserProgress } from '@/hooks/useUserProgress';
import { useUserSession } from '@/hooks/useUserSession';
import ConnectionTest from '@/components/SupabaseTests/ConnectionTest';
import RLSTest from '@/components/SupabaseTests/RLSTest';
import DebugPanel from '@/components/SupabaseTests/DebugPanel';
import { DailyResetTest } from '../../components/DailyResetTest';

const ProgressPage: React.FC = () => {
  const { language } = useLanguage();
  const { fetchUserProgress } = useUserProgress();
  const { saveProgress } = useUserSession();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {language === 'en' ? 'User Progress Management' : 'Administração de Progresso do Usuário'}
      </h1>
      
      <ConnectionTest />
      <RLSTest onTestComplete={fetchUserProgress} />
      
      <ProgressTabs saveProgress={saveProgress} />
      
      <DebugPanel saveProgress={saveProgress} />
      
      <DailyResetTest />
    </div>
  );
};

export default ProgressPage;
