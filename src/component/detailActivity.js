import { useNavigate, useLocation } from "react-router-dom";
import "../style/activity.css"
import ImagePaymentMethod from "../helper/imagePaymentMethod";
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

export default function DetailActivity() {
    const location = useLocation();
    const navigate = useNavigate();
    const detailOrder = location.state?.detailOrder || {};

    const handleNavigate = () => {
        navigate("/activity", {state: "history"})
    }

    return (
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
                  {detailOrder.statusPembayaran}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Detail Transaksi</h1>
              <p className="text-gray-600 text-sm">Rincian pesanan dan pembayaran</p>
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
                    {new Date(detailOrder.created_at).toLocaleDateString('id-ID', {
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
                    {new Date(detailOrder.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <p className="text-xs text-gray-500">Pembayaran</p>
                {detailOrder.methodPembayaran === "QR" 
                  ? ImagePaymentMethod(detailOrder.channel_code, '40px', '40px')
                  : ImagePaymentMethod(detailOrder.channel_code)
                }
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6 space-y-1 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Pesanan</h3>
            {detailOrder.items.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 group hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 p-4 rounded-xl transition-all duration-200 border border-transparent hover:border-green-100">
                <div className="relative">
                  <img 
                    src={`/image/${item.product.image}`} 
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
                  Subtotal ({detailOrder.items.reduce((acc, item) => acc + item.quantity, 0)} item)
                </span>
                <span className="font-medium text-gray-800">
                  Rp {detailOrder.subTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Biaya Pajak</span>
                <span className="text-gray-800">Rp {detailOrder.tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Biaya Layanan</span>
                <span className="text-gray-800">Rp {detailOrder.fee.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">Total Pembayaran</span>
                  <span className="text-xl font-bold text-green-600 bg-green-50 px-4 py-2 rounded-xl border border-green-200">
                    Rp {detailOrder.amount.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes & Re-Order */}
          <div className="p-6 space-y-6 bg-white">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  ID: {detailOrder.id}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan Pesanan:
                </label>
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 text-gray-700 leading-relaxed">
                  {detailOrder.notes || "Tidak ada catatan khusus"}
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-98 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group">
              <span>Pesan Ulang</span>
              <div className="w-5 h-5 bg-white bg-opacity-20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </div>
            </button>
          </div>
        </div>
      )
}