
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import './styles.css';

const SupportChat: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="support-chat-page">
      <div className="p-4 bg-white shadow-md fixed top-0 left-0 right-0 z-10">
        <Button
          variant="ghost"
          className="flex items-center text-gray-600"
          onClick={() => navigate('/support')}
        >
          <ArrowLeft className="mr-2" />
          {t('backToSupport')}
        </Button>
      </div>

      <div className="pt-20 p-6 max-w-4xl mx-auto">
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-temu-orange flex items-center justify-center text-white mr-3 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{t('humanSupportChat')}</h2>
              <p className="text-sm text-gray-600">{t('connectWithRealPerson')}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">
            {t('supportTeamHelp')}
          </p>
          <div className="flex justify-between items-center text-sm bg-white p-2 rounded border border-orange-100">
            <span className="text-gray-500">{t('status')}</span>
            <span className="flex items-center text-green-600">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1 pulse-dot"></span>
              {t('online247Support')}
            </span>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <iframe 
            src="https://app.rosana.io/widget/3E0D90ADE490B027035AD6616124A289/iframe" 
            width="100%" 
            style={{ height: '100%', minHeight: '700px' }} 
            frameBorder="0"
            title="Support Chat"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
