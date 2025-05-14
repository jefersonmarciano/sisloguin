
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from '@/components/ui/accordion';
import { useLanguage } from '../../../contexts/LanguageContext';
import { FAQItem } from '../types';

interface FaqSectionProps {
  filteredFaqs: FAQItem[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ filteredFaqs }) => {
  const { t, language } = useLanguage();

  return (
    <section className="max-w-3xl mx-auto px-4 mb-12">
      <div className="flex items-center mb-6">
        <HelpCircle className="h-6 w-6 text-temu-orange mr-2" />
        <h2 className="text-2xl font-bold">{t('frequentlyAskedQuestions')}</h2>
      </div>

      {filteredFaqs.length > 0 ? (
        <Accordion type="single" collapsible className="w-full">
          {filteredFaqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left font-medium text-lg hover:text-temu-orange">
                {faq.question[language] || faq.question.en}
              </AccordionTrigger>
              <AccordionContent className="text-gray-700">
                {faq.answer[language] || faq.answer.en}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">{t('noFAQsMatch')}</p>
        </div>
      )}
    </section>
  );
};

export default FaqSection;
