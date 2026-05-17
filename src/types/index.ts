// Payment Form Types
export interface PaymentFormData {
  cardHolderName: string;
  email: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  amount: string;
  currency: string;
  country: string;
  address: string;
  phoneCountryCode: string;
  phoneNumber: string;
  phone?: string;
}

// API Response Types
export interface PaymentInitiateResponse {
  success: boolean;
  message?: string;
  redirection_url?: string;
  transaction_id?: string;
}

export interface Transaction {
  order_id: string;
  card_number: string;
  email: string;
  expiry_month: string;
  expiry_year: string;
  card_cvc: string;
  amount: number;
  currency: string;
  status: 'Pending' | 'Success' | 'Failed';
  created_at: string;
}

export interface TransactionsResponse {
  success: boolean;
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export type PaymentStatus = 'Success' | 'Failed' | 'Pending' | null;

export interface PaymentRedirectResult {
  status: Exclude<PaymentStatus, null>;
  message: string;
}
