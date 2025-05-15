
import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { ChatMessage } from '../../../utils/commentGenerator';
import HighlightedMessage from './HighlightedMessage';

interface HighlightedMessagesProps {
  highlightedMessages: ChatMessage[];
  formatTimestamp: (date: Date) => string;
}

const HighlightedMessages: React.FC<HighlightedMessagesProps> = ({ 
  highlightedMessages, 
  formatTimestamp 
}) => {
  if (highlightedMessages.length === 0) return null;
  
  return (
    <div className="sisloguin-card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg flex items-center">
          <Star className="h-5 w-5 text-yellow-500 mr-2" />
          Highlighted Messages
        </h2>
        <a href="#" className="text-sisloguin-orange flex items-center text-sm">
          See All
          <ChevronRight className="h-4 w-4 ml-1" />
        </a>
      </div>
      
      <div className="space-y-3">
        {highlightedMessages.slice(0, 2).map((msg) => (
          <HighlightedMessage 
            key={msg.id} 
            message={msg} 
            formatTimestamp={formatTimestamp} 
          />
        ))}
      </div>
    </div>
  );
};

export default HighlightedMessages;
