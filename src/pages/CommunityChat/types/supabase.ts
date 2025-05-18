export interface Database {
  public: {
    Tables: {
      community_messages: {
        Row: {
          id: string;
          text: string;
          user_id: string;
          timestamp: number;
          likes: number;
          is_highlighted: boolean;
          is_translated: boolean;
          message_id: string;
          reply_to: string | null;
          created_at: string;
          background_color: string;
        };
        Insert: {
          id?: string;
          text: string;
          user_id: string;
          timestamp: number;
          likes?: number;
          is_highlighted?: boolean;
          is_translated?: boolean;
          message_id: string;
          reply_to?: string | null;
          created_at?: string;
          background_color?: string;
        };
        Update: {
          id?: string;
          text?: string;
          user_id?: string;
          timestamp?: number;
          likes?: number;
          is_highlighted?: boolean;
          is_translated?: boolean;
          message_id?: string;
          reply_to?: string | null;
          created_at?: string;
          background_color?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          avatar_url: string;
          country_code: string;
          created_at: string;
          level: number;
        };
        Insert: {
          id: string;
          full_name: string;
          avatar_url: string;
          country_code?: string;
          created_at?: string;
          level?: number;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string;
          country_code?: string;
          created_at?: string;
          level?: number;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          activity: string;
          status: 'pending' | 'completed' | 'failed';
          created_at: string;
          date: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          activity: string;
          status: 'pending' | 'completed' | 'failed';
          created_at?: string;
          date?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          activity?: string;
          status?: 'pending' | 'completed' | 'failed';
          created_at?: string;
          date?: string;
        };
      };
    };
  };
} 