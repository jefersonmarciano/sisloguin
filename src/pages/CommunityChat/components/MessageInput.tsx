
import React, { useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';

interface MessageInputProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  isAuthenticated: boolean;
  replyingTo: string | null;
  cancelReply: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  message, 
  setMessage, 
  handleSendMessage, 
  isAuthenticated,
  replyingTo,
  cancelReply
}) => {
  const { t } = useLanguage();
  const [isFocused, setIsFocused] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-focus textarea when replying
  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  return (
    <div className="mt-4 max-w-[430px] mx-auto">
      {replyingTo && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 p-2 mb-2 rounded-lg text-xs flex justify-between items-center"
        >
          <span className="text-blue-600 font-medium">{t('replyingToMessage')}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={cancelReply}
            className="h-6 text-xs"
          >
            {t('cancel')}
          </Button>
        </motion.div>
      )}
      
      <div className={`flex flex-col gap-2 rounded-lg border p-2 transition-all ${isFocused ? 'border-temu-orange shadow-sm' : 'border-gray-200'}`}>
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isAuthenticated 
            ? replyingTo 
              ? t("typeYourReply") 
              : t("typeYourMessage") 
            : t("loginToComment")}
          className="resize-none border-0 focus:ring-0 p-2 min-h-[60px] text-sm"
          disabled={!isAuthenticated}
        />
        
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="text-gray-500 hover:text-temu-orange rounded-full h-8 w-8"
              disabled={!isAuthenticated}
            >
              <Smile className="h-5 w-5" />
              <span className="sr-only">{t('addEmoji')}</span>
            </Button>
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="text-gray-500 hover:text-temu-orange rounded-full h-8 w-8"
              disabled={!isAuthenticated}
            >
              <Paperclip className="h-5 w-5" />
              <span className="sr-only">{t('attachFile')}</span>
            </Button>
          </div>
          
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={handleSendMessage}
              disabled={!message.trim() || !isAuthenticated}
              className={`bg-gradient-to-r from-temu-orange to-amber-500 hover:opacity-90 text-white rounded-full px-4 ${(!message.trim() || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Send className="h-4 w-4 mr-1" />
              {t('send')}
            </Button>
          </motion.div>
        </div>
      </div>
      
      {!isAuthenticated && (
        <p className="text-center text-sm text-gray-500 mt-4">
          {t('pleaseLoginToJoinConversation')}
        </p>
      )}
    </div>
  );
};

export default MessageInput;
