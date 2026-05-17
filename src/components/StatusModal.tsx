import type { PaymentStatus } from '../types';
import { modalOverlayClass } from '../utils/formStyles';

interface StatusModalProps {
  status: PaymentStatus;
  message?: string;
  onClose: () => void;
}

export default function StatusModal({ status, message, onClose }: StatusModalProps) {
  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'Success':
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully.',
          icon: '✓',
          bgColor: 'bg-green-500',
          textColor: 'text-green-500',
        };
      case 'Failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          icon: '✕',
          bgColor: 'bg-red-500',
          textColor: 'text-red-500',
        };
      case 'Pending':
        return {
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please wait.',
          icon: '⏳',
          bgColor: 'bg-yellow-500',
          textColor: 'text-yellow-500',
        };
      default:
        return {
          title: 'Unknown Status',
          message: 'Payment status is unknown.',
          icon: '?',
          bgColor: 'bg-gray-500',
          textColor: 'text-gray-500',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={modalOverlayClass}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all animate-scale-in border border-gray-100">
        {/* Icon */}
        <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <span className="text-white text-4xl font-bold">{config.icon}</span>
        </div>

        {/* Title */}
        <h2 className={`text-2xl font-bold text-center mb-3 ${config.textColor}`}>
          {config.title}
        </h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-8">
          {message || config.message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className={`w-full ${config.bgColor} text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
        >
          Close
        </button>
      </div>
    </div>
  );
}
