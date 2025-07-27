import React, { useEffect, useState, useRef } from 'react';
import { 
  Bell, 
  Settings, 
  Download, 
  Trash2, 
  Plus, 
  QrCode,
  ShoppingBag,
  CheckCircle,
  RefreshCw,
  Smartphone,
  Clock,
  BarChart3,
  Maximize, 
  Minimize,
  Menu,
} from 'lucide-react';
import Sidebar from '../component/sidebar';
import { useNavigate } from 'react-router-dom';
import { SpinnerRelative, SpinnerFixed } from '../helper/spinner';
import { 
  DeleteConfirmationModalTable,
  ToastPortal,
} from '../component/alert'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTablesInternal } from '../actions/get'
import { deleteTableInternalSlice } from '../reducers/delete'
import { deleteTableInternal } from '../actions/delete'
import { 
  createTabelInternal,
  createQROrderTypeTakeAway,
} from '../actions/post'
import { 
  createTableInternalSlice, 
  createQROrderTypeTakeAwaySlice,
} from '../reducers/post'
import { getTablesInternalSlice } from '../reducers/get'
import handleDownloadQR  from '../helper/downloadQrTable'
import { set } from 'date-fns';
import { Toast } from '../component/alert';
import { useFullscreen, useElementHeight } from '../helper/helper';
import {navbarInternalSlice} from "../reducers/reducers"

// QR Code Component (placeholder - in real app you'd use a QR library)
const QRCodePlaceholder = ({ size = 120, tableNumber = null }) => (
  <div 
    className={`bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center`}
    style={{ width: size, height: size }}
  >
    <div className="text-center">
      <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
      <div className="text-xs text-gray-500">
        {tableNumber ? `Table ${tableNumber}` : 'Take Away'}
      </div>
    </div>
  </div>
);

export default function ModernKasirDashboard() {
  const activeMenu ="table"
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [spinnerRelative, setSpinnerRelative] = useState(true)
  const [spinnerFixed, setSpinnerFixed] = useState(false)
  const [confirmModel, setConfirmModel] = useState(false)
  const [downloadingStates, setDownloadingStates] = useState({});
  const [toast, setToast] = useState(null);
  const origin = window.location.origin;

  // maxsimaz minimaz layar
  const contentRef = useRef(null);
  const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);


  const handleDownloadQRWithLoading = async (tableNumber = null, takeAway = null, imageUrl = '') => {
    const downloadKey = takeAway ? 'takeaway' : `table-${tableNumber}`;
    
    // Set loading state
    setDownloadingStates(prev => ({
      ...prev,
      [downloadKey]: true
    }));

    try {
      await handleDownloadQR(tableNumber, takeAway, imageUrl);
      
      // Success toast
      setToast({
        message: `QR Code ${takeAway ? 'Take Away' : `Table ${tableNumber}`} berhasil didownload`,
        type: 'success'
      });
      
    } catch (error) {
      console.error('Error downloading QR:', error);
      setToast({
        message: 'Gagal mendownload QR Code. Silakan coba lagi.',
        type: 'error'
      });
    } finally {
      // Remove loading state
      setDownloadingStates(prev => {
        const newState = { ...prev };
        delete newState[downloadKey];
        return newState;
      });
    }
  };

  // api call dan data state table
  const { resetErrorTablesInternal } = getTablesInternalSlice.actions
  const {dataTablesInternal, orderTypeTakeAway, errorTablesInternal, loadingTablesInternal} = useSelector((state) => state.persisted.getTablesInternal)
  
  console.log("data table: ", dataTablesInternal)
  useEffect(() => {
    if (dataTablesInternal.length === 0) {
        dispatch(fetchTablesInternal())
    }
  }, [])

  useEffect(() => {
    setSpinnerRelative(loadingTablesInternal)
  }, [loadingTablesInternal])

  useEffect(() => {
    if (errorTablesInternal) {
        setToast({
          message: "Terjadi kesalahan yang tidak terduga. Silakan coba beberapa saat lagi.",
          type: 'error'
        });
         
        const timer = setTimeout(() => {
            dispatch(resetErrorTablesInternal())
        }, 3000)

        return () => clearTimeout(timer)
    }
  }, [errorTablesInternal])

  // handle add table
  const {resetCreateTableInternal} = createTableInternalSlice.actions
  const {successCreateTable, errorCreateTable, loadingCreateTable} = useSelector((state) => state.createTableInternalState)

  useEffect(() => {
    setSpinnerFixed(loadingCreateTable)
  }, [loadingCreateTable])

  const handleAddTable = () => {
    dispatch(createTabelInternal())
  };

  // handle delete table
  const {resetDeleteTableInternal} = deleteTableInternalSlice.actions
  const {successDeleteTable, errorDeleteTable, loadingDeleteTable} = useSelector((state) => state.deleteTableInternalState)

  const handleDeleteLastTable = () => {
    setConfirmModel(false)
    dispatch(deleteTableInternal())
  };

  useEffect(() => {
    setSpinnerFixed(loadingDeleteTable)
  }, [loadingDeleteTable])

  // Success toast for create/delete table
  useEffect(() => {
    if (successDeleteTable || successCreateTable) {
      setToast({
        message: successCreateTable 
          ? "Meja berhasil ditambahkan ke sistem."
          : "Meja berhasil dihapus dari sistem.",
        type: 'success'
      });

      const timer = setTimeout(() => {
        dispatch(resetDeleteTableInternal())
        dispatch(resetCreateTableInternal())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [successDeleteTable, successCreateTable])

  // Error toast for create/delete table
  useEffect(() => {
    if (errorDeleteTable || errorCreateTable) {
      setToast({
        message: errorCreateTable
          ? "Terjadi kesalahan saat membuat table. Server kami sedang mengalami gangguan internal. Kami sedang mengatasinya, silakan coba beberapa saat lagi."
          : "Terjadi kesalahan saat menghapus table. Mohon tunggu sebentar, kami sedang menangani masalah ini.",
        type: 'error'
      });

      const timer = setTimeout(() => {
        dispatch(resetDeleteTableInternal())
        dispatch(resetCreateTableInternal())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorDeleteTable, errorCreateTable])

  // handle create QR code for take away
  const {resetCreateQROrderTypeTakeAway} = createQROrderTypeTakeAwaySlice.actions
  const {errorCreateQROrderTypeTakeAway, loadingCreateQROrderTypeTakeAway, alredyCreated} = useSelector((state) => state.createQROrderTypeTakeAwayState)
  
  const handleCreateTakeAwayQR = () => {
    dispatch(createQROrderTypeTakeAway())
  };

  useEffect(() => {
    if (errorCreateQROrderTypeTakeAway || alredyCreated) {
      setToast({
        message: errorCreateQROrderTypeTakeAway
          ? "Terjadi kesalahan saat membuat QR Code untuk take away. Mohon tunggu sebentar, kami sedang menangani masalah ini."
          : "QR Code untuk take away sudah ada. Silakan gunakan QR Code yang sudah ada.",
        type: 'error'
      });

      const timer = setTimeout(() => {
        dispatch(resetCreateQROrderTypeTakeAway())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorCreateQROrderTypeTakeAway, alredyCreated])

  useEffect(() => {
    setSpinnerFixed(loadingCreateQROrderTypeTakeAway)
  }, [loadingCreateQROrderTypeTakeAway])

  
  // handle navbar ketika ukuran table dan hp
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

  // handle sidebar and elemant header yang responsice
  const { ref: headerRef, height: headerHeight } = useElementHeight();
  const { setIsOpen } = navbarInternalSlice.actions

  return (
    <div>
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

      <div className='flex relative'>
        {/* Sidebar - Fixed width */}
          {(!isFullScreen && (!isMobileDeviceType || (isOpen && isMobileDeviceType))) && (
            <div className="w-1/10 z-50 min-w-[290px]">
                <Sidebar 
                activeMenu={activeMenu}
                />
            </div>
          )}


        { spinnerFixed && (
          <SpinnerFixed colors={"fill-gray-800"}/>
        )}

        { confirmModel && (
          <DeleteConfirmationModalTable submit={handleDeleteLastTable} onClose={() => setConfirmModel(false)}/>
        )}

        {/* Main Content */}
        <div
          ref={contentRef}
          className={`flex-1 bg-gray-50 ${isFullScreen ? 'w-full h-screen overflow-y-auto' : ''}`}
        >
          {/* Header */}
          <div
            ref={headerRef}
            className={`fixed top-0 z-10 bg-white border-b border-gray-200 ${(isOpen && isMobileDeviceType) || spinnerFixed || confirmModel ? 'hidden' : ''}`}
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
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="26"  height="26"  viewBox="0 0 24 24"  fill="none"  stroke="white"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-databricks"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17l9 5l9 -5v-3l-9 5l-9 -5v-3l9 5l9 -5v-3l-9 5l-9 -5l9 -5l5.418 3.01" /></svg>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 truncate">Tables</h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
                    <button
                     onClick={() => toggleFullScreen()} 
                     className="p-1.5 sm:p-2 hover:bg-gray-100 hover:scale-105 rounded-md sm:rounded-lg transition-all touch-manipulation"
                     aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                      {isFullScreen ? ( 
                        <Minimize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" /> 
                      ) : (
                        <Maximize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                      )}                      
                    </button>

                    <button 
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
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
                        <Menu className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                      </button>
                    )}
                  </div>
              </div>
              </div>
          </div>

          <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4" style={{marginTop: headerHeight}}>
             {/* Take Away Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Take Away QR Code</h2>
                  <p className="text-gray-600 text-sm">QR code untuk pemesanan take away</p>
                </div>
              </div>

              {orderTypeTakeAway ? (
                // QR Code exists - show QR code and details
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <QRCodePlaceholder size={160} />
                  </div>
                  <div className="flex-1">
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-green-700 mb-1">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">QR Code Active</span>
                        </div>
                        <p className="text-xs text-green-600">Pelanggan dapat memindai QR code untuk memesan take away</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <QrCode className="w-4 h-4" />
                          <span className="text-sm">URL: {origin}?order_type_take_away=true</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <ShoppingBag className="w-4 h-4" />
                          <span className="text-sm">Type: Take Away Orders</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button 
                         onClick={() => handleDownloadQRWithLoading(null, 'take away', orderTypeTakeAway)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                      >
                        {downloadingStates['takeaway'] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Download QR Code
                            </>
                          )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // No QR Code - show create button and informative content
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-10 h-10 text-orange-400" />
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum Ada QR Code Take Away
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 max-w-md mx-auto">
                    QR code ini mengarahkan pelanggan ke halaman pemesanan take away.
                  </p>

                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 max-w-2xl mx-auto">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Smartphone className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">Mudah Diakses</h4>
                      <p className="text-xs text-gray-600">Pelanggan hanya perlu memindai QR code</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">Hemat Waktu</h4>
                      <p className="text-xs text-gray-600">Proses pemesanan lebih cepat dan efisien</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm mb-1">Tracking Order</h4>
                      <p className="text-xs text-gray-600">Monitor pesanan dengan mudah</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleCreateTakeAwayQR()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    Create QR Code Take Away
                  </button>
                </div>
              )}
            </div>

            {/* Tables Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                <h2 className="text-xl font-semibold text-gray-900">Dine-in Tables</h2>
                <p className="text-gray-600 text-sm">Kelola QR code untuk setiap meja</p>
                </div>
                
                <div className="flex items-center gap-3">
                {dataTablesInternal.length > 0 && !spinnerRelative && (
                    <button 
                    onClick={() => setConfirmModel(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                    <Trash2 className="w-4 h-4" />
                    Delete Last Table
                    </button>
                )}
                <button 
                    onClick={handleAddTable}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Table
                </button>
                </div>
            </div>

            {/* Table Grid */}
            {spinnerRelative && (
              <div className='flex justify-center h-[50vh]'>
                <SpinnerRelative/>
              </div>
            )}
              
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {!spinnerRelative && dataTablesInternal.map((table) => (
                <div 
                    key={table.number_table}
                    className="p-5 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 transition-all duration-200"
                >
                    {/* Table Content */}
                    <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 mb-4">
                        Table {table.number_table}
                    </div>
                    
                    <div className="flex justify-center mb-4">
                        <QRCodePlaceholder size={120} tableNumber={table.number_table} />
                    </div>

                    <button 
                        onClick={() => handleDownloadQRWithLoading(table.number_table, null, table.image)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        {downloadingStates[`table-${table.number_table}`] ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Downloading...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Download QR
                          </>
                        )}
                    </button>
                    </div>
                </div>
                ))}
            </div>

            {/* Empty State */}
            {dataTablesInternal.length === 0 && !spinnerRelative && (
                <div className="text-center py-12">
                <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tables available</h3>
                <p className="text-gray-600 mb-6">Add your first table to get started</p>
                <button 
                    onClick={handleAddTable}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add First Table
                </button>
                </div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}