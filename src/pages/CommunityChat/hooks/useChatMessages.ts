import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChatMessage } from '../types';
import { Database } from '../types/supabase';

type CommunityMessage = Database['public']['Tables']['community_messages']['Row'] & {
  profile: Database['public']['Tables']['profiles']['Row'] | null;
};

export const useChatMessages = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

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

      const formattedMessages = (data as unknown as CommunityMessage[]).map((msg) => ({
        id: msg.id,
        text: msg.text,
        user: {
          id: msg.user_id,
          name: msg.profile?.full_name || 'Anonymous',
          avatar: msg.profile?.avatar_url || `https://ui-avatars.com/api/?name=${msg.profile?.full_name || 'Anonymous'}&background=random`,
        },
        timestamp: msg.timestamp,
        likes: msg.likes,
        is_highlighted: msg.is_highlighted,
        is_translated: msg.is_translated,
        language: 'en',
      }));

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

  const sendMessage = async (message: string, userId: string, replyTo?: string) => {
    try {
      const { error } = await supabase.from('community_messages').insert({
        text: message.trim(),
        user_id: userId,
        is_highlighted: false,
        is_translated: false,
        likes: 0,
        message_id: `msg_${Date.now() + Math.random() * 1000}`,
        timestamp: Date.now(),
        reply_to: replyTo,
      });

      if (error) throw error;

      toast({
        title: t("messageSent"),
        description: t("yourMessageHasBeenPosted"),
        duration: 3000,
      });

      await fetchMessages();
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: t("error"),
        description: t("failedToSendMessage"),
        variant: "destructive",
      });
      return false;
    }
  };

  const likeMessage = async (messageId: string) => {
    try {
      const messageToLike = messages.find(msg => msg.id === messageId);
      if (!messageToLike) return false;

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
      return true;
    } catch (error) {
      console.error('Error liking message:', error);
      toast({
        title: t("error"),
        description: t("failedToLikeMessage"),
        variant: "destructive",
      });
      return false;
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
                  id: newMessage.user_id,
                  name: newMessage.profile?.full_name || 'Anonymous',
                  avatar: newMessage.profile?.avatar_url || `https://ui-avatars.com/api/?name=${newMessage.profile?.full_name || 'Anonymous'}&background=random`,
                },
                timestamp: newMessage.timestamp,
                likes: newMessage.likes,
                is_highlighted: newMessage.is_highlighted,
                is_translated: newMessage.is_translated,
                language: 'en',
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

  return {
    messages,
    loading,
    sendMessage,
    likeMessage,
    fetchMessages,
  };
}; 