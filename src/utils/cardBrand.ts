export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'rupay' | null;

export function detectCardBrand(cardNumber: string): CardBrand {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 1) return null;

  if (/^3[47]/.test(digits)) return 'amex';
  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^(508[5-9]|608|60[0-9]|65[0-9]{2}|81|82)/.test(digits)) return 'rupay';
  if (/^6(?:011|5)/.test(digits)) return 'discover';

  return null;
}
