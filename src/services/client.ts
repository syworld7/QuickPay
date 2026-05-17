import axios from 'axios';

export const API_BASE_URL = 'https://payment-assignment.onrender.com';

export function getAxiosErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message || fallback;
  }
  return fallback;
}

export function throwApiError(error: unknown, fallback: string): never {
  if (axios.isAxiosError(error)) {
    throw new Error(getAxiosErrorMessage(error, fallback));
  }
  throw new Error('An unexpected error occurred');
}
