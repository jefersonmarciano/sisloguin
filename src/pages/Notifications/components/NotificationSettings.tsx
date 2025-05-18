import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationSettingsProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
  onSaveSettings: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
  onSaveSettings
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="temu-card bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="h-5 w-5 text-temu-orange" />
        <h2 className="font-medium">{t('notificationSettings')}</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{t('emailNotifications')}</p>
            <p className="text-xs text-gray-400">{t('receiveEmails')}</p>
          </div>
          <Switch 
            checked={emailNotifications} 
            onCheckedChange={setEmailNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{t('pushNotifications')}</p>
            <p className="text-xs text-gray-400">{t('receivePush')}</p>
          </div>
          <Switch 
            checked={pushNotifications} 
            onCheckedChange={setPushNotifications}
          />
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <Button onClick={onSaveSettings} className="bg-temu-orange hover:bg-orange-600 text-sm text-white">
            {t('savePreferences')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
