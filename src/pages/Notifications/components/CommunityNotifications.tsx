import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface CommunityNotificationsProps {
  notificationHistory: any[];
  onClearClick: () => void;
  formatTimestamp: (date: Date) => string;
}

const CommunityNotifications: React.FC<CommunityNotificationsProps> = ({
  notificationHistory,
  onClearClick,
  formatTimestamp
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="temu-card bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-temu-orange" />
          <h2 className="font-medium">{t('communityMessages')}</h2>
        </div>
        
        {notificationHistory.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600"
            onClick={onClearClick}
          >
            <Trash2 className="h-4 w-4 mr-1" /> {t('clear')}
          </Button>
        )}
      </div>
      
      {notificationHistory.length === 0 ? (
        <div className="bg-gray-700 p-4 rounded-xl text-gray-100">
          <h3 className="font-medium">{t('noCommunityMessages')}</h3>
          <p className="text-gray-400">{t('newMessagesWillAppearHere')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notificationHistory.map((notification) => (
            <div 
              key={notification.id} 
              className="p-3 rounded-lg bg-gray-700"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-2">
                  <img 
                    src={notification.user.avatar} 
                    alt={notification.user.name} 
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium text-gray-100">{notification.user.name}</h3>
                      <Badge variant="default" className="bg-temu-orange text-[10px]">{t('new')}</Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{notification.text}</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400">{formatTimestamp(notification.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityNotifications;
