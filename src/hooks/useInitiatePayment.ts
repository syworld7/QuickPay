import { useCallback, useState } from 'react';
import type { PaymentFormData, PaymentInitiateResponse } from '../types';
import { initiatePayment } from '../services/initiatePayment';

export function useInitiatePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiate = useCallback(
    async (formData: PaymentFormData): Promise<PaymentInitiateResponse> => {
      setIsLoading(true);
      setError(null);
      try {
        return await initiatePayment(formData);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Payment initiation failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return { initiate, isLoading, error, reset };
}
