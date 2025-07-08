import React, { useState, useEffect, forwardRef } from "react"
import { CheckCircle, XCircle, Clock, AlertTriangle, Ban } from "lucide-react"
import { useRef } from "react"
import { X } from 'lucide-react'
import  ImagePaymentMethod  from '../helper/imagePaymentMethod'

export const OrderTypeInvalidAlert = ({ onClose }) => {
    return (
      <div className="fixed inset-0 z-90 bg-black/50 backdrop-blur-sm flex items-center justify-center">
        <div
          className="bg-white flex flex-col items-center rounded-2xl p-6 w-11/12 max-w-md shadow-lg"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex flex-col items-center gap-1 mb-6">
            <span className="text-[70px]">
            ⚠️
            </span>
            <h2 className="text-red-600 text-lg font-bold">
               Jenis Pesanan Tidak Sesuai
            </h2>
          </div>
  
          {/* Body */}
          <div className="mb-6 text-sm flex flex-col items-center text-gray-700">
            <p className="mb-2">Pastikan Anda scan:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <strong>Barcode meja</strong> untuk Dine-In
              </li>
              <li>
                <strong>Barcode kasir</strong> untuk Take Away
              </li>
            </ul>
            <p className="mt-5 italic text-gray-500">
              Silakan ulangi proses pemindaian
            </p>
          </div>
  
          {/* Footer */}
          {/* <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition duration-200"
            >
              Baiklah
            </button>
          </div> */}
        </div>
      </div>
    )
  }

export const ProductUnavailableModal = ({ open, onClose, colorsType }) => {
  const modalRef = useRef(null)

  // Detect click outside modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose])


  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white w-full max-w-sm my-20 sm:max-w-lg md:max-w-xl p-4 rounded-xl shadow-lg relative transition-all"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
          Produk Tidak Tersedia
        </h2>
        <p className="text-sm sm:text-base text-gray-700">
          Maaf, produk yang Anda pilih saat ini sedang tidak tersedia.
        </p>
        <div className="mt-5 sm:mt-6 text-right">
          <button
            onClick={onClose}
            className={`${colorsType === 'internal' ? 'bg-gray-800 hover:bg-gray-600': 'bg-green-500 hover:bg-green-600'} text-white px-6 py-2 rounded text-sm sm:text-base`}
          >
            Tutup
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
      <div className="bg-gray-800 text-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Pembayaran Tunai</h2>
        <p className="text-sm text-gray-300 mb-4">
          Total pembayaran:{" "}
          <span className="font-bold text-green-400">
            Rp {data.amount_price.toLocaleString("id-ID")}
          </span>
        </p>

        <label className="block text-sm text-gray-300 mb-1">Uang Diterima</label>
        <input
          type="text"
          value={uangDiterima}
          onChange={handleInputChange}
          className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
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
            className="px-4 py-2 text-sm bg-gray-600 rounded-md hover:bg-gray-500"
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
  


  