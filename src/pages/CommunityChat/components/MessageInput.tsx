import React, { useRef, useEffect, useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

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
  const [isFocused, setIsFocused] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && message.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emoji: any) => {
    const emojiChar = emoji.native;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = message.substring(0, start) + emojiChar + message.substring(end);
    setMessage(newText);

    // Refocus and move cursor
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emojiChar.length;
    }, 0);
  };

  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  return (
    <div className="mt-4 max-w-[430px] mx-auto relative">
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

        {showEmojiPicker && (
          <div className="absolute bottom-[100px] left-2 z-50">
            <Picker data={data} onEmojiSelect={addEmoji} />
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className="text-gray-500 hover:text-temu-orange rounded-full h-8 w-8"
              disabled={!isAuthenticated}
            >
              <Smile className="h-5 w-5" />
              <span className="sr-only">{t('addEmoji')}</span>
            </Button>
          </div>

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button 
              type="button"  // <- Make sure it's "button" not "submit"
              onClick={() => {
                if (message.trim()) {
                  handleSendMessage();
                }
              }}
              disabled={!message.trim() || !isAuthenticated}
              className={`bg-gradient-to-r from-temu-orange to-amber-500 hover:opacity-90 text-white rounded-full px-4 ${
                (!message.trim() || !isAuthenticated) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
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
