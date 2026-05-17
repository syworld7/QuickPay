import axios from 'axios';
import type { PaymentFormData, PaymentInitiateResponse } from '../types';
import { generatePaymentHash } from '../utils/crypto';
import { generateOrderId } from '../utils/order';
import { API_BASE_URL, throwApiError } from './client';

/** Request body shape expected by POST /initiate-payment */
interface InitiatePaymentPayload {
  orderId: string;
  cardHolderName: string;
  email: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cardCVC: string;
  amount: number;
  currency: string;
  country: string;
  address: string;
  phone: string;
}

export async function initiatePayment(
  formData: PaymentFormData
): Promise<PaymentInitiateResponse> {
  try {
    const hash = await generatePaymentHash(formData.cardNumber, formData.email);

    const payload: InitiatePaymentPayload = {
      orderId: generateOrderId(),
      cardHolderName: formData.cardHolderName,
      email: formData.email,
      cardNumber: formData.cardNumber.replace(/\D/g, ''),
      expiryMonth: formData.expiryMonth,
      expiryYear: formData.expiryYear,
      cardCVC: formData.cvv,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      country: formData.country,
      address: formData.address,
      phone: formData.phone ?? '',
    };

    const response = await axios.post<Record<string, unknown>>(
      `${API_BASE_URL}/initiate-payment`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Hash: hash,
        },
      }
    );

    const data = response?.data;

    const redirectUrl =
      typeof data.redirect_url === 'string' && data.redirect_url.length > 0
        ? data.redirect_url
        : '';

    return {
      success: Boolean(data.success ?? true),
      message: typeof data.message === 'string' ? data.message : undefined,
      redirection_url: redirectUrl,
      transaction_id:
        (typeof data.transaction_id === 'string' ? data.transaction_id : undefined) ??
        (typeof data.transactionId === 'string' ? data.transactionId : undefined),
    };
  } catch (error) {
    throwApiError(error, 'Payment initiation failed');
  }
}
