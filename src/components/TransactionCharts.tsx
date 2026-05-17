import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import type { Transaction } from '../types';
import { groupByStatus, groupVolumeByDate, groupByCurrency } from '../utils/dashboard';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TransactionChartsProps {
  transactions: Transaction[];
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const },
  },
};

export default function TransactionCharts({ transactions }: TransactionChartsProps) {
  const statusCounts = groupByStatus(transactions);
  const volumeData = groupVolumeByDate(transactions);
  const currencyData = groupByCurrency(transactions);

  const statusChartData = {
    labels: ['Success', 'Failed', 'Pending'],
    datasets: [
      {
        data: [statusCounts.Success, statusCounts.Failed, statusCounts.Pending],
        backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        borderWidth: 0,
      },
    ],
  };

  const volumeChartData = {
    labels: volumeData.labels,
    datasets: [
      {
        label: 'Success Volume',
        data: volumeData.values,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const currencyChartData = {
    labels: currencyData.labels,
    datasets: [
      {
        data: currencyData.values,
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#14b8a6',
          '#f97316',
          '#6366f1',
          '#84cc16',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
        <div className="h-64">
          <Doughnut data={statusChartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 lg:col-span-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Over Time</h3>
        <div className="h-64">
          <Line
            data={volumeChartData}
            options={{
              ...chartOptions,
              scales: {
                y: { beginAtZero: true },
              },
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Distribution</h3>
        <div className="h-64">
          <Doughnut data={currencyChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
