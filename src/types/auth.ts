
export interface User {
  id: string;
  email: string;
  fullName: string;
  name: string; // Added to maintain compatibility with existing code
  avatarUrl?: string;
  avatar?: string; // Added to maintain compatibility with existing code
  avatarColor?: string;
  phoneNumber?: string;
  countryCode?: string;
  createdAt: string;
  updatedAt: string;
  lastReviewReset?: Date | null;
  reviewsCompleted: number;
  likeReviewsCompleted: number;
  inspectorReviewsCompleted: number;
  wheelsRemaining: number;
  balance: number;
  reviewsLimit?: number;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  isInitializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateBalance: (amount: number) => Promise<number | undefined>;
  completeReview: (type: 'like' | 'inspector') => void;
  checkAndResetReviews: () => void;
  useWheel: () => Promise<number>;
  updateUserAvatar: (avatarUrl: string) => Promise<boolean>;
  updateUserProfile: (fullName: string, email: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}
