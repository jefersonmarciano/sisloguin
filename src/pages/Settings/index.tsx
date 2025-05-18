import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Settings as SettingsIcon, Bell, Lock, Globe } from 'lucide-react';

const Settings = () => {
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  
  const handleSaveSettings = () => {
    toast({
      title: t('settingsSaved'),
      description: t('yourSettingsHaveBeenSuccessfullyUpdated'),
    });
  };

  return (
    <div className="animate-fade-in space-y-6 bg-gray-800/50 text-gray-100 p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('accountSettings')}</h1>
      </div>
      
      {/* General Settings */}
      <div className="temu-card bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <SettingsIcon className="h-5 w-5 text-temu-orange" />
          <h2 className="font-medium">{t('generalSettings')}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium text-sm">{t('language')}</p>
              <p className="text-xs text-gray-400">{t('selectLanguage')}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                className={`px-2 py-1 text-xs rounded flex items-center ${language === 'en' ? 'bg-temu-orange text-white' : 'bg-gray-700 text-gray-100 border border-gray-600 hover:bg-gray-600'}`}
                onClick={() => setLanguage('en')}
              >
                <span className="mr-1">🇺🇸</span> English
              </button>
              <button 
                className={`px-2 py-1 text-xs rounded flex items-center ${language === 'es' ? 'bg-temu-orange text-white' : 'bg-gray-700 text-gray-100 border border-gray-600 hover:bg-gray-600'}`}
                onClick={() => setLanguage('es')}
              >
                <span className="mr-1">🇪🇸</span> Español
              </button>
              <button 
                className={`px-2 py-1 text-xs rounded flex items-center ${language === 'fr' ? 'bg-temu-orange text-white' : 'bg-gray-700 text-gray-100 border border-gray-600 hover:bg-gray-600'}`}
                onClick={() => setLanguage('fr')}
              >
                <span className="mr-1">🇫🇷</span> Français
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-4">
            <Button onClick={handleSaveSettings} className="bg-temu-orange hover:bg-orange-600 text-sm text-white">
              {t('saveChanges')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Notification Settings */}
      <div className="temu-card bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Bell className="h-5 w-5 text-temu-orange" />
          <h2 className="font-medium">{t('notificationSettings')}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{t('emailNotifications')}</p>
              <p className="text-xs text-gray-400">{t('receiveEmailNotifications')}</p>
            </div>
            <Switch 
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{t('pushNotifications')}</p>
              <p className="text-xs text-gray-400">{t('receivePushNotifications')}</p>
            </div>
            <Switch 
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
