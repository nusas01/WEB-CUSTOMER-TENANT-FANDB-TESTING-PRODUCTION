import React from 'react';
import { 
  Settings, 
  Clock, 
  AlertCircle, 
  Wrench, 
  Shield,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

const MaintenanceComponent = () => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const maintenanceFeatures = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Keamanan Sistem",
      description: "Meningkatkan proteksi data pengguna"
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Performa Aplikasi",
      description: "Optimalisasi kecepatan dan stabilitas"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Perbaruan Konfigurasi",
      description: "Meningkatkan kinerja dan stabilitas sistem"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-green-100 border border-green-100 overflow-hidden">
          {/* Header with animated background */}
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white overflow-hidden">
            <div className="absolute inset-0 bg-white bg-opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-pulse"></div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
                <Settings className="w-10 h-10 animate-spin" style={{animationDuration: '3s'}} />
              </div>
              
              <h1 className="text-3xl font-bold mb-2">Sistem Sedang Maintenance</h1>
              <p className="text-green-100 text-lg">Kami sedang meningkatkan layanan untuk Anda</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Status Info */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 bg-opacity-20 rounded-full">
                    <AlertCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">Status Maintenance</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Sedang Berlangsung
                  </span>
                </div>
              </div>
            </div>

            {/* What We're Doing */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Apa yang Sedang Kami Kerjakan?
              </h3>
              
              <div className="grid gap-4">
                {maintenanceFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 p-5 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-100 hover:border-green-200 transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="flex-shrink-0 p-2 bg-green-500 bg-opacity-20 rounded-lg text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{feature.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
              <div className="text-center">
                <h4 className="font-semibold text-gray-800 mb-3">Butuh Bantuan?</h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Jika Anda memiliki pertanyaan mendesak, silakan hubungi tim support kami
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium">
                    Hubungi Support
                  </button>
                  <button className="border border-green-500 text-green-600 hover:bg-green-50 px-6 py-2 rounded-lg transition-colors duration-200 font-medium">
                    Cek Status
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Message */}
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Terima kasih atas kesabaran Anda. Kami akan segera kembali! 🚀
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceComponent;