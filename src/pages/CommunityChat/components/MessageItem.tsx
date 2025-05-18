// MessageItem.tsx
import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AnimatedLikeButton from './AnimatedLikeButton';
import { MessageSquare, Flag } from 'lucide-react';

interface MessageItemProps {
  message: {
    id: string;
    text: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    timestamp: number; // Expecting a Unix timestamp
    likes: number;
    is_highlighted: boolean;
    is_translated: boolean;
    language: string;
  };
  formatTimestamp: (timestamp: number | Date) => string;
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
  
  const getTranslatedText = () => {
    if (message.language === language) {
      return message.text;
    }
    
    if (language === 'es' && message.language === 'en') {
      return `${message.text} [traducido del inglés]`;
    } else if (language === 'en' && message.language === 'es') {
      return `${message.text} [translated from Spanish]`;
    }
    
    return message.text;
  };
  
  return (
    <div className={`p-3 rounded-lg ${message.is_highlighted ? 'bg-amber-50' : 'bg-gray-50'} ${replying ? 'border-2 border-temu-orange' : ''}`}>
      <div className="flex items-start space-x-2">
        <div className="cursor-pointer" onClick={onUserClick}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.user.avatar} alt={message.user.name} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col">
            <div className="flex items-center">
              <span 
                className="font-medium text-sm mr-2 cursor-pointer hover:text-temu-orange transition-colors" 
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
                className="flex items-center text-gray-500 hover:text-temu-orange transition-colors"
                onClick={onReply}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {t('reply')}
              </button>
              
              <button className="flex items-center text-gray-500 hover:text-temu-orange transition-colors">
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