import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: any[];
  formatTimestamp: (date: Date) => string;
  handleLikeMessage: (messageId: string) => void;
  onReply: (messageId: string) => void;
  replyingTo: string | null;
  onUserClick?: (message: any) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  formatTimestamp,
  handleLikeMessage,
  onReply,
  replyingTo,
  onUserClick
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4 mb-4">
      {messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {t('noMessagesYet')}
        </div>
      ) : (
        messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            formatTimestamp={formatTimestamp}
            liked={false} // You can implement proper like tracking later
            onLike={() => handleLikeMessage(message.id)}
            onReply={() => onReply(message.id)}
            replying={replyingTo === message.id}
            onUserClick={onUserClick ? () => onUserClick(message) : undefined}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;