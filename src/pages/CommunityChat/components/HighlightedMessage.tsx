
import React from 'react';
import { Star } from 'lucide-react';
import { ChatMessage } from '../../../utils/commentGenerator';
import { useLanguage } from '../../../contexts/LanguageContext';

interface HighlightedMessageProps {
  message: ChatMessage;
  formatTimestamp: (date: Date) => string;
}

const HighlightedMessage: React.FC<HighlightedMessageProps> = ({ message, formatTimestamp }) => {
  const { t } = useLanguage();
  
  return (
    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center mb-2">
        <img src={message.user.avatar} alt={message.user.name} className="h-8 w-8 rounded-full mr-2" />
        <div className="flex-1">
          <div className="font-medium text-sm">{message.user.name}</div>
          <div className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</div>
        </div>
        <div className="flex items-center gap-1 text-yellow-600">
          <Star className="h-4 w-4 fill-current" />
          <span className="text-xs font-medium">{message.likes}</span>
        </div>
      </div>
      <p className="text-sm text-gray-700">{message.text}</p>
    </div>
  );
};

export default HighlightedMessage;
