export function formatPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function buildFullPhone(countryCode: string, localNumber: string): string {
  const digits = getPhoneDigits(localNumber);
  const code = countryCode.startsWith('+') ? countryCode : `+${countryCode}`;
  return `${code} ${formatPhoneInput(digits)}`.trim();
}

export const PHONE_COUNTRY_CODES = [
  { code: '+1', label: 'US +1', id: 'us' },
  { code: '+44', label: 'UK +44', id: 'uk' },
  { code: '+91', label: 'IN +91', id: 'in' },
  { code: '+61', label: 'AU +61', id: 'au' },
  { code: '+1', label: 'CA +1', id: 'ca' },
  { code: '+49', label: 'DE +49', id: 'de' },
  { code: '+33', label: 'FR +33', id: 'fr' },
  { code: '+81', label: 'JP +81', id: 'jp' },
  { code: '+86', label: 'CN +86', id: 'cn' },
  { code: '+55', label: 'BR +55', id: 'br' },
  { code: '+52', label: 'MX +52', id: 'mx' },
  { code: '+34', label: 'ES +34', id: 'es' },
  { code: '+39', label: 'IT +39', id: 'it' },
  { code: '+31', label: 'NL +31', id: 'nl' },
  { code: '+41', label: 'CH +41', id: 'ch' },
] as const;
