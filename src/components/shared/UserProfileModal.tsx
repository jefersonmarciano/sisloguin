
import React, { useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { TopUser } from '@/types/top100';
import { User } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserProfileModalProps {
  user: TopUser | null;
  open: boolean;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, open, onClose }) => {
  const { t, language } = useLanguage();

  const formatDate = useCallback((date: Date | string): string => {
    const dateObject = date instanceof Date ? date : new Date(date);
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObject);
  }, [language]);

  const getStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'pending':
        return 'text-amber-500';
      case 'failed':
        return 'text-red-500';
      default:
        return '';
    }
  }, []);

  if (!user) return null;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95%] max-w-[400px] p-4 md:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            {user.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <div className="text-gray-500">{t('location')}</div>
              <div className="truncate">{user.location || user.country}</div>
            </div>
            <div>
              <div className="text-gray-500">{t('earnings')}</div>
              <div className="font-medium text-temu-orange">
                ${user.earnings.toLocaleString(language === 'en' ? 'en-US' : 'es-ES', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>
            <div>
              <div className="text-gray-500">{t('joined')}</div>
              <div>{formatDate(user.registrationDate)}</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">{t('recentWithdrawals')}</h3>
            {user.withdrawals.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3 py-2">{t('amount')}</TableHead>
                      <TableHead className="w-1/3 py-2">{t('status')}</TableHead>
                      <TableHead className="w-1/3 py-2">{t('date')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.withdrawals.slice(0, 3).map(withdrawal => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium py-2">
                          ${withdrawal.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className={`${getStatusColor(withdrawal.status)} py-2`}>
                          {t(withdrawal.status)}
                        </TableCell>
                        <TableCell className="py-2">
                          {formatDate(withdrawal.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-2 border border-gray-200 rounded-md">
                {t('noWithdrawals')}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
