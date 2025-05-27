import { ShoppingCart, Clock } from 'lucide-react';

const ServiceRenewalNotice = ({ expirationDate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 md:p-12 transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          <div className="bg-red-100 p-4 rounded-full">
            <ShoppingCart className="text-red-500 w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Layanan Anda Akan Segera Berakhir!
            </h1>
            <p className="text-gray-600 text-lg">
              Masa berlaku layanan akan berakhir pada{' '}
              <span className="font-semibold text-red-500">
                {expirationDate}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 text-yellow-800">
            <Clock className="w-6 h-6 flex-shrink-0" />
            <p className="text-sm">
              Untuk menghindari gangguan layanan, silakan perpanjang langganan Anda 
              sebelum tanggal kedaluwarsa.
            </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Lakukan Pembaruan Sekarang
            </h2>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Perpanjang Layanan Sekarang
            </button>
          </div>

          <div className="border-t pt-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Metode Pembayaran yang Didukung
            </h3>
            <div className="flex justify-center gap-4 text-gray-600 font-medium">
              <span>Kartu Kredit</span>
              <span>•</span>
              <span>Transfer Bank</span>
              <span>•</span>
              <span>E-Wallet</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Butuh bantuan? Hubungi kami di{' '}
          <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
            support@example.com
          </a>{' '}
          atau (+62) 123-4567-890
        </p>
      </div>
    </div>
  );
};

export default ServiceRenewalNotice;