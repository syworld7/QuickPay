import { z } from 'zod';
import { validateCardNumber } from './cardNumberValidation';
import { getPhoneDigits } from './phone';

export const paymentFormSchema = z
  .object({
    cardHolderName: z
      .string()
      .min(1, 'Please enter the cardholder name')
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name is too long')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Please enter a valid name'),

    email: z
      .string()
      .min(1, 'Please enter your email address')
      .email('Please enter a valid email address'),

    cardNumber: z.string().min(1, 'Please enter your card number'),

    expiryMonth: z.string().min(1, 'Please select expiry month'),

    expiryYear: z.string().min(1, 'Please select expiry year'),

    cvv: z
      .string()
      .min(1, 'Please enter your security code')
      .regex(/^\d{3,4}$/, 'Please enter a valid security code'),

    amount: z
      .string()
      .min(1, 'Please enter the payment amount')
      .regex(/^\d+(\.\d{1,2})?$/, 'Please enter a valid amount')
      .refine((val) => parseFloat(val) > 0, {
        message: 'Amount must be greater than zero',
      })
      .refine((val) => parseFloat(val) <= 1000000, {
        message: 'Amount exceeds the maximum allowed',
      }),

    currency: z.string().min(3, 'Please select a currency'),

    country: z
      .string()
      .min(2, 'Please select your country')
      .max(2, 'Please select your country'),

    address: z
      .string()
      .min(1, 'Please enter your billing address')
      .min(10, 'Address must be at least 10 characters')
      .max(200, 'Address is too long'),

    phoneCountryCode: z.string().min(1, 'Please select a country code'),

    phoneNumber: z
      .string()
      .min(1, 'Please enter your phone number')
      .refine((val) => getPhoneDigits(val).length === 10, {
        message: 'Please enter a valid 10-digit phone number',
      }),

    phone: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const digits = data.cardNumber.replace(/\D/g, '');

    if (digits.length < 13) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please enter your complete card number',
        path: ['cardNumber'],
      });
      return;
    }

    if (digits.length > 19) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please enter a valid card number',
        path: ['cardNumber'],
      });
      return;
    }

    if (!validateCardNumber(digits)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please enter a valid card number',
        path: ['cardNumber'],
      });
    }

    if (!/^(0[1-9]|1[0-2])$/.test(data.expiryMonth)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please select a valid expiry month',
        path: ['expiryMonth'],
      });
    }

    if (!/^\d{4}$/.test(data.expiryYear)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Please select a valid expiry year',
        path: ['expiryYear'],
      });
    } else {
      const year = parseInt(data.expiryYear, 10);
      const currentYear = new Date().getFullYear();
      if (year < currentYear || year > currentYear + 20) {
        ctx.addIssue({
          code: 'custom',
          message: 'This card appears to be expired',
          path: ['expiryYear'],
        });
      }
    }
  });

export type PaymentFormSchema = z.infer<typeof paymentFormSchema>;

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
];

export const COUNTRIES = [
  { code: 'US', label: 'United States' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'CA', label: 'Canada' },
  { code: 'AU', label: 'Australia' },
  { code: 'IN', label: 'India' },
  { code: 'DE', label: 'Germany' },
  { code: 'FR', label: 'France' },
  { code: 'JP', label: 'Japan' },
  { code: 'CN', label: 'China' },
  { code: 'BR', label: 'Brazil' },
  { code: 'MX', label: 'Mexico' },
  { code: 'ES', label: 'Spain' },
  { code: 'IT', label: 'Italy' },
  { code: 'NL', label: 'Netherlands' },
  { code: 'CH', label: 'Switzerland' },
];

export const MONTHS = [
  { value: '01', label: '01 - January' },
  { value: '02', label: '02 - February' },
  { value: '03', label: '03 - March' },
  { value: '04', label: '04 - April' },
  { value: '05', label: '05 - May' },
  { value: '06', label: '06 - June' },
  { value: '07', label: '07 - July' },
  { value: '08', label: '08 - August' },
  { value: '09', label: '09 - September' },
  { value: '10', label: '10 - October' },
  { value: '11', label: '11 - November' },
  { value: '12', label: '12 - December' },
];

export const generateYearOptions = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let i = 0; i < 21; i++) {
    years.push((currentYear + i).toString());
  }
  return years;
};
