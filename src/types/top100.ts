
export interface TopUser {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  earnings: number;
  country: string;
  location?: string; // Adding location field
  registrationDate: Date;
  level: number;
  withdrawals: Withdrawal[];
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: Date;
}
