
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface SupportButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const SupportButton: React.FC<SupportButtonProps> = ({ 
  variant = 'default', 
  size = 'default',
  className = ''
}) => {
  const { t } = useLanguage();
  
  return (
    <Button 
      variant={variant}
      size={size}
      className={className}
      asChild
    >
      <Link to="/support">
        <HelpCircle className="h-4 w-4 mr-2" />
        {t('visitSupport')}
      </Link>
    </Button>
  );
};

export default SupportButton;
