import axios from 'axios';
import type { TransactionsResponse } from '../types';
import { mapTransactionResponse } from '../utils/transactions';
import { API_BASE_URL, throwApiError } from './client';

export async function fetchTransactions(
  page: number = 1,
  limit: number = 100
): Promise<TransactionsResponse> {
  try {
    const response = await axios.get<{
      data: Record<string, unknown>[];
      total?: number;
      page?: number;
      limit?: number;
    }>(`${API_BASE_URL}/transactions`, {
      params: { page, limit },
    });

    return {
      success: true,
      data: mapTransactionResponse(
        (response.data.data ?? []) as Parameters<typeof mapTransactionResponse>[0]
      ),
      total: response.data.total ?? 0,
      page: response.data.page ?? page,
      limit: response.data.limit ?? limit,
    };
  } catch (error) {
    throwApiError(error, 'Failed to fetch transactions');
  }
}
