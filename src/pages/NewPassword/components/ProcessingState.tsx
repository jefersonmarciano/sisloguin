
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

const ProcessingState: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>{t('processingResetLink')}</p>
      </div>
    </div>
  );
};

export default ProcessingState;
