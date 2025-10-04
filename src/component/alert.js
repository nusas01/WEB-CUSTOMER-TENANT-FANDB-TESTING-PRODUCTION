import React, { useState, useEffect, forwardRef } from "react"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  QrCode, 
  Users, 
  AlertCircle, 
  Ban, 
  X, 
  RefreshCw, 
  ShoppingCart, 
  Banknote, 
  CreditCard,
  UtensilsCrossed, 
  ShoppingBag, 
  RotateCcw, 
} from "lucide-react"
import { useRef } from "react"
import  ImagePaymentMethod  from '../helper/imagePaymentMethod'
import { useDispatch } from "react-redux"
import { createPortal } from "react-dom";

export const OrderTypeInvalidAlert = ({ onClose }) => {
  const modalRef = useRef(null)

  // Detect click outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.body.style.overflow = 'hidden' // Prevent background scroll

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[99999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white flex flex-col items-center rounded-3xl p-8 w-full max-w-sm shadow-2xl transform animate-in fade-in-0 zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="relative">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <X className="w-3 h-3 text-white" />
            </div>
          </div>
          <h2 className="text-red-600 text-xl font-bold text-center leading-tight">
            Invalid QR Code for Order Type 
          </h2>
        </div>

        {/* Body */}
        <div className="mb-8 text-sm text-center text-gray-700 space-y-4">
          <p className="font-medium text-gray-800">Pastikan Anda scan:</p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-green-800">Barcode meja</p>
                <p className="text-xs text-green-600">untuk Dine-In</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-blue-800">Barcode kasir</p>
                <p className="text-xs text-blue-600">untuk Take Away</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <RotateCcw className="w-4 h-4" />
              <p className="text-sm italic">
                Untuk melakukan pemesanan Wajib scan QR Code, jika tidak klik tombol di bawah ini.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
          >
            <CheckCircle className="w-5 h-5" />
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export const ProductUnavailableModal = ({ onClose, colorsType, fetchData, resetData }) => {
  const dispatch = useDispatch()
  const modalRef = useRef(null)

  // Detect click outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.body.style.overflow = 'hidden' // Prevent background scroll

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  // Handle escape key
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [onClose])

  const handleRefresh = () => {
    dispatch(fetchData())
    resetData()
    onClose()
  }

  const primaryColor = colorsType === 'internal' 
    ? 'bg-gray-800 hover:bg-gray-700 focus:ring-gray-500' 
    : 'bg-green-500 hover:bg-green-600 focus:ring-green-400'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-sm mx-4 sm:max-w-lg md:max-w-xl p-6 sm:p-8 rounded-2xl shadow-2xl relative transition-all animate-in zoom-in-95 duration-300"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Tutup modal"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle size={32} className="text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
          Produk Tidak Tersedia
        </h2>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-gray-700 mb-3 leading-relaxed">
            Maaf, produk yang Anda pilih saat ini sedang tidak tersedia.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Hal ini mungkin disebabkan karena data cache yang belum terupdate atau 
            ada perubahan stok di server. Silakan click tombol refersh di bawah ini.
          </p>
        </div>

        {/* Action buttons */}
       <div className="flex justify-center">
        <button
          onClick={() => handleRefresh()}
          className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-md hover:transition-colors text-md text-white
            ${colorsType === 'internal' ? 'bg-gray-800 hover:bg-gray-800' : 'bg-green-600 hover:bg-green-700'}
          `}
        >
          <RefreshCw className="animate-spin-slow" size={20} />
          <span>Refresh</span>
        </button>
      </div>
      </div>
    </div>
  )
}

export const ErrorAlert = ({ title = "OOPS!", message, onClose }) => {
  const alertRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div className="absolute top-10 w-full flex justify-center px-4 z-50">
      <div
        ref={alertRef}
        className="bg-white border-t-4 border-red-500 rounded-lg shadow-lg p-6 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-4">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-red-600">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{message}</p>
      </div>
    </div>
  )
}

export const SuccessAlert = ({ title = "SUCCESS!", message, onClose }) => {
  const alertRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  return (
    <div className="absolute top-10 w-full flex justify-center px-4 z-50">
      <div
        ref={alertRef}
        className="bg-white border-t-4 border-green-500 rounded-lg shadow-lg p-6 max-w-md w-full text-center"
      >
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-green-600">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{message}</p>
      </div>
    </div>
  )
}

export const ConfirmationModal = ({
  onClose,
  title,
  message, 
  type,
}) => {
  let icon;
  let buttonColorClass;

  if (type === "success") {
    icon = <CheckCircle className="h-16 w-16 text-green-500" />;
    buttonColorClass = "bg-green-600 hover:bg-green-700 focus:ring-green-500";
  } else if (type === "pending") {
    icon = <Clock className="h-16 w-16 text-yellow-500" />;
    buttonColorClass = "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500";
  } else {
    icon = <XCircle className="h-16 w-16 text-red-500" />;
    buttonColorClass = "bg-red-600 hover:bg-red-700 focus:ring-red-500";
  }

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center bg-black bg-opacity-50 px-4 animate-fadeIn">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-2xl transform scale-95 animate-scaleUp">
        <div className="flex justify-center mb-4">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <button
          onClick={onClose}
          className={`w-full px-6 py-3 text-white font-semibold rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-75 ${buttonColorClass}`}
        >
          Oke
        </button>
      </div>
    </div>
  )
}

  
export const CashPaymentModal = forwardRef(({ data, setData, onClose, onBayar, ref }) => {
  const [uangDiterima, setUangDiterima] = useState("");
  const [kembalian, setKembalian] = useState(0);

  const formatRupiah = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseRupiah = (formattedValue) => {
    return parseInt(formattedValue.replace(/\./g, "")) || 0;
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value
    const formattedValue = formatRupiah(rawValue)
    setUangDiterima(formattedValue)
    const num = parseRupiah(formattedValue)
    setData((prev) => ({
      ...prev,
      money_received: num, 
    }))
  }

  useEffect(() => {
    const num = parseRupiah(uangDiterima)
    setKembalian(num - data.amount_price)
  }, [uangDiterima, data.amount_price])


  const handleConfirmBayar = () => {
    if (kembalian < 0 || uangDiterima === "") return;

    onBayar()
    setUangDiterima("")
  };

  return (
    <div ref={ref} className="fixed inset-0 z-80 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Pembayaran Tunai</h2>
        <p className="text-sm text-gray-300 mb-4">
          Total pembayaran:{" "}
          <span className="font-bold text-green-400">
            Rp {data.amount_price.toLocaleString("id-ID")}
          </span>
        </p>

        <label className="block text-sm text-white mb-1">Uang Diterima</label>
        <input
          type="text"
          value={uangDiterima}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-white border border-gray-600 text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          placeholder="Masukkan jumlah uang dari pelanggan"
        />

        {uangDiterima && (
          <p className={`mb-4 text-sm ${kembalian < 0 ? "text-red-400" : "text-blue-300"}`}>
            {kembalian < 0
              ? "Uang tidak mencukupi"
              : `Kembalian: Rp ${kembalian.toLocaleString("id-ID")}`}
          </p>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 bg-white rounded-md"
          >
            Batal
          </button>
          <button
            disabled={kembalian < 0 || uangDiterima === ""}
            onClick={handleConfirmBayar} // **Now calls the new function**
            className={`px-4 py-2 text-sm font-semibold rounded-md transition ${
              kembalian < 0 || uangDiterima === ""
                ? "bg-green-700 opacity-50 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Bayar
          </button>
        </div>
      </div>
    </div>
  );
})


export const SuccessAlertPaymentCash = ({ kembalian, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-green-50 text-center rounded-lg p-6 w-full max-w-md shadow-inner border border-green-300">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-2" />
        <p className="text-lg font-bold text-green-700">Pembayaran Berhasil!</p>
        <p className="text-sm text-green-600 mt-1">
          Kembalian:{" "}
          <span className="text-green-700 font-semibold">
            Rp {kembalian.toLocaleString("id-ID")}
          </span>
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}

export const PaymentSuccessNonCashCashier = forwardRef(({
  data,
  message,
  subMessage,
  onClose,
}, ref) => {
  return (
    <div ref={ref} className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 md:p-8 relative transform transition-all duration-300 scale-100 opacity-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
          aria-label="Tutup modal"
        >
          <X size={24} />
        </button>

        {/* Gambar metode pembayaran, center dan beri ukuran yang pas */}
        {data.channel_code && (
          <div className="flex justify-center mb-4">
            <ImagePaymentMethod key={data.channel_code}/>
          </div>
        )}

        <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">{message}</h3>

        <div className="space-y-2 text-center mb-4">
          {data.email && (
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Email:</span> {data.email}
            </p>
          )}
        </div>

        <div className="p-6 border border-green-300 rounded-lg bg-green-50 shadow-inner flex flex-col items-center">
          <CheckCircle size={48} className="text-green-500 mb-2" />
          <p className="text-lg font-bold text-green-700">Pembayaran Berhasil!</p>
          <p className="text-sm text-green-600 mt-1">{subMessage}</p>
          {data.amount_price !== undefined && (
            <p className="mt-4 text-base font-semibold text-gray-700">
              Total: Rp {data.amount_price.toLocaleString("id-ID")}
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
})


export const DeleteConfirmationModal = ({ onConfirm, onCancel, colorsType }) => {
  const confirmButtonClass =
    colorsType === 'internal'
      ? 'bg-gray-800 hover:bg-gray-900'
      : 'bg-green-600 hover:bg-green-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-md w-full max-w-md px-4 py-6 sm:px-6">
        <p className="text-center text-gray-800 mb-6">
          Anda yakin ingin menghapus produk ini?
        </p>
        <div className="flex justify-center space-x-6">
          <button
            onClick={onConfirm}
            className={`${confirmButtonClass} text-white px-6 py-2 rounded transition`}
          >
            Ya
          </button>
          <button
            onClick={onCancel}
            className="border border-gray-400 text-gray-500 px-5 py-2 rounded hover:bg-gray-100 transition"
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
};


export const VoidJournalConfirmationModal = ({
  onConfirm,
  onCancel,
  journalName = 'Jurnal Umum',
}) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <AlertTriangle className="text-yellow-500 w-10 h-10" />
          <h2 className="text-xl font-semibold text-gray-800">
            Void {journalName}?
          </h2>
          <p className="text-gray-600 text-sm">
            Apakah Anda yakin ingin melakukan <strong>void</strong> pada{" "}
            <span className="text-gray-800">{journalName}</span>? Data akan tetap disimpan namun tidak akan dianggap aktif.
          </p>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-600 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Ban className="w-4 h-4" />
            Void Jurnal
          </button>
        </div>
      </div>
    </div>
  );
};

export const DeleteConfirmationModalTable = ({ submit, onClose }) => {
  const modalRef = useRef(null);

  // Tutup modal saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-100 bg-black bg-opacity-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Konfirmasi Penghapusan Meja
        </h2>
        <p className="text-gray-700 text-sm mb-6">
          Jika Anda menghapus meja ini, maka QR code yang sebelumnya telah
          dibuat tidak akan berlaku lagi. Jika Anda membuat meja baru dengan
          nomor yang sama, QR code yang dihasilkan akan berbeda dari sebelumnya.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export const InvalidAmountModal = ({ onClose, colorsType = "internal", fetchData, resetChart }) => {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleRefreshBrowser = () => {
    dispatch(fetchData());
    resetChart();
    onClose()
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-in fade-in-0 zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Ketidaksesuaian Data
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <ShoppingCart className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Total Belanja Tidak Sesuai
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Terjadi ketidaksesuaian antara total belanja yang ditampilkan dengan data yang tersimpan di server. Hal ini mungkin disebabkan oleh:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Sinkronisasi data yang tertunda</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Perubahan harga produk</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <span>Cache browser yang usang</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Solusi Recommended</h4>
                <p className="text-sm text-blue-800">
                  Klik button refresh dibawah ini atau Tutup browser sepenuhnya kemudian buka kembali untuk memastikan data tersinkronisasi dengan benar.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-gray-50 rounded-b-2xl flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between w-full">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-center"
          >
            Tutup
          </button>

          <button
            onClick={handleRefreshBrowser}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 ${
              colorsType === 'customer'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-800 hover:bg-gray-900'
            } text-white rounded-lg transition-colors font-medium`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
  

export const CashPaymentUnavailableModal = ({ onClose, colorsType = "internal", fetchData, resetChart }) => {
  const modalRef = useRef(null);
  const dispatch = useDispatch();

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleRefreshData = () => {
    dispatch(fetchData());
    resetChart();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      <div 
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 animate-in fade-in-0 zoom-in-95"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Pembayaran Cash Tidak Tersedia
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Banknote className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Metode Pembayaran Cash Tidak Aktif
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Mohon maaf, saat ini metode pembayaran cash sedang tidak tersedia atau telah dinonaktifkan sementara. Hal ini dapat disebabkan oleh:
              </p>
            </div>
          </div>

          {/* Alternative Payment Methods */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-3 h-3 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-900 mb-1">Metode Pembayaran Alternatif</h4>
                <p className="text-sm text-green-800">
                  Silakan gunakan metode pembayaran digital lainnya seperti kartu debit/kredit, e-wallet, atau transfer bank yang masih tersedia.
                </p>
              </div>
            </div>
          </div>

          {/* Solution */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                <RefreshCw className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Periksa Status Terbaru</h4>
                <p className="text-sm text-blue-800">
                  Klik tombol refresh di bawah ini untuk memperbarui data dan memeriksa apakah pembayaran cash sudah kembali tersedia.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 bg-gray-50 rounded-b-2xl flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-0 sm:justify-between w-full">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors font-medium text-center"
          >
            Tutup
          </button>

          <button
            onClick={handleRefreshData}
            className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 ${
              colorsType === 'customer'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-800 hover:bg-gray-900'
            } text-white rounded-lg transition-colors font-medium`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Periksa Ulang</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const Toast = ({ message, type, onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const toastRef = useRef(null);

  // Handle auto close after duration
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50);

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toastRef.current && !toastRef.current.contains(event.target)) {
        setIsLeaving(true);
        setTimeout(onClose, 300);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300);
  };

  const getStyles = () => {
    const baseStyles = "backdrop-blur-lg border shadow-2xl";

    if (type === "success") {
      return `${baseStyles} bg-emerald-500/90 border-emerald-400/50 text-white`;
    } else {
      return `${baseStyles} bg-red-500/90 border-red-400/50 text-white`;
    }
  };

  const getIcon = () => {
    return type === "success"
      ? <CheckCircle className="w-5 h-5 flex-shrink-0" />
      : <XCircle className="w-5 h-5 flex-shrink-0" />;
  };

  return (
    <div
      ref={toastRef}
      className={`
        relative mx-auto w-auto h-auto p-4 mt-2 rounded-2xl flex items-center gap-3 min-w-80 max-w-md
        transition-all duration-300 ease-out
        ${getStyles()}
        ${isVisible && !isLeaving ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
      `}
    >
      {getIcon()}

      <div className="flex-1">
        <p className="font-medium text-sm leading-relaxed">{message}</p>
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
        aria-label="Close notification"
      >
        <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
      </button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden">
        <div
          className="h-full bg-white/40 rounded-b-2xl transition-all ease-linear"
          style={{
            width: isLeaving ? "0%" : "100%",
            transitionDuration: isLeaving ? "300ms" : `${duration}ms`
          }}
        />
      </div>
    </div>
  );
};

export const ToastPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted ? createPortal(children, document.body) : null;
};

export const QRErrorModal = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-y-auto overflow-hidden animate-fade-in">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-center w-16 h-16 bg-opacity-20 rounded-full mb-4 mx-auto backdrop-blur-sm">
              <AlertTriangle className="w-20 h-20 text-red" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">QR Code Tidak Valid</h2>
            <p className="text-red-100 text-center text-sm">Kode QR meja sudah tidak berlaku</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* QR Icon with animation */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                <QrCode className="w-10 h-10 text-gray-400" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">✕</span>
              </div>
            </div>
          </div>

          {/* Main message */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Maaf, QR Code meja ini sudah tidak aktif
            </h3>
            <p className="text-gray-600 leading-relaxed">
              QR Code yang Anda scan mungkin sudah kadaluarsa atau tidak valid. 
              Hal ini bisa terjadi karena pergantian sesi atau pembaruan sistem.
            </p>
          </div>

          {/* Action instruction */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-[#00a650]">
                  <Users className="w-5 h-5 text-[#00a650]" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Yang perlu Anda lakukan:</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Silakan hubungi <span className="font-semibold text-[#00a650]">staf</span> terdekat 
                  untuk mendapatkan QR Code meja yang baru dan aktif.
                </p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Terima kasih atas pengertian Anda
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

