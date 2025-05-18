export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  language_preference?: 'en' | 'es';
}

export interface ChatMessage {
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
}

export interface ChatReaction {
  id: string;
  userId: string;
  messageId: string;
  timestamp: Date;
}

// Added this interface to link chat users with top users for profile viewing
export interface UserProfileInfo {
  id: string;
  name: string;
  avatar: string;
  earnings: number;
  country: string;
  registrationDate: Date;
  location: string;
  level: number;
  withdrawals: UserWithdrawal[];
}

export interface UserWithdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}
