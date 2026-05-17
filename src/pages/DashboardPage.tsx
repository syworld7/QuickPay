import { useCallback, useEffect, useRef, useState } from 'react';
import type { Transaction } from '../types';
import { useTransactions } from '../hooks/useTransactions';
import { computeMetrics } from '../utils/dashboard';
import {
  DEFAULT_TRANSACTIONS_PAGE_SIZE,
  TRANSACTIONS_CHART_LIMIT,
  TRANSACTIONS_PAGE_SIZE_OPTIONS,
} from '../constants/dashboard';
import DashboardSummary from '../components/DashboardSummary';
import TransactionCharts from '../components/TransactionCharts';
import TransactionTable from '../components/TransactionTable';
import Pagination from '../components/Pagination';

export default function DashboardPage() {
  const { fetchPage, error: fetchError, clearError, setError } = useTransactions();
  const [chartTransactions, setChartTransactions] = useState<Transaction[]>([]);
  const [tableTransactions, setTableTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_TRANSACTIONS_PAGE_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const tableSectionRef = useRef<HTMLElement>(null);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const loadChartData = useCallback(async () => {
    const response = await fetchPage(1, TRANSACTIONS_CHART_LIMIT);
    setChartTransactions(response.data ?? []);
  }, [fetchPage]);

  const loadTablePage = useCallback(async (pageNum: number, limit: number) => {
    setTableLoading(true);
    try {
      const response = await fetchPage(pageNum, limit);
      setTableTransactions(response.data ?? []);
      setTotalItems(response.total ?? 0);
      setPage(response.page ?? pageNum);
    } finally {
      setTableLoading(false);
    }
  }, [fetchPage]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await Promise.all([
          loadChartData(),
          loadTablePage(1, DEFAULT_TRANSACTIONS_PAGE_SIZE),
        ]);
        if (!cancelled) clearError();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load transactions');
        }
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [loadChartData, loadTablePage, clearError, setError]);

  const handlePageChange = async (nextPage: number) => {
    clearError();
    try {
      await loadTablePage(nextPage, pageSize);
      tableSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    }
  };

  const handlePageSizeChange = async (nextPageSize: number) => {
    clearError();
    setPageSize(nextPageSize);
    try {
      await loadTablePage(1, nextPageSize);
      tableSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions');
    }
  };

  const metrics = computeMetrics(chartTransactions);

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transaction Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Overview of payment activity and history
        </p>
      </div>

      {initialLoading && (
        <div className="flex flex-col items-center justify-center py-24">
          <svg className="animate-spin h-12 w-12 text-indigo-600 mb-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600">Loading transactions…</p>
        </div>
      )}

      {fetchError && !initialLoading && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 mb-6">
          {fetchError}
        </div>
      )}

      {!initialLoading && !fetchError && (
        <>
          <section className="mb-8">
            <DashboardSummary metrics={metrics} />
          </section>

          <section className="mb-8">
            <TransactionCharts transactions={chartTransactions} />
          </section>

          <section ref={tableSectionRef}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
            <TransactionTable
              transactions={tableTransactions}
              loading={tableLoading}
              footer={
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  pageSizeOptions={TRANSACTIONS_PAGE_SIZE_OPTIONS}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  disabled={tableLoading}
                />
              }
            />
          </section>
        </>
      )}
    </div>
  );
}
