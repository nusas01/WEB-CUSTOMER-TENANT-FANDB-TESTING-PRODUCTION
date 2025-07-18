import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  Settings, 
  Download, 
  Trash2, 
  Plus, 
  QrCode,
  ShoppingBag
} from 'lucide-react';
import Sidebar from '../component/sidebar';
import { useNavigate } from 'react-router-dom';
import { SpinnerRelative, SpinnerFixed } from '../helper/spinner';
import { ErrorAlert, SuccessAlert, DeleteConfirmationModalTable } from '../component/alert'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTablesInternal } from '../actions/get'
import { deleteTableInternalSlice } from '../reducers/delete'
import { deleteTableInternal } from '../actions/delete'
import { createTabelInternal } from '../actions/post'
import { createTableInternalSlice } from '../reducers/post'
import { getTablesInternalSlice } from '../reducers/get'
import handleDownloadQR from '../helper/downloadQrTable'

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

// Toast Notification Component
const Toast = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`}>
    <span>{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-black/20 rounded p-1">
      <span className="text-xl">×</span>
    </button>
  </div>
);

export default function ModernKasirDashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [spinnerRelative, setSpinnerRelative] = useState(true)
  const [spinnerFixed, setSpinnerFixed] = useState(false)
  const [errorAllert, setErrotAllert] = useState(false)
  const [successAlert, setSuccessAllert] = useState(false)
  const [confirmModel, setConfirmModel] = useState(false)
  const [tables, setTables] = useState([
    { nomor: 1 },
    { nomor: 2 },
    { nomor: 3 },
    { nomor: 4 },
    { nomor: 5 },
    { nomor: 6 },
    { nomor: 7 },
    { nomor: 8 },
  ]);


  // api call dan data state table
  const { resetErrorTablesInternal } = getTablesInternalSlice.actions
  const {dataTablesInternal, errorTablesInternal, loadingTablesInternal} = useSelector((state) => state.persisted.getTablesInternal)
  
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
        setErrotAllert(true)
         
        const timer = setTimeout(() => {
            setErrotAllert(false)
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

  useEffect(() => {
    if (successDeleteTable || successCreateTable) {
      setSuccessAllert(true)

      const timer = setTimeout(() => {
        setSuccessAllert(false)
        dispatch(resetDeleteTableInternal())
        dispatch(resetCreateTableInternal())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [successDeleteTable, successCreateTable])

  useEffect(() => {
    if (errorDeleteTable || errorCreateTable) {
      setErrotAllert(true)

      const timer = setTimeout(() => {
        setErrotAllert(false)
        dispatch(resetDeleteTableInternal())
        dispatch(resetCreateTableInternal())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errorDeleteTable, errorCreateTable])


  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      {successAlert && (
        <div classname="fixed">
          <SuccessAlert
            message={
              successCreateTable
                ? "Meja berhasil ditambahkan ke sistem."
                : successDeleteTable
                ? "Meja berhasil dihapus dari sistem."
                : "Aksi berhasil diselesaikan."
            }
          />
        </div>
      )}

      {errorAllert && (
        <div classname="fixed">
          <ErrorAlert
            message={
              errorCreateTable
                ? "Terjadi kesalahan saat membuat table. Server kami sedang mengalami gangguan internal. Kami sedang mengatasinya, silakan coba beberapa saat lagi."
                : errorDeleteTable
                ? "Terjadi kesalahan saat menghapus table. Mohon tunggu sebentar, kami sedang menangani masalah ini."
                : "Terjadi kesalahan yang tidak terduga. Silakan coba beberapa saat lagi."
            }
            onClose={() => setErrotAllert(false)}
          />
        </div>
      )}

      <div className='flex'>
        <div className='w-1/10 min-w-[250px]'>
          <Sidebar activeMenu={"table"}/>
        </div>

        { spinnerFixed && (
          <SpinnerFixed colors={"fill-gray-800"}/>
        )}

        { confirmModel && (
          <DeleteConfirmationModalTable submit={handleDeleteLastTable} onClose={() => setConfirmModel(false)}/>
        )}

        <div className="min-h-screen bg-gray-50 flex-1">
          {/* Toast Notification */}
          {toast && (
              <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
              />
          )}

          {/* Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                      <svg  xmlns="http://www.w3.org/2000/svg"  width="26"  height="26"  viewBox="0 0 24 24"  fill="none"  stroke="white"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-brand-databricks"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 17l9 5l9 -5v-3l-9 5l-9 -5v-3l9 5l9 -5v-3l-9 5l-9 -5l9 -5l5.418 3.01" /></svg>
                  </div>
                  <div>
                      <h1 className="text-xl font-bold text-gray-800">Tables</h1>
                      <p className="text-gray-600 text-xs">Sistem manajemen meja untuk efisiensi operasional restoran Anda</p>
                  </div>
                  </div>
                  <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Bell className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" onClick={() => navigate('/internal/admin/settings')}>
                      <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                  </div>
              </div>
              </div>
          </div>

          <div className="p-6 space-y-4">
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

              <div className="flex items-center gap-6">
                  <div className="p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <QRCodePlaceholder size={140} />
                  </div>
                  <div className="flex-1">
                  <div className="space-y-3">
                      <div className="flex items-center gap-2 text-gray-600">
                      <QrCode className="w-4 h-4" />
                      <span className="text-sm">URL: https://restaurant.com/takeaway</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                      <ShoppingBag className="w-4 h-4" />
                      <span className="text-sm">Type: Take Away Orders</span>
                      </div>
                  </div>
                  <button 
                      onClick={() => handleDownloadQR()}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                      <Download className="w-4 h-4" />
                      Download QR Code
                  </button>
                  </div>
              </div>
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
                          onClick={() => handleDownloadQR(table.number_table, table.image)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                          <Download className="w-4 h-4" />
                          Download QR
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
    </>
    
  );
}