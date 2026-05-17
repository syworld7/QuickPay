import type { Transaction } from '../types';

interface TransactionResponse {
  orderId?: string;
  cardNumber?: string;
  email?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardCVC?: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
}

function normalizeStatus(status: string | undefined): Transaction['status'] {
  const s = (status ?? '').toLowerCase();
  if (s === 'success') return 'Success';
  if (s === 'failed') return 'Failed';
  return 'Pending';
}

export function parseTransaction(raw: TransactionResponse): Transaction {
  return {
    order_id: raw.orderId ?? '',
    card_number: raw.cardNumber ?? '',
    email: raw.email ?? '',
    expiry_month: raw.expiryMonth ?? '',
    expiry_year: raw.expiryYear ?? '',
    card_cvc: raw.cardCVC ?? '',
    amount: raw.amount ?? 0,
    currency: raw.currency ?? '',
    status: normalizeStatus(raw.status),
    created_at: raw.createdAt ?? '',
  };
}

export function mapTransactionResponse(items: TransactionResponse[]): Transaction[] {
  return items?.map(parseTransaction) ?? [];
}
