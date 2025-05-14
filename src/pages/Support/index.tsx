
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SupportHeader from './components/SupportHeader';
import FaqSection from './components/FaqSection';
import ContactSection from './components/ContactSection';
import faqs from './data/faqs';
import './styles.css';

const Support: React.FC = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(faqs);

  // Filter FAQs based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFaqs(faqs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = faqs.filter(
      faq => 
        (faq.question[language]?.toLowerCase() || faq.question.en.toLowerCase()).includes(query) || 
        (faq.answer[language]?.toLowerCase() || faq.answer.en.toLowerCase()).includes(query)
    );
    setFilteredFaqs(results);
  }, [searchQuery, language]);

  return (
    <div className="animate-fade-in pb-10">
      <SupportHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FaqSection filteredFaqs={filteredFaqs} />
      <ContactSection />
    </div>
  );
};

export default Support;
