import type { Transaction } from '../types';

export interface DashboardMetrics {
  totalTransactions: number;
  totalSuccessVolume: number;
  totalSuccessCount: number;
  totalFailedCount: number;
}

export function computeMetrics(transactions: Transaction[]): DashboardMetrics {
  const success = transactions?.filter((t) => t.status === 'Success');
  const failedOrPending = transactions.filter(
    (t) => t.status === 'Failed' || t.status === 'Pending'
  );

  return {
    totalTransactions: transactions.length,
    totalSuccessVolume: success?.reduce((sum, t) => sum + t.amount, 0),
    totalSuccessCount: success.length,
    totalFailedCount: failedOrPending.length,
  };
}

export function groupByStatus(transactions: Transaction[]) {
  const counts = { Success: 0, Failed: 0, Pending: 0 };
  for (const t of transactions) {
    counts[t.status]++;
  }
  return counts;
}

export function groupVolumeByDate(transactions: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of transactions) {
    const date = t.created_at.slice(0, 10);
    const prev = map.get(date) ?? 0;
    map.set(date, prev + (t.status === 'Success' ? t.amount : 0));
  }
  const sorted = [...map.entries()]?.sort(([a], [b]) => a.localeCompare(b));
  return {
    labels: sorted?.map(([d]) => d),
    values: sorted?.map(([, v]) => v),
  };
}

export function groupByCurrency(transactions: Transaction[]) {
  const map = new Map<string, number>();
  for (const t of transactions) {
    map.set(t.currency, (map?.get(t.currency) ?? 0) + 1);
  }
  return {
    labels: [...map.keys()],
    values: [...map.values()],
  };
}
