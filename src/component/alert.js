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
  


  