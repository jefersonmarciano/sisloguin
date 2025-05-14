
export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  language_preference?: 'en' | 'es';
}

export interface ChatMessage {
  id: string;
  user: ChatUser;
  text: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean;
  parentId?: string | null;
  replies?: ChatMessage[];
  isHighlighted?: boolean;
  language: 'en' | 'es';
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
  level: number;
  country: string;
  location?: string;
  registrationDate: Date;
  withdrawals: UserWithdrawal[];
}

export interface UserWithdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}
