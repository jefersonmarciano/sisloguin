export interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
  avatar_color?: string;
  phone_number?: string;
  country_code?: string;
  created_at: string;
  updated_at: string;
  last_review_reset?: string;
  reviews_completed: number;
  like_reviews_completed: number;
  inspector_reviews_completed: number;
  wheels_remaining: number;
  balance: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
} 