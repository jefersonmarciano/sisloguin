import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ResultDialogProps {
  showResult: boolean;
  setShowResult: (show: boolean) => void;
  currentPrize: number | null;
  closeResult: () => void;
}

const ResultDialog: React.FC<ResultDialogProps> = ({ 
  showResult, 
  setShowResult, 
  currentPrize, 
  closeResult 
}) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={showResult} onOpenChange={setShowResult}>
      <DialogContent className="bg-[#1f2937] border-[#374151] text-white rounded-lg" role="alert">
        <DialogTitle className="sr-only">{t('congratulations')}</DialogTitle>
        <div className="flex flex-col items-center gap-4 text-center p-6">
          <div className={`bg-[#374151] p-6 rounded-full shadow-lg ${currentPrize && currentPrize > 0 ? 'animate-pulse' : ''}`}>
            <span className={`text-3xl font-bold ${currentPrize && currentPrize >= 100 ? 'text-yellow-400' : 'text-[#f97316]'}`}>
              ${currentPrize?.toFixed(2)}
            </span>
          </div>
          <h2 className="text-xl font-bold">{t('congratulations')}</h2>
          <p className="text-gray-300">
            {t('youWon')} ${currentPrize?.toFixed(2)}!
          </p>
          <Button
            className="bg-[#f97316] hover:bg-orange-600 text-white rounded-full animate-pulse"
            onClick={closeResult}
            aria-label={`${t('collectReward')}`}
          >
            {t('collectReward')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
