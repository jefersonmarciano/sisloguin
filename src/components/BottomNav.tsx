import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Home, Wallet, DollarSign, Users, HelpCircle } from 'lucide-react';

const BottomNav: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md z-10">
      <div className="flex justify-between px-3 py-2 max-w-md mx-auto">
        <NavLink to="/dashboard" className={({isActive}) => `flex flex-col items-center space-y-1 p-1 text-[10px] ${isActive ? 'text-sisloguin-orange' : 'text-gray-600'}`}>
          <Home className="h-5 w-5" />
          <span>{t('dashboard')}</span>
        </NavLink>
        
        <NavLink to="/earnings" className={({isActive}) => `flex flex-col items-center space-y-1 p-1 text-[10px] ${isActive ? 'text-sisloguin-orange' : 'text-gray-600'}`}>
          <Wallet className="h-5 w-5" />
          <span>{t('earnings')}</span>
        </NavLink>
        
        <NavLink to="/rewards" className={({isActive}) => `flex flex-col items-center space-y-1 p-1 text-[10px] ${isActive ? 'text-sisloguin-orange' : 'text-gray-600'}`}>
          <DollarSign className="h-5 w-5" />
          <span>{t('rewards')}</span>
        </NavLink>
        
        <NavLink to="/support" className={({isActive}) => `flex flex-col items-center space-y-1 p-1 text-[10px] ${isActive ? 'text-sisloguin-orange' : 'text-gray-600'}`}>
          <HelpCircle className="h-5 w-5" />
          <span>{t('support')}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNav;
