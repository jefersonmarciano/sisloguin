
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '../../../components/ui/dialog';

interface MinimumEarningsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amountNeeded: number;
  minimumWithdrawalAmount: number;
}

const MinimumEarningsDialog: React.FC<MinimumEarningsDialogProps> = ({
  open,
  onOpenChange,
  amountNeeded,
  minimumWithdrawalAmount
}) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('minimumBalanceRequired')}</DialogTitle>
          <DialogDescription>
            {t('needMoreToReach')
              .replace('${amount}', `$${amountNeeded.toFixed(2)}`)
              .replace('${minimum}', `$${minimumWithdrawalAmount.toFixed(2)}`)}
            <p className="mt-2">
              {t('continueCompletingTasks')}
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <button 
            className="sisloguin-button"
            onClick={() => onOpenChange(false)}
          >
            {t('gotIt')}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MinimumEarningsDialog;
