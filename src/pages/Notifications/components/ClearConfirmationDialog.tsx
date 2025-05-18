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
      <DialogContent className="bg-gray-800/90 text-gray-100 border border-gray-700">
        <DialogHeader>
          <DialogTitle>{t('clearAllCommunityNotifications')}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-400">
          {t('clearNotificationsWarning')}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600">
            {t('cancel')}
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-red-700 text-white hover:bg-red-800">
            {t('clearAll')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClearConfirmationDialog;
