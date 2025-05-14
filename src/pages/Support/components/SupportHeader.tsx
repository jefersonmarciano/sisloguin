
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useLanguage } from '../../../contexts/LanguageContext';

interface SupportHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SupportHeader: React.FC<SupportHeaderProps> = ({ searchQuery, setSearchQuery }) => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-temu-orange to-teal-500 text-white py-12 px-4 rounded-lg mb-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('supportWelcome')}</h1>
        <p className="text-xl mb-8">{t('supportSubheading')}</p>
        
        <div className="relative max-w-xl mx-auto">
          <Input 
            type="text"
            placeholder={t('searchHelp')}
            className="bg-white text-gray-800 pl-10 pr-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
      </div>
    </section>
  );
};

export default SupportHeader;
