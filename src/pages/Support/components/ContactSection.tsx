
import React from 'react';
import { Mail, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ContactSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Navigate to chat support page
  const navigateToChatSupport = () => {
    navigate('/support-chat');
  };

  return (
    <section className="max-w-3xl mx-auto px-4 mb-12">
      <h2 className="text-2xl font-bold mb-6">{t('contactUs')}</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Live Chat Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full human-support-badge">
            Human Support
          </div>
          <CardHeader className="bg-gradient-to-r from-temu-orange to-orange-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <MessageCircle className="h-6 w-6 mr-2" />
              {t('liveChat')}
            </CardTitle>
            <CardDescription className="text-white opacity-90">
              {t('liveChatDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">
              {t('liveChatPrompt')}
            </p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm font-medium">Available 24/7</p>
              <p className="text-xs text-gray-500">Our support agents are ready to help</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={navigateToChatSupport}
              className="w-full bg-temu-orange hover:bg-orange-600"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              {t('startChat')}
            </Button>
          </CardFooter>
        </Card>

        {/* Email Support Card */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Mail className="h-6 w-6 mr-2" />
              {t('emailSupport')}
            </CardTitle>
            <CardDescription className="text-white opacity-90">
              {t('emailSupportDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">
              {t('emailSupportPrompt')}
            </p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm font-medium">Response time: 24 hours</p>
              <p className="text-xs text-gray-500">support@socialexpertgains.com</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              asChild
              variant="outline"
              className="w-full border-teal-500 text-teal-600 hover:bg-teal-50"
            >
              <a href="mailto:support@socialexpertgains.com">
                <Mail className="h-5 w-5 mr-2" />
                {t('sendEmail')}
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default ContactSection;
