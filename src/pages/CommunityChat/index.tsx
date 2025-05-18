import React, { useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Users, MessageCircle, LogIn } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import HighlightedMessages from './components/HighlightedMessages';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { useTimeFormatter } from './hooks/useTimeFormatter';
import { useChatMessages } from './hooks/useChatMessages';
import { useUserProfile } from './hooks/useUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useUserProfileViewer } from '@/hooks/useUserProfileViewer';
import UserProfileModal from '@/components/shared/UserProfileModal';
import { Link } from 'react-router-dom';

const CommunityChat: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { formatTimestamp } = useTimeFormatter();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const { selectedUser, openUserDetails, closeUserDetails } = useUserProfileViewer();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage, likeMessage } = useChatMessages();
  const { fetchUserProfile } = useUserProfile();

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUserClick = async (chatMessage: any) => {
    const userProfile = await fetchUserProfile(
      chatMessage.user.id,
      chatMessage.user.name,
      chatMessage.user.avatar
    );
    
    if (userProfile) {
      openUserDetails(userProfile);
    }
  };

  const handleSendMessage = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: t("loginRequired"),
        description: t("pleaseLoginToJoinConversation"),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!message.trim()) return;

    const success = await sendMessage(message, user.id, replyingTo);
    if (success) {
      setMessage('');
      setReplyingTo(null);
    }
  };

  const handleReply = (messageId: string) => {
    if (!isAuthenticated) {
      toast({
        title: t("loginRequired"),
        description: t("pleaseLoginToLikeMessages"),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setReplyingTo(messageId);
  };

  const handleLikeMessage = async (messageId: string) => {
    if (!isAuthenticated) {
      toast({
        title: t("loginRequired"),
        description: t("pleaseLoginToLikeMessages"),
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    await likeMessage(messageId);
  };

  const highlightedMessages = messages.filter(msg => msg.is_highlighted);

  if (loading) {
    return (
      <div className="max-w-[430px] mx-auto flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-temu-orange"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="animate-fade-in max-w-[430px] mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <MessageCircle className="h-6 w-6 text-temu-orange mr-2" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-temu-orange to-amber-500 bg-clip-text text-transparent">
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

      {isAuthenticated && highlightedMessages.length > 0 && (
        <HighlightedMessages
          highlightedMessages={highlightedMessages}
          formatTimestamp={formatTimestamp}
        />
      )}

      {isAuthenticated ? (
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden mb-20">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-temu-orange">
              <MessageCircle className="h-5 w-5" />
              {t('liveCommunityChat')}
            </CardTitle>
            <CardDescription>
              {t('joinTheConversation')}
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4">
            <div className="max-h-[400px] overflow-y-auto flex flex-col gap-3" id="message-container">
              <MessageList
                messages={messages}
                formatTimestamp={formatTimestamp}
                handleLikeMessage={handleLikeMessage}
                onReply={handleReply}
                replyingTo={replyingTo}
                onUserClick={handleUserClick}
              />
              <div ref={messageEndRef} />
            </div>

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
                <LogIn className="h-12 w-12 text-temu-orange" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                {t('loginToAccessChat')}
              </h2>
              <p className="text-gray-600 mb-4">
                {t('pleaseLoginToJoinConversation')}
              </p>
              <Button asChild className="bg-temu-orange hover:bg-amber-600 text-white px-8 py-2">
                <Link to="/auth">
                  {t('login')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <UserProfileModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={closeUserDetails}
      />
    </motion.div>
  );
};

export default CommunityChat;
