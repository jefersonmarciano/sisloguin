
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  question: string;
}

export interface TransactionData {
  amount: number;
  type: string;
  status: string;
}
