
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookText, Star, AlertTriangle, Wallet, DollarSign } from 'lucide-react';

const HowToUse: React.FC = () => {
  const { t } = useLanguage();
  
  // Icons for the steps
  const stepIcons = [
    { icon: <Star className="h-6 w-6 text-white" />, color: 'bg-temu-orange' },
    { icon: <AlertTriangle className="h-6 w-6 text-white" />, color: 'bg-blue-500' },
    { icon: <Wallet className="h-6 w-6 text-white" />, color: 'bg-purple-500' },
    { icon: <DollarSign className="h-6 w-6 text-white" />, color: 'bg-green-500' }
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookText className="h-6 w-6 text-temu-orange mr-2" />
          <h1 className="text-2xl font-bold">{t('howToUse')}</h1>
        </div>
      </div>
      
      {/* Video Section */}
      <div className="temu-card mb-6">
        <h2 className="font-bold text-lg mb-4">{t('howItWorks')}</h2>
        <div className="relative pt-[56.25%] mb-6">
          <iframe 
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="TEMU Rewards Tutorial"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
      
      {/* Steps Section */}
      <div className="temu-card">
        <h2 className="font-bold text-lg mb-4">{t('howItWorks')}</h2>
        
        <div className="space-y-6">
          {[1, 2, 3, 4].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`${stepIcons[index].color} rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mr-4 shadow-md`}>
                {stepIcons[index].icon}
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {t(`step${step}`)}
                </h3>
                <p className="text-gray-600 mt-1">
                  {step === 1 && 'Find products you like and evaluate them by answering simple questions.'}
                  {step === 2 && 'Help us keep the marketplace safe by identifying suspicious products.'}
                  {step === 3 && 'Spin the wheel daily for a chance to win bonus rewards!'}
                  {step === 4 && 'Cash out your earnings to PayPal or convert to gift cards.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
