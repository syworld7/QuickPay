export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (digits.length < 10) {
    return cardNumber;
  }

  const first6 = digits.slice(0, 6);
  const last4 = digits.slice(-4);
  const maskedMiddle = '*'.repeat(digits.length - 10);

  return `${first6}${maskedMiddle}${last4}`;
}

export function formatCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : digits;
}


export function maskCVV(_cvv: string): string {
  return '***';
}

export function formatCardInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  const limited = digits.slice(0, 19);
  const groups = limited.match(/.{1,4}/g);
  return groups ? groups.join(' ') : limited;
}

export function formatMaskedDisplay(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 10) return formatCardInput(cardNumber);
  const masked = maskCardNumber(digits);
  const groups = masked.match(/.{1,4}/g);
  return groups ? groups.join(' ') : masked;
}

export function extractCardDigits(cardNumber: string): { first6: string; last4: string } {
  const digits = cardNumber.replace(/\D/g, '');
  return {
    first6: digits.slice(0, 6),
    last4: digits.slice(-4)
  };
}
