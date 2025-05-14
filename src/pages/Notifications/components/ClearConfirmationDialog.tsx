
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ClearConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearConfirmationDialog: React.FC<ClearConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm
}) => {
  const { t } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('clearAllCommunityNotifications')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          {t('clearNotificationsWarning')}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t('clearAll')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearConfirmationDialog;
