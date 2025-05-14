
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { ChatMessage } from '../utils/commentGenerator';
import { useCommunityMessages } from '../hooks/useCommunityMessages';
import { AuthContext } from './AuthContext';

interface CommunityContextType {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (message: ChatMessage) => void;
  notificationHistory: ChatMessage[];
  clearNotifications: () => void;
  totalCommentCount: number;
  recentMessages: ChatMessage[]; // For showing on the home page
  isAuthenticated: boolean; // Accept authentication state passed from parent
}

const CommunityContext = createContext<CommunityContextType | undefined>(undefined);

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (context === undefined) {
    throw new Error('useCommunity must be used within a CommunityProvider');
  }
  return context;
};

interface CommunityProviderProps {
  children: ReactNode;
}

export const CommunityProvider: React.FC<CommunityProviderProps> = ({ children }) => {
  // Get auth state directly from parent component via useContext
  const authContext = useContext(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated || false;

  const {
    messages,
    notificationHistory,
    recentMessages,
    totalCommentCount,
    addMessage,
    updateMessage,
    clearNotifications
  } = useCommunityMessages(isAuthenticated);
  
  return (
    <CommunityContext.Provider 
      value={{ 
        messages, 
        addMessage,
        updateMessage,
        notificationHistory,
        clearNotifications,
        totalCommentCount,
        recentMessages,
        isAuthenticated
      }}
    >
      {children}
    </CommunityContext.Provider>
  );
};
