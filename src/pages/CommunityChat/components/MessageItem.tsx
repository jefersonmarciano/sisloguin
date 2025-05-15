
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { ChatMessage } from '../../../utils/commentGenerator';
import { useAuth } from '../../../contexts/AuthContext';
import AnimatedLikeButton from './AnimatedLikeButton';
import { MessageSquare, Flag } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface MessageItemProps {
  message: ChatMessage;
  formatTimestamp: (date: Date) => string;
  liked: boolean;
  onLike: () => void;
  onReply: () => void;
  replying: boolean;
  onUserClick?: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  formatTimestamp,
  liked,
  onLike,
  onReply,
  replying,
  onUserClick
}) => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  // Enhanced function to get translated text based on the current language setting
  const getTranslatedText = () => {
    // If message is in the same language as current setting, no translation needed
    if (message.language === language) {
      return message.text;
    }
    
    // Translation logic between English and Spanish
    if (language === 'es' && message.language === 'en') {
      // English to Spanish translation
      return `${message.text} [traducido del inglés]`;
    } else if (language === 'en' && message.language === 'es') {
      // Spanish to English translation
      return `${message.text} [translated from Spanish]`;
    }
    
    // Default case - return original text
    return message.text;
  };
  
  return (
    <div
      className={`p-3 rounded-lg ${message.isHighlighted ? 'bg-amber-50' : 'bg-gray-50'} ${replying ? 'border-2 border-sisloguin-orange' : ''}`}
    >
      <div className="flex items-start space-x-2">
        {/* User Avatar - clickable */}
        <div 
          className="cursor-pointer"
          onClick={onUserClick}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.user.avatar} alt={message.user.name} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col">
            {/* User Name - clickable */}
            <div className="flex items-center">
              <span 
                className="font-medium text-sm mr-2 cursor-pointer hover:text-sisloguin-orange transition-colors" 
                onClick={onUserClick}
              >
                {message.user.name}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
            
            <p className="mt-1 text-sm break-words">
              {getTranslatedText()}
            </p>
            
            <div className="flex items-center mt-2 space-x-3 text-xs">
              <AnimatedLikeButton
                isLiked={liked}
                count={message.likes}
                onLike={onLike}
                text={t('like')}
              />
              
              <button
                className="flex items-center text-gray-500 hover:text-sisloguin-orange transition-colors"
                onClick={onReply}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {t('reply')}
              </button>
              
              <button className="flex items-center text-gray-500 hover:text-sisloguin-orange transition-colors">
                <Flag className="h-4 w-4 mr-1" />
                {t('report')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
