import { useNavigate, useLocation } from "react-router-dom";
import "../style/activity.css"
import ImagePaymentMethod from "../helper/imagePaymentMethod";
import { Calendar, Clock, ArrowLeft, RefreshCw, AlertTriangle, Loader2, Store } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux";
import { getDetailTransactionsHistoryCustomerSlice } from "../reducers/get"
import { fetchDetailTransactionHistoryCustomer } from "../actions/get"
import { addItem, addItemCashier } from "../reducers/cartSlice";

// Loading Skeleton Component
const LoadingSkeleton = () => {
  return (
    <div className="max-w-[600px] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
      {/* Header Skeleton */}
      <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
            <div className="w-20 h-6 bg-gray-200 rounded"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-2">
          <div className="w-48 h-8 bg-gray-200 rounded"></div>
          <div className="w-64 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Meta Skeleton */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="w-12 h-3 bg-gray-200 rounded"></div>
              <div className="w-24 h-5 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="w-12 h-3 bg-gray-200 rounded"></div>
              <div className="w-16 h-5 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="w-16 h-3 bg-gray-200 rounded"></div>
            <div className="w-10 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Items Skeleton */}
      <div className="p-6 space-y-1 bg-white">
        <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-start space-x-4 p-4 rounded-xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-3">
              <div className="w-40 h-5 bg-gray-200 rounded"></div>
              <div className="w-full h-4 bg-gray-200 rounded"></div>
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-20 h-6 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Skeleton */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 border-t border-gray-100">
        <div className="w-48 h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex justify-between items-center py-2">
              <div className="w-32 h-4 bg-gray-200 rounded"></div>
              <div className="w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
          <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <div className="w-40 h-6 bg-gray-200 rounded"></div>
              <div className="w-32 h-10 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Skeleton */}
      <div className="p-6 space-y-6 bg-white">
        <div className="space-y-3">
          <div className="w-32 h-6 bg-gray-200 rounded"></div>
          <div className="w-full h-20 bg-gray-200 rounded-xl"></div>
        </div>
        <div className="w-full h-12 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

// Error Component
const ErrorState = ({ onRetry, onBack }) => {
  return (
    <div className="max-w-[600px] h-[100vh] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-100">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={onBack}>
            <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
              <ArrowLeft className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-lg font-medium text-gray-800 group-hover:text-red-600 transition-colors">
              Kembali
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-200">
              Error
            </span>
          </div>
        </div>
        
        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Gagal Memuat Data</h1>
          <p className="text-gray-600 text-sm">Terjadi kesalahan saat mengambil detail transaksi</p>
        </div>
      </div>

      {/* Error Content */}
      <div className="p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          Oops! Tidak Dapat Memuat Data
        </h3>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
          Sepertinya ada masalah dengan koneksi atau server. Silakan coba lagi dalam beberapa saat.
        </p>

        <div className="space-y-3">
          <button 
            onClick={onRetry}
            className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
            <span>Coba Lagi</span>
          </button>
          
          <button 
            onClick={onBack}
            className="w-full bg-gradient-to-r from-gray-100 to-slate-100 hover:from-gray-200 hover:to-slate-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-98 border border-gray-300 hover:border-gray-400"
          >
            Kembali ke Riwayat
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading Overlay Component
const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100 max-w-sm mx-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Memuat Detail Transaksi
          </h3>
          <p className="text-gray-600 text-sm">
            Sedang mengambil data transaksi Anda...
          </p>
        </div>
      </div>
    </div>
  );
};

export default function DetailActivity() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {resetError} = getDetailTransactionsHistoryCustomerSlice.actions;
    const {dataDetailTransactionHistory : detailOrder, error, loadingHistory} = useSelector((state) => state.persisted.getDetailTransactionsHistoryCustomer);
    const id = location.state?.id 

    const handleNavigate = () => {
        dispatch(resetError());
        navigate("/activity", {state: "history"});
    };

    const handleRetry = () => {
        dispatch(resetError());
        dispatch(fetchDetailTransactionHistoryCustomer(id))
        // Add your retry logic here - typically refetch the data
        // dispatch(fetchDetailTransaction(transactionId));
    };

    // Show loading skeleton on initial load
    if (loadingHistory && !detailOrder) {
        return <LoadingSkeleton />;
    }

    // Show error state
    if (error && !detailOrder) {
        return (
            <ErrorState 
                onRetry={handleRetry}
                onBack={handleNavigate}
            />
        );
    }

    // reorder
    const handleReorder = () => {
      if (!detailOrder?.order || detailOrder.order.length === 0) return;

      detailOrder.order.forEach((item) => {
        const newItem = {
          id: item.product.id,
          name: item.product.name,
          harga: item.product.price,
          image: item.product.image,
          notes: item.notes || '',
          amountPrice: item.product.price * item.quantity,
          quantity: item.quantity,
        };

        dispatch(addItem(newItem)); 
      });

      navigate("/cart"); 
    };


    // Show loading overlay when refetching with existing data
    const showLoadingOverlay = loadingHistory && detailOrder;

    // Main content
    return (
        <>
            {showLoadingOverlay && <LoadingOverlay />}
            
            <div className="max-w-[600px] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                    <div className="flex justify-between items-center" onClick={() => handleNavigate()}>
                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="p-2 rounded-full bg-white shadow-sm group-hover:shadow-md transition-all duration-200 group-hover:scale-105">
                                <ArrowLeft className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-lg font-medium text-gray-800 group-hover:text-green-600 transition-colors">
                                Kembali
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700 border border-green-200">
                                {detailOrder?.status_transaction}
                            </span>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Transaksi</h1>
                        <p className="text-gray-600 text-sm">Rincian pesanan dan pembayaran</p>
                    </div>
                </div>

                {/* Store Information */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="flex items-start space-x-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                            <Store className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-semibold text-gray-800">Informasi Toko</h3>
                                {detailOrder?.table && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full border border-blue-200">
                                        Meja {detailOrder.table}
                                    </span>
                                )}
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-1">{detailOrder?.name_store}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {detailOrder?.address}
                            </p>
                            <p className="text-sm text-gray-600">
                                {detailOrder?.city}, {detailOrder?.state}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transaction Meta */}
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Calendar className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tanggal</p>
                                <span className="font-medium text-gray-800">
                                    {new Date(detailOrder?.created_at).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Clock className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Waktu</p>
                                <span className="font-medium text-gray-800">
                                    {new Date(detailOrder?.created_at).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                            <p className="text-xs text-gray-500">Pembayaran</p>
                            {detailOrder?.channel_code === "CASH" ? (
                                <div className="px-4 py-2 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    Tunai
                                </div>
                            ) : detailOrder?.channel_code === "QR" ? (
                                ImagePaymentMethod(detailOrder.channel_code, '40px', '40px')
                            ) : (
                                ImagePaymentMethod(detailOrder.channel_code)
                            )}
                        </div>
                    </div>
                </div>

                {/* Items List */}
                <div className="p-6 space-y-1 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Pesanan</h3>
                    {detailOrder?.order?.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4 group hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-green-100">
                            <div className="relative">
                                <img 
                                    src={`https://assets.nusas.id/${item.product.image}`} 
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded-xl border-2 border-gray-100 group-hover:border-green-200 transition-colors shadow-sm"
                                />
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                                    {item.quantity}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{item.product.name}</h4>
                                {item.product.desc && (
                                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{item.product.desc}</p>
                                )}
                                {item.notes && (
                                    <div className="mb-3 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                                        <p className="text-xs font-semibold text-gray-700 mb-1">Catatan:</p>
                                        <p className="text-sm text-gray-700 leading-relaxed">{item.notes}</p>
                                    </div>
                                )}
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        <span>Rp {item.product.price.toLocaleString('id-ID')}</span>
                                        <span className="mx-2">×</span>
                                        <span>{item.quantity}</span>
                                    </div>
                                    <div className="font-bold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">
                                Subtotal ({detailOrder?.order?.reduce((acc, item) => acc + item.quantity, 0)} item)
                            </span>
                            <span className="font-medium text-gray-800">
                                Rp {detailOrder?.sub_total?.toLocaleString('id-ID')}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Biaya Pajak</span>
                            <span className="text-gray-800">Rp {detailOrder?.tax?.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-gray-600">Biaya Layanan</span>
                            <span className="text-gray-800">Rp {detailOrder?.payment_method_fee?.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xl font-bold text-gray-900">Total Pembayaran</span>
                                <span className="text-xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                                    Rp {detailOrder?.amount_price?.toLocaleString('id-ID')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notes & Re-Order */}
                <div className="p-6 space-y-6 bg-white">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-md font-mono text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                ID: {detailOrder?.id}
                            </p>
                        </div>
                    </div>
                    
                    <button 
                    onClick={() => handleReorder()}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                    >
                        <span>Pesan Ulang</span>
                        <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <ArrowLeft className="w-3 h-3 rotate-180" />
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}