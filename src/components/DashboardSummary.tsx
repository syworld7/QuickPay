import type { DashboardMetrics } from '../utils/dashboard';

interface DashboardSummaryProps {
  metrics: DashboardMetrics;
}

const cards = [
  {
    key: 'totalTransactions',
    label: 'Total Transactions',
    color: 'from-blue-500 to-blue-600',
    format: (m: DashboardMetrics) => m.totalTransactions.toString(),
  },
  {
    key: 'totalSuccessVolume',
    label: 'Total Success Volume',
    color: 'from-emerald-500 to-emerald-600',
    format: (m: DashboardMetrics) =>
      m.totalSuccessVolume.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    key: 'totalSuccessCount',
    label: 'Total Success Count',
    color: 'from-indigo-500 to-indigo-600',
    format: (m: DashboardMetrics) => m.totalSuccessCount.toString(),
  },
  {
    key: 'totalFailedCount',
    label: 'Failed + Pending',
    color: 'from-rose-500 to-rose-600',
    format: (m: DashboardMetrics) => m.totalFailedCount.toString(),
  },
] as const;

export default function DashboardSummary({ metrics }: DashboardSummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
        >
          <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
          <p
            className={`text-3xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent`}
          >
            {card.format(metrics)}
          </p>
        </div>
      ))}
    </div>
  );
}
