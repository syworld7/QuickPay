import axios from 'axios';
import type { PaymentRedirectResult, PaymentStatus } from '../types';
import { throwApiError } from './client';

function parseRedirectStatus(raw: unknown): PaymentStatus {
  if (typeof raw !== 'string') return 'Pending';
  const s = raw.toLowerCase();
  if (s === 'success') return 'Success';
  if (s === 'failed' || s === 'failure') return 'Failed';
  if (s === 'pending') return 'Pending';
  return 'Pending';
}

/** Dedupe concurrent redirect fetches (React StrictMode / double mount) */
const redirectRequestCache = new Map<string, Promise<PaymentRedirectResult>>();

/**
 * Complete payment by calling the redirect URL (returns JSON, not HTML).
 * The API allows CORS from the browser — no need to open a new tab.
 */
export function completePaymentRedirect(
  redirectUrl: string
): Promise<PaymentRedirectResult> {
  const cached = redirectRequestCache.get(redirectUrl);
  if (cached) return cached;

  const request = (async () => {
    try {
      const response = await axios.get<Record<string, unknown>>(redirectUrl);
      const data = response.data;

      const status = parseRedirectStatus(data.status);
      const message =
        typeof data.message === 'string'
          ? data.message
          : status === 'Success'
            ? 'Transaction processed successfully'
            : status === 'Failed'
              ? 'Transaction could not be completed'
              : 'Payment is being processed';

      return { status: status as Exclude<PaymentStatus, null>, message };
    } catch (error) {
      throwApiError(error, 'Could not complete payment verification');
    } finally {
      // Keep cache briefly so React StrictMode remount reuses the same request
      setTimeout(() => redirectRequestCache.delete(redirectUrl), 3000);
    }
  })();

  redirectRequestCache.set(redirectUrl, request);
  return request;
}
