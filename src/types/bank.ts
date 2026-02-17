// Bank Data Types for phantom_bank

export interface BankConfig {
  currency: string;
  enableLoans: boolean;
  enableInvoices: boolean;
  enableBusiness: boolean;
  enableCards: boolean;
  enableSocietyAccounts: boolean;
  enableSharedAccounts: boolean;
  enableSavingsAccounts: boolean;
  transferTaxPercent: number;
  maxTransfer: number;
}

export interface Loan {
  id: number;
  amount: number;
  interest: number;
  total_to_pay: number;
  remaining_balance: number;
  due_date: number;
  status: string;
  created_at: string;
  days_remaining: number;
  next_payment: number;
}

export interface Invoice {
  id: number;
  sender: string;
  receiver: string;
  amount: number;
  reason: string | null;
  status: string;
  created_at: string;
  expires_at: number | null;
}

export interface Transaction {
  id: number;
  sender: string;
  receiver: string;
  amount: number;
  type: string;
  description: string | null;
  created_at: string;
}

export interface Business {
  business_name: string;
  balance: number;
}

export interface Card {
  id: number;
  identifier: string;
  card_number_masked: string;
  card_number_full?: string; // Optional: full card number (only sent when requested)
  cvv?: string; // Optional: CVV code
  card_number_last4: string;
  card_type: string;
  status: string;
  wrong_pin_count: number;
  expires_at: number;
  created_at: string;
}

export interface Society {
  jobName: string;
  jobLabel: string;
  balance: number;
}

export interface SharedAccount {
  id: number;
  name: string;
  balance: number;
  role: string;
}

export interface Savings {
  balance: number;
  last_interest_at: number;
  total_interest_earned: number;
  accrued_since_last: number;
  interest_rate: number;
  frequency: string;
  period_seconds: number;
  next_interest_at: number;
}

export interface SharedAccountMember {
  identifier: string;
  role: string;
}

export interface BankOpenData {
  identifier: string;
  playerName: string | null;
  iban: string;
  balance: number;
  cash: number;
  creditScore: number;
  creditScoreLabel: string | null;
  loans: Loan[];
  invoices: Invoice[];
  transactions: Transaction[];
  businesses: Business[];
  cards: Card[];
  society: Society | null;
  sharedAccounts: SharedAccount[];
  savings: Savings | null;
  isAtm: boolean;
  config: BankConfig;
}

export interface NUIMessage {
  action: string;
  [key: string]: any;
}

export interface CallbackResponse {
  success: boolean;
  message?: string;
  members?: SharedAccountMember[];
}