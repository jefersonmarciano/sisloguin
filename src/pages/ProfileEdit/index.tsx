import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import ProfileForm from './components/ProfileForm';
import { useProfileForm } from './hooks/useProfileForm';

const ProfileEdit = () => {
  const { t } = useLanguage();
  const {
    name,
    setName,
    email,
    setEmail,
    isSubmitting,
    handleSubmit
  } = useProfileForm();

  return (
    <div className="animate-fade-in space-y-6 bg-gray-800/50 text-gray-100 p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('editProfile')}</h1>
      </div>
      
      <div className="temu-card bg-gray-800/50 border border-gray-700 rounded-xl text-gray-100">
        <ProfileForm
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ProfileEdit;
