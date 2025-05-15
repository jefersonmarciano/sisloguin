
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { Award, DollarSign } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

interface LikeForMoneyLayoutProps {
  children: React.ReactNode;
}

const LikeForMoneyLayout: React.FC<LikeForMoneyLayoutProps> = ({ children }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Award className="h-7 w-7 text-sisloguin-orange mr-2" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sisloguin-orange to-amber-500 bg-clip-text text-transparent">{t('likeForMoney')}</h1>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-sisloguin-orange/10 to-amber-500/10 py-2 px-4 rounded-full">
          <DollarSign className="h-5 w-5 text-sisloguin-orange" />
          <span className="font-medium">${user?.balance?.toFixed(2) || '0.00'}</span>
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default LikeForMoneyLayout;
