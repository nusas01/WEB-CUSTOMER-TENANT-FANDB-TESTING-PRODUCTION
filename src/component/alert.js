import React, { useState, useEffect, forwardRef } from "react"
import { CheckCircle, XCircle } from "lucide-react"

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


  export const ErrorAlert = ({ message }) => {
    return (
      <div className="fixed w-full z-50">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-200 w-full max-w-sm h-[50px] px-4 py-2 flex items-center justify-center border-l-4 border-red-600 text-white rounded-sm shadow-md">
          <p className="text-md md:text-base text-center">{message}</p>
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
  const isSuccess = type === "success"
  const icon = isSuccess ? (
    <CheckCircle className="h-16 w-16 text-green-500" />
  ) : (
    <XCircle className="h-16 w-16 text-red-500" />
  )
  const buttonColorClass = isSuccess ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" : "bg-red-600 hover:bg-red-700 focus:ring-red-500";

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

  
export const CashPaymentModal = forwardRef(({ data, setData, onClose, onBayar }, ref) => {
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


export const SuccessAlertPaymentCash = ({ kembalian, onClose }) =>  {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-gray-800 text-white rounded-2xl p-6 w-full max-w-md shadow-lg text-center">
        <CheckCircle className="h-16 w-16 text-green-400 mx-auto" />
        <h3 className="text-lg font-semibold mt-4">Pembayaran Berhasil</h3>
        <p className="text-sm text-gray-300 mt-2">
          Kembalian:{" "}
          <span className="text-green-300 font-bold">
            Rp {kembalian.toLocaleString("id-ID")}
          </span>
        </p>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 text-sm font-semibold bg-green-600 hover:bg-green-700 rounded-md"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
  


  