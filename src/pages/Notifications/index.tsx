
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useCommunity } from '../../contexts/CommunityContext';
import NotificationSettings from './components/NotificationSettings';
import CommunityNotifications from './components/CommunityNotifications';
import SystemNotifications from './components/SystemNotifications';
import ClearConfirmationDialog from './components/ClearConfirmationDialog';

const Notifications = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { notificationHistory, clearNotifications } = useCommunity();
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  
  const handleSaveSettings = () => {
    toast({
      title: t('notificationPreferencesSaved'),
      description: t('notificationSettingsUpdated'),
    });
  };

  const handleClearNotifications = () => {
    clearNotifications();
    setShowClearDialog(false);
    toast({
      title: t('notificationsCleared'),
      description: t('notificationHistoryCleared'),
    });
  };

  // Format timestamp to relative time
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return t('secondsAgo');
    if (diffInSeconds < 3600) return t('minutesAgo');
    if (diffInSeconds < 86400) return t('hoursAgo');
    return t('daysAgo');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>{t('pleaseLogin')}</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('notifications')}</h1>
      </div>
      
      {/* Notification Settings */}
      <NotificationSettings
        emailNotifications={emailNotifications}
        setEmailNotifications={setEmailNotifications}
        pushNotifications={pushNotifications}
        setPushNotifications={setPushNotifications}
        onSaveSettings={handleSaveSettings}
      />
      
      {/* Community Notifications */}
      <CommunityNotifications
        notificationHistory={notificationHistory}
        onClearClick={() => setShowClearDialog(true)}
        formatTimestamp={formatTimestamp}
      />
      
      {/* Recent System Notifications */}
      <SystemNotifications />
      
      {/* Clear Confirmation Dialog */}
      <ClearConfirmationDialog
        open={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        onConfirm={handleClearNotifications}
      />
    </div>
  );
};

export default Notifications;
