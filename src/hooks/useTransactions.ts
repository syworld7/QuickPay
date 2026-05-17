import { useCallback, useState } from 'react';
import type { TransactionsResponse } from '../types';
import { fetchTransactions } from '../services/fetchTransactions';

export function useTransactions() {
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (page: number, limit: number): Promise<TransactionsResponse> => {
      setError(null);
      try {
        return await fetchTransactions(page, limit);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to fetch transactions';
        setError(message);
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { fetchPage, error, clearError, setError };
}
