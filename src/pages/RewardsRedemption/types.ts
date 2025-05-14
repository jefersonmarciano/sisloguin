
export interface RewardOption {
  id: string;
  type: string;
  minAmount: number;
  image: string;
  processingTime: string;
  description: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  date: string;
}
