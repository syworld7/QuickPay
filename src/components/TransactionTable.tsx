import type { ReactNode } from 'react';
import type { Transaction } from '../types';
import { maskCardNumber, maskCVV } from '../utils/maskCardNumber';

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
  footer?: ReactNode;
}

function StatusBadge({ status }: { status: Transaction['status'] }) {
  const styles = {
    Success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Failed: 'bg-red-100 text-red-800 border-red-200',
    Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: 8 }).map((__, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 bg-gray-200 rounded w-full max-w-[6rem]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function TransactionTable({
  transactions,
  loading = false,
  footer,
}: TransactionTableProps) {
  if (!loading && transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
        <p className="text-gray-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600" viewBox="0 0 24 24" aria-hidden>
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
          </div>
        )}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                'Order ID',
                'Card Number',
                'Email',
                'Expiry',
                'CVC',
                'Amount',
                'Currency',
                'Status',
              ].map((col) => (
                <th
                  key={col}
                  className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && transactions.length === 0 ? (
              <TableSkeletonRows />
            ) : (
              transactions.map((tx) => (
                <tr key={tx.order_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-mono text-gray-900 whitespace-nowrap">
                    {tx.order_id}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-mono text-gray-700 whitespace-nowrap">
                    {maskCardNumber(tx.card_number)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                    {tx.email}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                    {tx.expiry_month}/{tx.expiry_year}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-mono text-gray-500">
                    {maskCVV(tx.card_cvc)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
                    {tx.amount.toFixed(2)}
                  </td>
                  <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-700">
                    {tx.currency}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}
