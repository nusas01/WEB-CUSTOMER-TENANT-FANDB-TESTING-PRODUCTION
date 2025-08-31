import React, { useEffect, useState, useRef } from 'react';
import { Calendar, TrendingUp, Settings, TrendingDown, Maximize, Menu, Minimize, DollarSign, FileText, Filter, AlertCircle, Database } from 'lucide-react';
import { formatCurrency, useFullscreen, useElementHeight } from '../../helper/helper';
import Sidebar from '../../component/sidebar';
import { fetchLabaRugiInternal } from '../../actions/get'
import { useDispatch, useSelector } from 'react-redux';
import { filterDateLabaRugiInternalSlice, navbarInternalSlice } from '../../reducers/reducers'
import { ToastPortal, Toast } from '../../component/alert';
import { SpinnerRelative } from '../../helper/spinner';
import { getLabaRugiInternalSlice } from '../../reducers/get'
import { useNavigate } from 'react-router-dom';
import { AccessDeniedModal } from '../../component/model';

const ProfitAndLoss = ({isFullScreen, fullscreenchange}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [spinner, setSpinner] = useState(false)
  const [dateRangeError, setDateRangeError] = useState("");
  const [toast, setToast] = useState(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  const {dataEmployeeInternal} = useSelector((state) => state.persisted.getDataEmployeeInternal)
  useEffect(() => {
    if (dataEmployeeInternal?.position === "Staff") {
      setShowAccessDenied(true)
    }
  }, [dataEmployeeInternal])

  // handle sidebar and elemant header yang responsice
  const { ref: headerRef, height: headerHeight } = useElementHeight();
  const { setIsOpen } = navbarInternalSlice.actions
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

  // data profit and loss from state 
  const { resetErrorLabaRugiInternal } = getLabaRugiInternalSlice.actions
  const {dataLabaRugiInternal, errorLabaRugiIntenal, loadingLabaRugiInternal} = useSelector((state) => state.persisted.getLabaRugiInternal)
  
  useEffect(() => {
    setSpinner(loadingLabaRugiInternal)
  }, [loadingLabaRugiInternal])

  useEffect(() => {
    if (errorLabaRugiIntenal) {
      setToast({
        message: "Terjadi kesalahan pada sistem saat mengambil data laba rugi. Kami sedang melakukan perbaikan. Silakan coba beberapa saat lagi.",
        type: 'error'
      });
        
      const timer = setTimeout(() => {
        dispatch(resetErrorLabaRugiInternal())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorLabaRugiIntenal])

  // filter date from state
  const { setStartDate, setEndDate } = filterDateLabaRugiInternalSlice.actions
  const { startDate, endDate } = useSelector((state) => state.persisted.filterDateLabaRugiInternal)

  useEffect(() => {
    if (dataLabaRugiInternal.length === 0) {
      dispatch(fetchLabaRugiInternal(startDate, endDate))
    }
  }, [])

  const handleFilterDate = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const maxRange = 366 * 24 * 60 * 60 * 1000; // 366 hari (tahun kabisat)
    const diff = end - start;

    if (diff > maxRange) {
      setDateRangeError("Rentang tanggal tidak boleh lebih dari 1 tahun.");
    } else if (start > end) {
      setDateRangeError("Tanggal mulai tidak boleh setelah tanggal akhir.");
    } else {
      setDateRangeError("");
      dispatch(fetchLabaRugiInternal(startDate, endDate))
    }
  }

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const maxRange = 366 * 24 * 60 * 60 * 1000; // 366 hari (tahun kabisat)
      const diff = end - start;

      if (diff > maxRange) {
        setDateRangeError("Rentang tanggal tidak boleh lebih dari 1 tahun.");
      } else if (start > end) {
        setDateRangeError("Tanggal mulai tidak boleh setelah tanggal akhir.");
      } else {
        setDateRangeError("");
      }
    }
  }, [startDate, endDate]);

  console.log(dataLabaRugiInternal)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Check if data is empty or null
  const isDataEmpty = dataLabaRugiInternal.length || 
    (dataLabaRugiInternal.total_pendapatan === 0 && 
     dataLabaRugiInternal.laba_kotor === 0 && 
     dataLabaRugiInternal.total_beban === 0 && 
     dataLabaRugiInternal.laba_bersih === 0);

     
  // Empty State Component
  const EmptyState = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="flex flex-col items-center justify-center py-16 px-8 text-center relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-8 left-8 w-20 h-20 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-8 right-8 w-16 h-16 bg-gray-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg">
            <Database className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
          </div>
          
          <div className="space-y-3 max-w-md">
            <h3 className="text-xl sm:text-2xl  text-gray-800">Tidak Ada Data Laporan</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Tidak ada data laba rugi untuk periode yang dipilih. Silakan pilih rentang tanggal yang berbeda atau pastikan data sudah tersedia.
            </p>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="p-1 bg-blue-100 rounded-full">
              <AlertCircle className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-800">
              Periode: {new Date(startDate).toLocaleDateString('id-ID')} - {new Date(endDate).toLocaleDateString('id-ID')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Summary Cards with Empty State
  const SummaryCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-white rounded-xl px-4 py-6 sm:py-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Pendapatan</p>
            <p className="text-lg font-bold sm:text-xl lg:text-2xl">
              {formatCurrency(dataLabaRugiInternal?.total_pendapatan || 0)}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl px-4 py-6 sm:py-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">Laba Kotor</p>
            <p className="text-lg sm:text-xl font-bold lg:text-2xl">
              {formatCurrency(dataLabaRugiInternal?.laba_kotor || 0)}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl px-4 py-6 sm:py-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Beban</p>
            <p className="text-lg sm:text-xl font-bold lg:text-2xl">
              {formatCurrency(dataLabaRugiInternal?.total_beban || 0)}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
            <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl px-4 py-6 sm:py-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-gray-600 text-sm font-medium mb-2">Laba Bersih</p>
            <p className="text-lg sm:text-xl font-bold lg:text-2xl">
              {formatCurrency(dataLabaRugiInternal?.laba_bersih || 0)}
            </p>
          </div>
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  console.log(dataLabaRugiInternal)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error Alert */}
        {toast && (
          <ToastPortal> 
            <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-100'>
              <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
              duration={3000}
              />
            </div>
          </ToastPortal>
        )}

        <AccessDeniedModal
            isOpen={showAccessDenied}
            onClose={() => setShowAccessDenied(true)}
            title='Akses Ditolak'
            message='Role anda tidak memiliki izin untuk mengakses fitur ini.'
            buttonText='Mengerti'
        />
 
        {/* Header */}
        <div
          ref={headerRef}
          className={`fixed top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 ${isOpen && isMobileDeviceType ? 'hidden' : ''}`}
          style={{
            left: (isFullScreen || isMobileDeviceType) ? '0' : '288px',
            width: isMobileDeviceType ? '100%' : (isFullScreen ? '100%' : 'calc(100% - 288px)'),
            height: '64px'
          }}
        >
          <div className="h-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1"> 
                  <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 truncate">
                    Laporan Laba Rugi
                  </h1>
                </div>
              </div>

              <div className='flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0'>
                <button 
                onClick={() => fullscreenchange()} 
                className="p-1.5 sm:p-2 hover:bg-gray-100 hover:scale-105 rounded-md sm:rounded-lg transition-all touch-manipulation"
                aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullScreen ? (
                    <Minimize className="w-5 h-5  text-gray-600" />
                  ) : (
                    <Maximize className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button
                  className="p-1.5 sm:p-2 lg:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 touch-manipulation"
                  onClick={() => navigate('/internal/admin/settings')}
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                { isMobileDeviceType && !isFullScreen && (
                  <button 
                    onClick={() => dispatch(setIsOpen(true))}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors touch-manipulation"
                    aria-label="Open menu"
                  >
                    <Menu className="w-5 h-5 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
    

        <div className='space-y-4 sm:space-y-6' style={{marginTop: headerHeight}}>
          {/* filtering  */}
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 sm:items-end">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-sm">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium whitespace-nowrap">Periode:</span>
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => dispatch(setStartDate(e.target.value))}
                  className="bg-white text-gray-800 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all w-full sm:w-auto"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-gray-700 font-medium whitespace-nowrap">Sampai:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => dispatch(setEndDate(e.target.value))}
                  className="bg-white text-gray-800 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all w-full sm:w-auto"
                />
              </div>
              
              <button
                className="flex cursor-pointer items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-4 sm:px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-lg font-medium text-sm group w-full sm:w-auto"
                onClick={() => handleFilterDate()}
              >
                <Filter className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                <span>Filter Data</span>
              </button>
            </div>
            
            {dateRangeError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-red-600">{dateRangeError}</span>
                </div>
              </div>
            )}
          </div>

          {/* Summary Cards - Always show */}
          <SummaryCards />
          
          { spinner && (
            <div className="bg-white flex justify-center h-[50vh] rounded-xl shadow-lg border border-gray-100 p-12 text-center">
              <SpinnerRelative/>
            </div>
          )}

          {/* Detailed Report or Empty State */}
          { !spinner && (
            <>
              { isDataEmpty ? (
                <EmptyState />
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4 bg-white">
                    <h2 className="text-xl font-bold text-gray-800">Rincian Laba Rugi</h2>
                    <p className="text-gray-600 text-sm mt-1">Detail breakdown laporan keuangan</p>
                  </div>
                  
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch bg-white">
                    {/* Pendapatan */}
                    <div className="flex flex-col justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-10 h-full">
                      <div>
                        <h3 className="text-lg mb-6 flex items-center gap-3">
                          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          Pendapatan
                        </h3>
                        <div className="space-y-4">
                          {dataLabaRugiInternal?.pendapatan?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl hover:bg-gray-100">
                              <span className="font-medium">{item.account_name}</span>
                              <span>{formatCurrency(item.total_kredit)}</span>
                            </div>
                          )) || (
                            <div className="flex justify-center items-center p-4 bg-white rounded-xl">
                              <span className="text-gray-500">Tidak ada data pendapatan</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                          <span className="text-white font-bold">Total Pendapatan</span>
                          <span className="text-white font-bold  text-lg">
                            {formatCurrency(dataLabaRugiInternal?.total_pendapatan || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* HPP */}
                    <div className="flex flex-col justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-10 h-full">
                      <div>
                        <h3 className="text-lg mb-6 flex items-center gap-3">
                          <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                          </div>
                          Harga Pokok Penjualan
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-white rounded-xl hover:bg-gray-100">
                            <span className="font-medium">
                              {dataLabaRugiInternal?.hpp?.account_name || "Tidak ada data HPP"}
                            </span>
                            <span>
                              ({formatCurrency(dataLabaRugiInternal?.hpp?.total_Debet || 0)})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                          <span className="text-white font-bold">Laba Kotor</span>
                          <span className="text-white font-bold text-lg">
                            {formatCurrency(dataLabaRugiInternal?.laba_kotor || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Beban */}
                    <div className="flex flex-col justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-10 h-full">
                      <div>
                        <h3 className="text-lg mb-6 flex items-center gap-3">
                          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <TrendingDown className="w-5 h-5" />
                          </div>
                          Beban Operasional
                        </h3>
                        <div className="space-y-4">
                          {dataLabaRugiInternal?.beban?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-white rounded-xl hover:bg-gray-100">
                              <span className="font-medium">{item.account_name}</span>
                              <span>({formatCurrency(item.total_Debet)})</span>
                            </div>
                          )) || (
                            <div className="flex justify-center items-center p-4 bg-white rounded-xl">
                              <span className="text-gray-500">Tidak ada data beban</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-xl">
                          <span className="text-white font-bold">Total Beban</span>
                          <span className="text-white font-bold text-lg">
                            ({formatCurrency(dataLabaRugiInternal?.total_beban || 0)})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Laba Bersih */}
                  <div className="flex justify-between items-center p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xl font-bold text-gray-800">Laba Bersih</span>
                    </div>
                    <span className="text-xl font-bold text-gray-800">
                      {formatCurrency(dataLabaRugiInternal?.laba_bersih || 0)}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>   
      </div>
    </div>
  );
};

export default function ProfitLossStatement() {
  const [activeMenu, setActiveMenu] = useState("profit-and-loss")
  
  // maxsimaz minimaz layar
  const contentRef = useRef(null);
  const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);

  // handle sidebar and elemant header yang responsice
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

  return (
    <div className="flex relative">
      {/* Sidebar - Fixed width */}
      {(!isFullScreen && (!isMobileDeviceType || (isOpen && isMobileDeviceType))) && (
        <div className="w-1/10 z-50 min-w-[290px]">
            <Sidebar 
            activeMenu={activeMenu}
            />
        </div>
      )}

      <div
        ref={contentRef}
        className={`flex-1 ${isFullScreen ? 'w-full h-screen overflow-y-auto' : ''}`}
      >
        <ProfitAndLoss
         isFullScreen={isFullScreen}
         fullscreenchange={toggleFullScreen}
        />
      </div>
    </div>
  )
}