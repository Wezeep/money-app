export type RootStackParamList = {
  SignIn: undefined;
  MainTabs: undefined;
  InternationalTransfer: undefined;
  PeerToPeerTransfer: undefined;
  RequestMoney: undefined;
  TransactionHistory: undefined;
  Wallet: undefined;
};

export type TabParamList = {
  Home: undefined;
  Transactions: undefined;
  Wallet: undefined;
};

export interface Transaction {
  id: string;
  type: 'received' | 'sent' | 'transfer';
  amount: number;
  description: string;
  date: string;
  time?: string;
  status: 'completed' | 'pending' | 'failed';
  category?: 'transfer' | 'income' | 'expense' | 'refund';
  recipient?: string;
  sender?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  email?: string;
}

export interface Account {
  id: string;
  type: string;
  name: string;
  balance: number;
  accountNumber: string;
  institution: string;
  color?: string;
}

export interface Card {
  id: string;
  type: string;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  brand: string;
  isDefault: boolean;
  color?: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'bank' | 'card' | 'wallet' | 'mobile' | 'cash';
  icon: string;
  fee?: number;
}