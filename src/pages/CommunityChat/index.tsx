
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Users, MessageCircle, LogIn } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { useCommunity } from '../../contexts/CommunityContext';

// Components
import HighlightedMessages from './components/HighlightedMessages';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { useTimeFormatter } from './hooks/useTimeFormatter';
import { useChatMessages } from './hooks/useChatMessages';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useUserProfileViewer } from '@/hooks/useUserProfileViewer';
import UserProfileModal from '@/components/shared/UserProfileModal';
import { UserProfileInfo } from '@/pages/CommunityChat/types';
import { Link } from 'react-router-dom';

const CommunityChat: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { messages } = useCommunity();
  const [message, setMessage] = useState('');
  const { formatTimestamp } = useTimeFormatter();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { selectedUser, openUserDetails, closeUserDetails } = useUserProfileViewer();
  
  const { 
    likedMessages, 
    handleLikeMessage, 
    sendMessage
  } = useChatMessages();
  
  // Function to handle user avatar/name click
  const handleUserClick = (chatUser: any) => {
    // Mock profile data based on chat user
    const userProfile: UserProfileInfo = {
      id: chatUser.user.id,
      name: chatUser.user.name,
      avatar: chatUser.user.avatar,
      earnings: Math.floor(Math.random() * 20000) + 5000, // Random earnings
      country: 'US', // Default country
      level: Math.floor(Math.random() * 10) + 1, // Random level 1-10
      registrationDate: new Date(Date.now() - Math.floor(Math.random() * 31536000000)), // Random date within last year
      location: 'New York, US', // Adding location property
      withdrawals: [
        {
          id: `w-${chatUser.user.id}-1`,
          userId: chatUser.user.id,
          amount: Math.floor(Math.random() * 300) + 50,
          status: 'completed',
          createdAt: new Date(Date.now() - 1000000)
        },
        {
          id: `w-${chatUser.user.id}-2`,
          userId: chatUser.user.id,
          amount: Math.floor(Math.random() * 200) + 20,
          status: 'pending',
          createdAt: new Date(Date.now() - 5000000)
        }
      ]
    };
    
    openUserDetails(userProfile);
  };
  
  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast({
        title: t("loginRequired"),
        description: t("pleaseLoginToJoinConversation"),
        variant: "destructive",
        duration: 3000, // 3 segundos (padrão mobile)
      });
      return;
    }
    
    if (!message.trim()) return;
    
    // Send the message
    sendMessage(message);
    setMessage('');
    setReplyingTo(null);
    
    toast({
      title: t("messageSent"),
      description: t("yourMessageHasBeenPosted"),
      duration: 3000, // 3 segundos (padrão mobile)
    });
  };
  
  const handleReply = (messageId: string) => {
    if (!isAuthenticated) {
      toast({
        title: t("loginRequired"),
        description: t("pleaseLoginToLikeMessages"),
        variant: "destructive",
        duration: 3000, // 3 segundos (padrão mobile)
      });
      return;
    }
    
    setReplyingTo(messageId);
  };
  
  // Get highlighted messages
  const highlightedMessages = messages.filter(msg => msg.isHighlighted);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="animate-fade-in max-w-[430px] mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 text-sisloguin-orange mr-2" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-sisloguin-orange to-amber-500 bg-clip-text text-transparent">
            {t('community')}
          </h1>
        </div>
        {isAuthenticated && (
          <Badge variant="outline" className="flex items-center bg-green-100 text-green-800 hover:bg-green-200">
            <Users className="h-3 w-3 mr-1" />
            <span>{messages.length} {t('messages')}</span>
          </Badge>
        )}
      </div>
      
      {/* Highlighted Messages Section - Mostrar apenas quando autenticado */}
      {isAuthenticated && highlightedMessages.length > 0 && (
        <HighlightedMessages 
          highlightedMessages={highlightedMessages} 
          formatTimestamp={formatTimestamp} 
        />
      )}
      
      {/* Main Chat - UI diferente dependendo da autenticação */}
      {isAuthenticated ? (
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden mb-20">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-sisloguin-orange">
              <MessageCircle className="h-5 w-5" />
              {t('liveCommunityChat')}
            </CardTitle>
            <CardDescription>
              {t('joinTheConversation')}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4">
            {/* Messages List - Pass onUserClick handler */}
            <MessageList 
              messages={messages} 
              formatTimestamp={formatTimestamp} 
              handleLikeMessage={handleLikeMessage} 
              likedMessages={likedMessages}
              onReply={handleReply}
              replyingTo={replyingTo}
              onUserClick={handleUserClick}
            />
            
            {/* Message Input */}
            <MessageInput 
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              isAuthenticated={isAuthenticated}
              replyingTo={replyingTo}
              cancelReply={() => setReplyingTo(null)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden mb-20">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <div className="text-center space-y-6">
              <div className="mx-auto bg-orange-50 rounded-full p-6 w-24 h-24 flex items-center justify-center">
                <LogIn className="h-12 w-12 text-sisloguin-orange" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {t('loginToAccessChat')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('pleaseLoginToJoinConversation')}
              </p>
              <Button asChild className="bg-sisloguin-orange hover:bg-amber-600 text-white px-8 py-2">
                <Link to="/auth">
                  {t('login')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* User Profile Modal */}
      <UserProfileModal 
        user={selectedUser}
        open={!!selectedUser}
        onClose={closeUserDetails}
      />
    </motion.div>
  );
};

export default CommunityChat;
