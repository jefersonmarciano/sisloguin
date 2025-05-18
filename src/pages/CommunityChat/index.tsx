import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { Users, MessageCircle, LogIn } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '@/lib/supabase';
import HighlightedMessages from './components/HighlightedMessages';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { useTimeFormatter } from './hooks/useTimeFormatter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useUserProfileViewer } from '@/hooks/useUserProfileViewer';
import UserProfileModal from '@/components/shared/UserProfileModal';
import { UserProfileInfo } from '@/pages/CommunityChat/types';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: number;
  likes: number;
  is_highlighted: boolean;
  is_translated: boolean;
  language: string;
  isHighlighted?: boolean;
}

const CommunityChat: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { formatTimestamp } = useTimeFormatter();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedUser, openUserDetails, closeUserDetails } = useUserProfileViewer();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('community_messages')
        .select(`
          *,
          profile:profiles!user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;

      const formattedMessages = data.map((msg) => ({
        id: msg.id,
        text: msg.text,
        user: {
          id: msg.user_id || 'unknown',
          name: msg.profile?.full_name || 'Anonymous',
          avatar: msg.profile?.avatar_url || `https://ui-avatars.com/api/?name=${msg.profile?.full_name || 'Anonymous'}&background=random`,
        },
        timestamp: msg.timestamp,
        likes: msg.likes,
        is_highlighted: msg.is_highlighted,
        is_translated: msg.is_translated,
        language: 'en',
        isHighlighted: msg.is_highlighted,
      }));

      // Reverse to show oldest at top, newest at bottom
      setMessages(formattedMessages.reverse());
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: t("error"),
        description: t("failedToLoadMessages"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel('community_messages_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'community_messages',
        },
        async (payload) => {
          const { data: newMessage, error } = await supabase
            .from('community_messages')
            .select(`
              *,
              profile:profiles!user_id (
                id,
                full_name,
                avatar_url
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (!error && newMessage) {
            setMessages((prev) => {
              const updated = [...prev, {
                id: newMessage.id,
                text: newMessage.text,
                user: {
                  id: newMessage.user_id || 'unknown',
                  name: newMessage.profile?.full_name || 'Anonymous',
                  avatar: newMessage.profile?.avatar_url || `https://ui-avatars.com/api/?name=${newMessage.profile?.full_name || 'Anonymous'}&background=random`,
                },
                timestamp: newMessage.timestamp,
                likes: newMessage.likes,
                is_highlighted: newMessage.is_highlighted,
                is_translated: newMessage.is_translated,
                language: 'en',
                isHighlighted: newMessage.is_highlighted,
              }];
              return updated.slice(-20); // keep latest 20
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleUserClick = async (chatMessage: ChatMessage) => {
    try {
        // Get profile info from supabase
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('country_code, created_at')
            .eq('id', chatMessage.user.id)
            .single();
        
        if (profileError) throw profileError;
        
        const country = profileData?.country_code || 'Unknown';
        const registrationDate = profileData?.created_at ? new Date(profileData.created_at) : new Date();

        // Fetch all transactions for the user
        const { data: transactions, error: transactionsError } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', chatMessage.user.id)
            .order('created_at', { ascending: false });
        
        if (transactionsError) throw transactionsError;

        // Calculate earnings (only include positive amounts that are not withdrawals)
        const earnings = transactions
            ?.filter(tx => tx.amount > 0 && tx.activity !== 'withdraw')
            ?.reduce((sum, tx) => sum + tx.amount, 0) || 0;

        // Prepare withdrawals (only include transactions marked as withdrawal)
        const withdrawals = transactions
            ?.filter(tx => tx.activity === 'withdraw')
            ?.map(tx => ({
                id: tx.id,
                userId: tx.user_id,
                amount: Math.abs(tx.amount), // withdrawals are typically negative in DB
                status: tx.status || 'pending',
                createdAt: new Date(tx.created_at)
            })) || [];

        const userProfile: UserProfileInfo = {
            id: chatMessage.user.id,
            name: chatMessage.user.name,
            avatar: chatMessage.user.avatar,
            earnings: earnings,
            country: country,
            registrationDate: registrationDate,
            location: country,
            withdrawals: withdrawals
        };

        openUserDetails(userProfile);
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Optionally show error to user
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

    try {
      const { error } = await supabase.from('community_messages').insert({
        text: message.trim(),
        user_id: user.id,
        is_highlighted: false,
        is_translated: false,
        likes: 0,
        message_id: `msg_${Date.now() + Math.random() * 1000}`,
        timestamp: Date.now(),
        reply_to: replyingTo,
      });

      if (error) throw error;

      setMessage('');
      setReplyingTo(null);
      toast({
        title: t("messageSent"),
        description: t("yourMessageHasBeenPosted"),
        duration: 3000,
      });
      fetchMessages(); // Refresh messages after sending
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t("error"),
        description: t("failedToSendMessage"),
        variant: "destructive",
      });
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

    try {
      const messageToLike = messages.find(msg => msg.id === messageId);
      if (!messageToLike) return;

      const { error } = await supabase
        .from('community_messages')
        .update({ likes: messageToLike.likes + 1 })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(messages.map(msg =>
        msg.id === messageId
          ? { ...msg, likes: msg.likes + 1 }
          : msg
      ));
    } catch (error) {
      console.error('Error liking message:', error);
      toast({
        title: t("error"),
        description: t("failedToLikeMessage"),
        variant: "destructive",
      });
    }
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
