
export function validateCardNumber(cardNumber: string): boolean {
  // Remove all non-digit characters
  const digits = cardNumber.replace(/\D/g, '');
  
  // Card number must be at least 13 digits
  if (digits.length < 13) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  // Loop through values starting from the rightmost digit
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

import { detectCardBrand, type CardBrand } from './cardBrand';

/** @deprecated Use detectCardBrand */
export function getCardType(cardNumber: string): string {
  const brand = detectCardBrand(cardNumber);
  if (!brand) return '';
  return brand.charAt(0).toUpperCase() + brand.slice(1);
}

export type { CardBrand };
export { detectCardBrand };
