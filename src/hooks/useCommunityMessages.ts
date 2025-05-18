
import { useState, useEffect } from 'react';
import { ChatMessage, generateRandomComment, generateMultipleComments, getTotalCommentCount } from '../utils/commentGenerator';
import { useToast } from './use-toast';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const useCommunityMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<ChatMessage[]>([]);
  const [recentMessages, setRecentMessages] = useState<ChatMessage[]>([]);
  const { toast } = useToast();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth(); // Added auth context
  const totalCommentCount = getTotalCommentCount();
  
  // Initialize with some messages when the component is mounted (only if authenticated)
  useEffect(() => {
    // Only load messages if the user is authenticated
    if (isAuthenticated) {
      const initialMessages = generateMultipleComments(8);
      setMessages(initialMessages);
      
      // Set 2 recent messages for dashboard
      setRecentMessages(initialMessages.slice(0, 2));
    } else {
      // Clear messages when not authenticated
      setMessages([]);
      setRecentMessages([]);
    }
    
    // Load notification history from localStorage if available
    const savedNotifications = localStorage.getItem('communityNotifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const fixedDates = parsed.map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp)
        }));
        setNotificationHistory(fixedDates);
      } catch (error) {
        console.error('Failed to parse notification history:', error);
      }
    }
  }, [isAuthenticated]); // Added isAuthenticated as dependency

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('communityNotifications', JSON.stringify(notificationHistory));
  }, [notificationHistory]);

  // Periodically add new comments (every 30-90 seconds) - only if authenticated
  useEffect(() => {
    // Don't generate comments if not authenticated
    if (!isAuthenticated) return;
    
    const generateComment = () => {
      // Get a random comment alternating languages for demonstration
      const newComment = generateRandomComment();
      
      // Add to messages
      setMessages(prevMessages => [newComment, ...prevMessages]);
      
      // Update recent messages for dashboard
      setRecentMessages(prev => [newComment, ...prev].slice(0, 2));
      
      // Add to notification history
      setNotificationHistory(prev => [newComment, ...prev]);
      
      // Show toast notification at top with appropriate language
      const notificationTitle = newComment.language === 'en' ? 
        `${newComment.user.name} commented` : 
        `${newComment.user.name} comentó`;
        
      toast({
        title: notificationTitle,
        description: newComment.text.length > 60 ? `${newComment.text.substring(0, 60)}...` : newComment.text,
        duration: 3000, // 3 seconds for notifications (mobile standard)
      });
      
      // Schedule next comment with random delay
      const nextDelay = Math.floor(Math.random() * (90000 - 30000)) + 30000; // Between 30-90 seconds
      setTimeout(generateComment, nextDelay);
    };
    
    // Start the cycle (first comment appears after 15-45 seconds)
    const initialDelay = Math.floor(Math.random() * (45000 - 15000)) + 15000;
    const timer = setTimeout(generateComment, initialDelay);
    
    return () => clearTimeout(timer);
  }, [toast, isAuthenticated]); // Added isAuthenticated as dependency

  const addMessage = (message: ChatMessage) => {
    setMessages(prevMessages => [message, ...prevMessages]);
    setRecentMessages(prev => [message, ...prev].slice(0, 2));
  };
  
  const updateMessage = (updatedMessage: ChatMessage) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      )
    );
    
    // Also update in recent messages if present
    setRecentMessages(prev => 
      prev.map(msg => 
        msg.id === updatedMessage.id ? updatedMessage : msg
      ).slice(0, 2)
    );
  };

  const clearNotifications = () => {
    setNotificationHistory([]);
  };

  return {
    messages,
    notificationHistory,
    recentMessages,
    totalCommentCount,
    addMessage,
    updateMessage,
    clearNotifications
  };
};
