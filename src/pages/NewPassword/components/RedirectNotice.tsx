
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RedirectNotice: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold mb-4">{t('invalidRecoveryLink')}</h2>
          <p className="mb-4">{t('redirectingToLogin')}</p>
          <Button asChild className="mt-2">
            <Link to="/auth">{t('goToLoginPage')}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RedirectNotice;
