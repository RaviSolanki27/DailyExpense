export type PaymentMode = "ONLINE" | "CASH" | "OTHER";

export type TransactionType = "INCOME" | "EXPENSE";

export interface BusinessProfile {
  id: string;
  name: string;
  category?: string | null;
  description?: string | null;
  currency: string;
  color: string;
  icon: string;
  isDefault?: boolean;
  createdAt?: string | Date;
  _count?: {
    transactions: number;
    parties: number;
  };
}

export interface Transaction {
  id: string;
  businessId: string;
  type: TransactionType;
  amount: number;
  title: string;
  paymentMode: PaymentMode;
  date: string | Date;
  note?: string | null;
  createdAt?: string | Date;
}

export interface FrequentTag {
  id: string;
  businessId: string;
  label: string;
  usageCount: number;
}

export interface KhataEntry {
  id: string;
  partyId: string;
  type: "GAVE" | "GOT";
  amount: number;
  date: string | Date;
  description?: string | null;
  paymentMode: PaymentMode;
  isSettled?: boolean;
  createdAt?: string | Date;
}

export interface KhataParty {
  id: string;
  businessId: string;
  name: string;
  phone?: string | null;
  notes?: string | null;
  totalGave: number;
  totalGot: number;
  netBalance: number;
  lastEntryDate?: string | Date;
  entries?: KhataEntry[];
}

export interface BusinessStats {
  period: string;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  breakdown: {
    income: { online: number; cash: number; other: number };
    expense: { online: number; cash: number; other: number };
  };
  topExpenseCategories: { name: string; amount: number }[];
  dailyTrend: { date: string; income: number; expense: number }[];
  transactionCount: number;
}

