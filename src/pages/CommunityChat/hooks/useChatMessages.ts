
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCommunity } from '@/contexts/CommunityContext';
import { ChatMessage, ChatReaction } from '../types';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export const useChatMessages = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const { messages: communityMessages, addMessage, notificationHistory, updateMessage } = useCommunity();
  const [likedMessages, setLikedMessages] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<ChatMessage[]>(communityMessages);
  const { toast } = useToast();
  
  // Update our local messages when community messages change
  useEffect(() => {
    setMessages(communityMessages);
  }, [communityMessages]);
  
  // Handle like/unlike functionality
  const handleLikeMessage = useCallback((messageId: string) => {
    if (!user) return;
    
    setLikedMessages(prev => {
      const wasLiked = !!prev[messageId];
      
      // Update local state first for immediate UI feedback
      return {
        ...prev,
        [messageId]: !wasLiked
      };
    });
    
    // Find the message to update
    const messageToUpdate = messages.find(msg => msg.id === messageId);
    if (messageToUpdate) {
      // Create a new message object with updated likes count
      const updatedMessage = {
        ...messageToUpdate,
        likes: likedMessages[messageId] 
          ? Math.max(0, messageToUpdate.likes - 1) // Unlike: decrease likes (minimum 0)
          : messageToUpdate.likes + 1  // Like: increase likes
      };
      
      // Update the message in the community context
      updateMessage(updatedMessage);
    }
    
    // Show a toast notification in the current language
    toast({
      title: likedMessages[messageId] ? t('unlike') : t('like'),
      description: likedMessages[messageId] 
        ? t('youRemovedLikeFromMessage')
        : t('youLikedThisMessage'),
      duration: 2000,
    });
  }, [user, likedMessages, messages, updateMessage, toast, t]);
  
  // Send a message with proper language tag
  const sendMessage = useCallback((text: string) => {
    if (!user || !text.trim()) return;
    
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      user: {
        id: user.id,
        name: user.name || 'User',
        avatar: user.avatar || 'https://i.pravatar.cc/150?img=1',
      },
      text: text.trim(),
      timestamp: new Date(),
      likes: 0,
      language: language, // Setting the language based on current UI language
    };
    
    addMessage(newMessage);
  }, [user, addMessage, language]);
  
  return {
    messages,
    likedMessages,
    handleLikeMessage,
    sendMessage,
    notificationCount: notificationHistory.length,
  };
};
