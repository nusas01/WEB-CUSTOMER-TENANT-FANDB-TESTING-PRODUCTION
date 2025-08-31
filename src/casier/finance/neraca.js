import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Filter,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Database,
  AlertCircle,
  Maximize,
  Minimize,
  Settings,
  Menu,
} from 'lucide-react';
import Sidebar from '../../component/sidebar';
import {formatCurrency, useFullscreen, useElementHeight} from '../../helper/helper';
import { useDispatch, useSelector } from 'react-redux';
import { filterDateNeracaInternalSlice, navbarInternalSlice } from '../../reducers/reducers'
import { Toast, ToastPortal } from '../../component/alert';
import { SpinnerRelative } from '../../helper/spinner';
import {getNeracaInternalSlice} from '../../reducers/get'
import {fetchNeracaInternal} from '../../actions/get'
import { useNavigate } from 'react-router-dom';
import { AccessDeniedModal } from '../../component/model';

export default function NeracaDashboard() {
  const dispatch = useDispatch()
  const [activeMenu, setActiveMenu] = useState("neraca")
  const [toast, setToast] = useState(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const {resetErrorNeracaInternal} = getNeracaInternalSlice.actions 
  const {errorNeracaIntenal, loadingNeracaInternal} = useSelector((state) => state.persisted.getNeracaInternal)

  const {dataEmployeeInternal} = useSelector((state) => state.persisted.getDataEmployeeInternal)
    useEffect(() => {
      if (dataEmployeeInternal?.position === "Staff") {
        setShowAccessDenied(true)
      }
    }, [dataEmployeeInternal])

  // maxsimaz minimaz layar
  const contentRef = useRef(null);
  const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);

  // handle sidebar and elemant header yang responsice
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

   useEffect(() => {
    if (errorNeracaIntenal) {
      setToast({
          message: "Terjadi kesalahan pada sistem saat mengambil data neraca. Kami sedang melakukan perbaikan. Silakan coba beberapa saat lagi.",
          type: 'error'
        });
         
        const timer = setTimeout(() => {
            dispatch(resetErrorNeracaInternal())
        }, 3000)

        return () => clearTimeout(timer)
    }
  }, [errorNeracaIntenal])

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

        <div
          ref={contentRef}
          className={`flex-1 ${isFullScreen ? 'w-full h-screen overflow-y-auto' : ''}`}
        >
            <NeracaComponent
            isFullScreen={isFullScreen}
            fullscreenchange={toggleFullScreen} 
            />
        </div>
    </div>
  )
}

const NeracaComponent = ({isFullScreen, fullscreenchange}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [spinner, setSpinner] = useState(false)
  const [dateRangeError, setDateRangeError] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    aset: false,
    liabilitas: false,
    ekuitas: false
  });

  // handle sidebar and elemant header yang responsice
  const { ref: headerRef, height: headerHeight } = useElementHeight();
  const { setIsOpen } = navbarInternalSlice.actions
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

  
  // data neraca from state
  const {resetErrorNeracaInternal} = getNeracaInternalSlice.actions 
  const { dataNeracaInternal, errorNeracaIntenal, loadingNeracaInternal } = useSelector((state) => state.persisted.getNeracaInternal)
  
  useEffect(() => {
    setSpinner(loadingNeracaInternal)
  }, [loadingNeracaInternal])

  // filtered date 
  const { setStartDate, setEndDate } = filterDateNeracaInternalSlice.actions
  const { startDate, endDate } = useSelector((state) => state.persisted.filterDateNeracaInternal)

  useEffect(() => {
    if (dataNeracaInternal.length === 0) {
      dispatch(fetchNeracaInternal(startDate, endDate))
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
      dispatch(fetchNeracaInternal(startDate, endDate))
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
  }, [startDate, endDate])

  // Check if data is empty or null
  const isDataEmpty = !dataNeracaInternal || 
    (!dataNeracaInternal.aset?.length && 
     !dataNeracaInternal.liabilitas?.length && 
     !dataNeracaInternal.ekuitas?.length);

  // Calculate totals with safety checks
  const totals = useMemo(() => {
    if (!dataNeracaInternal) {
      return {
        totalAset: 0,
        totalLiabilitas: 0,
        totalEkuitas: 0,
        netCashFlow: 0
      };
    }

    const calculateTotal = (section) => {
      if (!section || !Array.isArray(section)) return 0;
      return section.reduce((total, subKategori) => {
        if (!subKategori.data || !Array.isArray(subKategori.data)) return total;
        return total + subKategori.data.reduce((subTotal, item) => {
          return subTotal + (item.saldo_akhir || 0);
        }, 0);
      }, 0);
    };

    const totalAset = calculateTotal(dataNeracaInternal.aset);
    const totalLiabilitas = calculateTotal(dataNeracaInternal.liabilitas);
    const totalEkuitas = calculateTotal(dataNeracaInternal.ekuitas);

    return {
      totalAset,
      totalLiabilitas,
      totalEkuitas,
      netCashFlow: totalAset - totalLiabilitas
    };
  }, [dataNeracaInternal]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

 // Empty State Component
  const EmptyState = () => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-12 text-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 sm:p-6 bg-gray-100 rounded-full">
          <Database className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Tidak Ada Data Neraca</h3>
          <p className="text-sm sm:text-base text-gray-500 max-w-md px-2">
            Tidak ada data neraca untuk periode yang dipilih. Silakan pilih rentang tanggal yang berbeda atau pastikan data sudah tersedia.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-blue-700 text-center sm:text-left">
            Periode: {new Date(startDate).toLocaleDateString('id-ID')} - {new Date(endDate).toLocaleDateString('id-ID')}
          </span>
        </div>
      </div>
    </div>
  );

  // Summary Cards Component
  const SummaryCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white rounded-lg px-3 sm:px-4 py-6 sm:py-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-gray-500 text-sm font-medium">Total Aset</p>
            <p className="text-xl font-bold text-blue-800 truncate">
              {formatCurrency(totals.totalAset)}
            </p>
          </div>
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 flex-shrink-0" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg px-3 sm:px-4 py-6 sm:py-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-gray-500 text-sm font-medium">Total Liabilitas</p>
            <p className="text-xl font-bold text-red-800 truncate">
              {formatCurrency(totals.totalLiabilitas)}
            </p>
          </div>
          <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 flex-shrink-0" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg px-3 sm:px-4 py-6 sm:py-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-gray-500 text-sm font-medium">Total Ekuitas</p>
            <p className="text-xl font-bold text-green-800 truncate">
               {formatCurrency(Math.abs(totals.totalEkuitas))}
            </p>
          </div>
          <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 flex-shrink-0" />
        </div>
      </div>
      
      <div className="bg-white rounded-lg px-3 sm:px-4 py-6 sm:py-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-gray-500 text-sm font-medium">Net Cash Flow</p>
            <p className="text-xl font-bold text-purple-800 truncate">
              {formatCurrency(totals.netCashFlow)}
            </p>
          </div>
          <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 flex-shrink-0" />
        </div>
      </div>
    </div>
  );

  const renderSection = (title, data, sectionKey, icon, bgColor) => {
    const isExpanded = expandedSections[sectionKey];
    
    if (!data || !Array.isArray(data)) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
          <div className={`${bgColor} px-3 sm:px-4 py-3 rounded-t-lg`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className="flex-shrink-0">{icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
              </div>
              <span className="text-sm sm:text-lg font-bold text-gray-800 flex-shrink-0 ml-2">
                {formatCurrency(0)}
              </span>
            </div>
          </div>
          <div className="p-3 sm:p-4 text-center text-gray-500 text-sm">
            Tidak ada data untuk {title.toLowerCase()}
          </div>
        </div>
      );
    }

    const sectionTotal = data.reduce((total, subKategori) => {
      if (!subKategori.data || !Array.isArray(subKategori.data)) return total;
      return total + subKategori.data.reduce((subTotal, item) => {
        return subTotal + (item.saldo_akhir || 0);
      }, 0);
    }, 0);

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 sm:mb-6">
        <div 
          className={`${bgColor} px-3 sm:px-4 py-3 rounded-t-lg cursor-pointer transition-all duration-200 hover:opacity-90`}
          onClick={() => toggleSection(sectionKey)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="flex-shrink-0">{icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 truncate">{title}</h3>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <span className="text-lg font-bold text-gray-800">
                {formatCurrency(Math.abs(sectionTotal))}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              )}
            </div>
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-3 sm:p-4">
            {data.length === 0 ? (
              <div className="text-center text-gray-500 py-4 text-sm">
                Tidak ada data untuk {title.toLowerCase()}
              </div>
            ) : (
              data.map((subKategori, index) => (
                <div key={index} className="mb-3 sm:mb-4 last:mb-0">
                  <h4 className="text-sm font-medium text-gray-800 border-gray-200 pb-1">
                    {subKategori.sub_kategori || 'Kategori tidak tersedia'}
                  </h4>
                  <div className="space-y-2">
                    {(!subKategori.data || subKategori.data.length === 0) ? (
                      <div className="text-center text-gray-500 py-2 text-sm">
                        Tidak ada item dalam kategori ini
                      </div>
                    ) : (
                      subKategori.data.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between text-gray-800 font-medium items-center py-2 px-2 sm:px-3 bg-gray-50 rounded-md">
                          <span className="text-sm truncate mr-2 flex-1">{item.nama_akun || 'Akun tidak tersedia'}</span>
                          <span className="text-sm flex-shrink-0">
                            {formatCurrency(Math.abs(item.saldo_akhir)|| 0)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className={`fixed top-0 z-10 bg-white border-b border-gray-200 ${isOpen && isMobileDeviceType ? 'hidden' : ''}`}
          style={{
            left: (isFullScreen || isMobileDeviceType) ? '0' : '288px',
            width: isMobileDeviceType ? '100%' : (isFullScreen ? '100%' : 'calc(100% - 288px)'),
            height: '64px'
          }}
        >
          <div className="h-full flex justify-between mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8">
            <div className="flex items-center justify-between h-full gap-1 sm:gap-2 md:gap-4">
              {/* Kiri - Judul */}
              <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 xl:gap-4 min-w-0 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 truncate">
                    Laporan Neraca
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Fullscreen & Mobile Menu Button */}
              <button 
              onClick={() => fullscreenchange()} 
              className="p-1 sm:p-1.5 md:p-2 hover:bg-gray-100 hover:scale-105 rounded-md sm:rounded-lg transition-all touch-manipulation"
              aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullScreen ? (
                  <Minimize className="w-5 h-5 text-gray-600" />
                ) : (
                  <Maximize className="w-5 h-5 text-gray-600" />
                )}
              </button>

              <button
                className="p-1 sm:p-1.5 md:p-2 lg:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 touch-manipulation"
                onClick={() => navigate('/internal/admin/settings')}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {isMobileDeviceType && !isFullScreen && (
                <button
                  onClick={() => dispatch(setIsOpen(true))}
                  className="p-1 sm:p-1.5 md:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors touch-manipulation"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-3 sm:space-y-4' style={{marginTop: headerHeight}}>
          {/* filtering date */}
          <div className='bg-white p-3 sm:p-4 rounded-xl shadow-md border border-gray-200 overflow-hidden'>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 rounded-xl relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 sm:p-2 bg-gray-800 rounded-lg">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">Periode:</span>
                  </div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => dispatch(setStartDate(e.target.value))}
                    className="w-full sm:w-auto bg-white text-gray-800 px-2 sm:px-3 py-1.5 sm:py-2 text-sm rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <span className="text-sm text-gray-700 font-medium">Sampai:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => dispatch(setEndDate(e.target.value))}
                    className="w-full sm:w-auto bg-white text-gray-800 px-2 sm:px-3 py-1.5 sm:py-2 text-sm rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
                  />
                </div>
                <div
                  className="flex cursor-pointer items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm touch-manipulation"
                  onClick={() => handleFilterDate()}
                >
                  <Filter className="w-3 h-3" />
                  <span className="whitespace-nowrap">Klik Filter</span>
                </div>
                {dateRangeError && (
                  <div className="absolute -bottom-5 sm:-bottom-4 left-2 sm:left-10">
                    <span className="text-xs text-red-500">{dateRangeError}</span>
                  </div>
                )}
              </div>
          </div>

          {/* Summary Cards - Always show */}
          <SummaryCards />

          { spinner && (
              <div className="bg-white flex justify-center h-[40vh] sm:h-[50vh] rounded-lg shadow-md p-6 sm:p-12 text-center">
                <SpinnerRelative/>
              </div>
            )}

          {/* Detailed Report or Empty State */}
          { !spinner && (
            <>
              {isDataEmpty ? (
                <EmptyState />
              ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  {/* Report Header */}
                  <div className="bg-white p-3 sm:p-4 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-xl font-bold text-gray-800 truncate">Detail Laporan Neraca</h2>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                          totals.totalAset === (totals.totalLiabilitas + totals.totalEkuitas)
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {totals.totalAset === (totals.totalLiabilitas + totals.totalEkuitas) 
                            ? '✓ Balanced' 
                            : '✗ Not Balanced'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Neraca Sections */}
                  <div className="divide-y divide-gray-200 items-center min-h-[40vh] sm:min-h-[50vh] px-3 sm:px-4 pt-6 sm:pt-10 pb-3 sm:pb-4">
                    {renderSection(
                      "ASET",
                      dataNeracaInternal?.aset || [],
                      "aset",
                      <TrendingUp className="w-6 h-6 text-blue-600" />,
                      "bg-blue-50 border-l-4 border-blue-500"
                    )}
                    
                    {renderSection(
                      "LIABILITAS",
                      dataNeracaInternal?.liabilitas || [],
                      "liabilitas",
                      <TrendingDown className="w-6 h-6 text-red-600" />,
                      "bg-red-50 border-l-4 border-red-500"
                    )}
                    
                    {renderSection(
                      "EKUITAS",
                      dataNeracaInternal?.ekuitas || [],
                      "ekuitas",
                      <DollarSign className="w-6 h-6 text-green-600" />,
                      "bg-green-50 border-l-4 border-green-500"
                    )}
                  </div>

                  {/* Balance Check Footer */}
                  <div className="bg-white p-3 sm:p-4 border-t">
                    <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs sm:text-sm">=</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800">Balance Verification</h3>
                          <p className="text-sm text-gray-600">Aset = Liabilitas + Ekuitas</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-gray-600">Total Calculation</p>
                          <div className="text-lg font-bold text-gray-800">
                            <div className="break-all sm:break-normal">
                              {formatCurrency(totals.totalAset)} = {formatCurrency(Math.abs(totals.totalLiabilitas) + Math.abs(totals.totalEkuitas))}
                            </div>
                          </div>
                        </div>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          totals.totalAset === (totals.totalLiabilitas + totals.totalEkuitas)
                            ? 'bg-green-100'
                            : 'bg-red-100'
                        }`}>
                          {totals.totalAset === (totals.totalLiabilitas + totals.totalEkuitas) ? (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
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