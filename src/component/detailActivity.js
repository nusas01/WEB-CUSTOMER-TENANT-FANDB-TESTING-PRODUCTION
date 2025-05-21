import { useNavigate, useLocation } from "react-router-dom";
import "../style/activity.css"
import ImagePaymentMethod from "../helper/imagePaymentMethod";
import { Calendar, Clock } from 'lucide-react';

export default function DetailActivity() {
    const location = useLocation();
    const navigate = useNavigate();
    const detailOrder = location.state?.detailOrder || {};

    const handleNavigate = () => {
        navigate("/activity", {state: "history"})
    }

    console.log(detailOrder.items)
    console.log()
    
    return (
        <div className="max-w-[600px] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center" onClick={() => handleNavigate()}>
                <div className="flex items-center space-x-2 cursor-pointer group">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-lg">Kembali</span>
                </div>
                <span className={`inline-block px-5  py-1  rounded text-sm italic font-medium bg-green-100 text-green-500'`}>
                    {detailOrder.statusPembayaran}
                </span>
            </div>
            
            <div className="mt-4">
              
              <h1 className="text-xl font-bold">Detail Transaksi</h1>
            </div>
          </div>
      
          {/* Transaction Meta */}
          <div className="px-6  bg-gray-50 my-1">
            <div className=" flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>
                    {new Date(detailOrder.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                    })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>
                    {new Date(detailOrder.created_at).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    })}
                </span>
              </div>
              {detailOrder.methodPembayaran === "QR" 
                  ? ImagePaymentMethod(detailOrder.channel_code, '40px', '40px')
                  : ImagePaymentMethod(detailOrder.channel_code)
                }
            </div>
          </div>
      
          {/* Items List */}
          <div className="p-6 space-y-2 bg-white">
            {detailOrder.items.map((item, index) => (
              <div key={index} className="flex items-start space-x-4 group hover:bg-gray-50 py-4 rounded-lg transition-colors">
                <img 
                  src={`/image/${item.product.image}`} 
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  {item.product.desc && (
                    <p className="text-sm  mt-1">{item.product.desc}</p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <p>
                      Rp {item.product.price.toLocaleString('id-ID')}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span >x{item.quantity}</span>
                      <span className="font-medium">
                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
      
          {/* Order Summary */}
          <div className="p-6 space-y-4 bg-gray-50">
            <div className="flex justify-between">
              <span>Subtotal ({detailOrder.items.reduce((acc, item) => acc + item.quantity, 0)} item)</span>
              <span className="font-medium">Rp {detailOrder.subTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Pajak</span>
              <span>Rp {detailOrder.tax.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan</span>
              <span>Rp {detailOrder.fee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">Rp {detailOrder.amount.toLocaleString('id-ID')}</span>
            </div>
          </div>
      
          {/* Notes & Re-Order */}
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <p className="font-mono text-sm mb-2 text-gray-500">ID: {detailOrder.id}</p>
              <label className="text-sm font-medium">Catatan:</label>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
                {detailOrder.notes || "Tidak ada catatan"}
              </div>
            </div>
            
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95">
              Pesan Ulang
            </button>
          </div>
        </div>
      )
}