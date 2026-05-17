import { useEffect, useState } from 'react';
import type { PaymentRedirectResult } from '../types';
import { completePaymentRedirect } from '../services/completePaymentRedirect';

export function useCompletePaymentRedirect(redirectUrl: string | null) {
  const [isLoading, setIsLoading] = useState(Boolean(redirectUrl));
  const [result, setResult] = useState<PaymentRedirectResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!redirectUrl) {
      setIsLoading(false);
      setResult(null);
      setError(null);
      return;
    }

    let active = true;
    setIsLoading(true);
    setResult(null);
    setError(null);

    completePaymentRedirect(redirectUrl)
      .then((res) => {
        if (active) setResult(res);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Payment verification failed'
          );
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [redirectUrl]);

  return { result, error, isLoading };
}
