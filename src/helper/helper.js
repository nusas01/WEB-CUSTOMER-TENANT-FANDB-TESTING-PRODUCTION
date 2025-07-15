import {Database, RefreshCw} from 'lucide-react'

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

export const EmptyState = ({ title, description, onRetry }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <Database className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>

    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
      >
        <RefreshCw className="w-4 h-4" />
        Coba Lagi
      </button>
    )}
  </div>
);
