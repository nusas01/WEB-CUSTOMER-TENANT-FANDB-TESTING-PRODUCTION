import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Filter, 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '../../component/sidebar';
import {FormatISODate} from '../../helper/formatdate.js'
import {DrafVoidDataComponent} from './drafVoidGeneralJournal'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {voidGeneralJournalInternal} from '../../actions/put'
import {voidGeneralJournalInternalSlice} from '../../reducers/put'
import{VoidJournalConfirmationModal, ErrorAlert} from '../../component/alert'
import {
  filterGeneralJournalInternalSlice, 
  dataDrafToVoidInternalSlice,
} from '../../reducers/reducers'
import { SpinnerRelative } from '../../helper/spinner';
import {
  fetchGeneralJournalByEventAllInternal, 
  fetchGeneralJournalByEventPerDayInternal, 
  fetchGeneralJournalVoidInternal, 
  fetchGeneralJournalDrafInternal,
} from '../../actions/get';
import {formatCurrency} from '../../helper/helper'
import {DateFilterComponent,validateDateRange} from '../../helper/formatdate';
 
export default function GeneralJournalDashboard() {
    const [activeMenu, setActiveMenu] = useState("general-journal")
    const dispatch = useDispatch()

    // handle response error journal draf to 
    const [errorAllertVoid, setErrorAlertVoid] = useState(false)
    const {resetVoidGeneralJournal} = voidGeneralJournalInternalSlice.actions
    const {errorVoidGeneralJournal} = useSelector((state) => state.voidGeneralJournalInternalState)

    useEffect(() => {
      if (errorVoidGeneralJournal) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setErrorAlertVoid(true);
    
        const timeOut = setTimeout(() => {
          setErrorAlertVoid(false);
          dispatch(resetVoidGeneralJournal());
        }, 3000); 
    
        return () => clearTimeout(timeOut);
      }
    }, [errorVoidGeneralJournal]);

    return (
      <div className="flex">
        {errorAllertVoid && (

          <ErrorAlert 
          message={"There was an error on the internal server, we are fixing it."}
          onClose={() => setErrorAlertVoid(false)}
          />
        )}

          <div className="w-1/10 min-w-[250px]">
              <Sidebar activeMenu={activeMenu}/>
          </div>

          <div className="flex-1">
              <JournalDashboard/>
          </div>
        </div>
    )
}

const JournalDashboard = () => {
  const dateInputRef = useRef(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [spinnerRelative, setSpinnerRelative] = useState(false)

  const {dataGeneralJournalByEventPerDayInternal : journalDataNonAgregasi, loadingGeneralJournalByEventPerDayInternal} = useSelector((state) => state.persisted.getGeneralJournalByEventPerDayInternal)
  useEffect(() => {
    setSpinnerRelative(loadingGeneralJournalByEventPerDayInternal)
  }, [loadingGeneralJournalByEventPerDayInternal])

  // Sample data dengan berbagai status
  const { dataGeneralJournalByEventAllInternal : journalDataAgregasi, loadingGeneralJournalByEventAllInternal} = useSelector((state) => state.persisted.getGeneralJournalByEventInternal)
  useEffect(() => {
    setSpinnerRelative(loadingGeneralJournalByEventAllInternal)
  }, [loadingGeneralJournalByEventAllInternal])


  const {dataGeneralJournalDrafInternal : journalDataDraf, loadingGeneralJournalDrafInternal} = useSelector((state) => state.persisted.getGeneralJournalDrafInternal)
  useEffect(() => {
    setSpinnerRelative(loadingGeneralJournalDrafInternal )
  }, [loadingGeneralJournalDrafInternal])


  const {dataGeneralJournalVoidInternal : journalDataVoid, loadingGeneralJournalVoidInternal} = useSelector((state) => state.persisted.getGeneralJournalVoidInternal)
  useEffect(() => {
    setSpinnerRelative(loadingGeneralJournalVoidInternal)
  }, [loadingGeneralJournalVoidInternal])

  

  const groupedDataAgregasi = journalDataAgregasi.reduce((acc, entry) => {
    if (!acc[entry.event]) {
      acc[entry.event] = [];
    }
    acc[entry.event].push(entry);
    return acc;
  }, {});

  const groupedDataNonAgregasi = journalDataNonAgregasi.reduce((acc, entry) => {
    if (!acc[entry.event]) {
      acc[entry.event] = [];
    }
    acc[entry.event].push(entry);
    return acc;
  }, {});
  

  // Filter states
  const {startDate, endDate, statusFilter, eventFilter, searchTerm} = useSelector((state) => state.persisted.filterGeneralJournalInternal)
  const {setStartDate, setEndDate, setStatusFilter, setEventFilter, setSearchTerm, resetFilterGeneralJournal} = filterGeneralJournalInternalSlice.actions
  useEffect(() => {
    if (statusFilter === null) {
      dispatch(setStatusFilter('FINALIZE'))
      dispatch(setEventFilter('Agregasi'))
    }
  }, [statusFilter])


  useEffect(() => {
    if (statusFilter === 'FINALIZE') {
      if (eventFilter === 'Agregasi') {
        dispatch(fetchGeneralJournalByEventAllInternal(startDate, endDate))
      } else if (eventFilter === 'Non Agregasi') {
        dispatch(fetchGeneralJournalByEventPerDayInternal(startDate, endDate))
      }
    }

    if (statusFilter === 'DRAF') {
      dispatch(fetchGeneralJournalDrafInternal())
    } 

    if (statusFilter === 'VOID') {
      dispatch(fetchGeneralJournalVoidInternal(startDate, endDate))
    }
  }, [startDate, endDate, statusFilter])

  useEffect(() => {
    if (eventFilter == 'Agregasi') {
        dispatch(fetchGeneralJournalByEventAllInternal(startDate, endDate))
    } 
    if (eventFilter === 'Non Agregasi') {
        dispatch(fetchGeneralJournalByEventPerDayInternal(startDate, endDate))
    }
  }, [eventFilter])

  console.log(journalDataAgregasi)
  console.log('non:', journalDataNonAgregasi)

  // Get status icon and color
  const getStatusConfig = (status) => {
    switch (status) {
      case 'FINALIZE':
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Finalize' };
      case 'DRAF':
        return { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Draf' };
      case 'VOID':
        return { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Void' };
      default:
        return { icon: AlertTriangle, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Unknown' };
    }
  };

  // Filter data
  // const activeJournalData = eventFilter === 'Non Agregasi' ? journalDataAgregasi : journalDataNonAgregasi;
  const filteredDataNonAgregasi = useMemo(() => {
    return journalDataNonAgregasi.filter(entry => {
      const matchStatus = !statusFilter || entry.accounts.some(acc => acc.action === statusFilter);
      const matchSearch = !searchTerm || 
        entry.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.accounts.some(acc => 
          acc.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          acc.account_code.includes(searchTerm)
        );
  
      return matchStatus && matchSearch;
    });
  }, [journalDataNonAgregasi, statusFilter, searchTerm]);
  
  
  // Calculate totals
  const totals = useMemo(() => {
  let totalDebit = 0;
  let totalKredit = 0;
  
  // Debug: tambahkan console.log untuk melihat data
  console.log('eventFilter:', eventFilter);
  console.log('journalDataNonAgregasi length:', journalDataNonAgregasi?.length || 0);
  console.log('journalDataAgregasi length:', journalDataAgregasi?.length || 0);
  
  if (eventFilter === 'Non Agregasi') {
    journalDataNonAgregasi.forEach(entry => {
      entry.accounts.forEach(acc => {
        if (acc.type === 'DEBIT') {
          totalDebit += acc.amount;
        } else if (acc.type === 'KREDIT') {
          totalKredit += acc.amount;
        }
      });
    });
  }
  
  if (eventFilter === 'Agregasi') {
    journalDataAgregasi.forEach(entry => {
      entry.accounts.forEach(acc => {
        // Hapus pengecekan acc.action karena semua data sudah FINALIZE
        if (acc.type === 'DEBIT') {
          totalDebit += acc.amount;
        } else if (acc.type === 'KREDIT') {
          totalKredit += acc.amount;
        }
      });
    });
  }
  
  // Debug: tampilkan hasil perhitungan
  console.log('Final totals:', { totalDebit, totalKredit });
  
  return { totalDebit, totalKredit };
}, [journalDataNonAgregasi, journalDataAgregasi, eventFilter]);

// Alternatif: Jika ingin menghitung keduanya sekaligus
const totalsAlternative = useMemo(() => {
  let totalDebit = 0;
  let totalKredit = 0;
  
  // Hitung Non Agregasi
  if (eventFilter === 'Non Agregasi' && journalDataNonAgregasi) {
    journalDataNonAgregasi.forEach(entry => {
      entry.accounts.forEach(acc => {
        if (acc.type === 'DEBIT') {
          totalDebit += acc.amount;
        } else if (acc.type === 'KREDIT') {
          totalKredit += acc.amount;
        }
      });
    });
  }
  
  // Hitung Agregasi
  if (eventFilter === 'Agregasi' && journalDataAgregasi) {
    journalDataAgregasi.forEach(entry => {
      entry.accounts.forEach(acc => {
        if (acc.type === 'DEBIT') {
          totalDebit += acc.amount;
        } else if (acc.type === 'KREDIT') {
          totalKredit += acc.amount;
        }
      });
    });
  }
  
  return { totalDebit, totalKredit };
}, [journalDataNonAgregasi, journalDataAgregasi, eventFilter]);


  // Get unique events for filter
  const uniqueEvents = ["Agregasi", 'Non Agregasi']

  // handle status filtered
  const [isDataEmpty, setDataEmpty] = useState(false);
  useEffect(() => {
    const dataMap = {
      'FINALIZE': journalDataAgregasi.length === 0 && journalDataNonAgregasi.length === 0,
      'DRAF': journalDataDraf.length === 0,
      'VOID': journalDataVoid.length === 0,
    };
  
    setDataEmpty(dataMap[statusFilter || ''] || false);
  }, [statusFilter, journalDataAgregasi, journalDataNonAgregasi, journalDataDraf, journalDataVoid]);



  // handle Draf To void general journal 
  const [modelConfirmVoid, setModelConfirmVoid] = useState(false)
  const {resetVoidGeneralJournal} = voidGeneralJournalInternalSlice.actions
  const {successVoidGeneralJournal, errorVoidGeneralJournal} = useSelector((state) => state.voidGeneralJournalInternalState)

  const {resetDataDrafToVoid} = dataDrafToVoidInternalSlice.actions
  const {dataDrafToVoid} = useSelector((state) => state.persisted.dataDrafToVoidInternal)
  
  const handeSubmitVoid = () => { 
    dispatch(voidGeneralJournalInternal(dataDrafToVoid))
  }

  console.log("data voidddd: ", dataDrafToVoid)

 
  useEffect(() => {
    if (errorVoidGeneralJournal) {
      setModelConfirmVoid(false)
      dispatch(resetDataDrafToVoid())
    }
  }, [errorVoidGeneralJournal])


  const handleConfirmModelVoid = () => {
    setModelConfirmVoid(true)
  }

  const handleCloseConfirmModelVoid = () => {
    setModelConfirmVoid(false)
  }

  useEffect(() => {
    if (successVoidGeneralJournal) {
      setModelConfirmVoid(false)
      dispatch(resetVoidGeneralJournal())
      dispatch(resetDataDrafToVoid())
    }
  }, [successVoidGeneralJournal])
  

  const handleDivDateClick = () => {
    if (statusFilter !== "DRAF" && dateInputRef.current) {
      dateInputRef.current.showPicker(); // Untuk browser modern
      // Atau gunakan: dateInputRef.current.focus();
    }
  };


  // VALIDATE DATE RANGE  
  const maxRangeDays = 7;
  const [isDateRangeInvalid, setIsDateRangeInvalid] = useState(false);
  
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    // Validasi hanya dilakukan jika endDate sudah diisi
    if (endDate && !validateDateRange(newStartDate, endDate, maxRangeDays, setIsDateRangeInvalid)) return;
    dispatch(setStartDate(newStartDate));
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    if (startDate && !validateDateRange(startDate, newEndDate, maxRangeDays, setIsDateRangeInvalid)) return;
    dispatch(setEndDate(newEndDate));
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">        

        { modelConfirmVoid && (
          <VoidJournalConfirmationModal onConfirm={handeSubmitVoid} onCancel={handleCloseConfirmModelVoid} journalName={'Void'}/>
        )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-lg">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Journal Umum</h1>
                <p className="text-gray-600">Kelola catatan jurnal akuntansi</p>
              </div>
            </div>
            <button onClick={() => navigate('/internal/admin/general-journal/form')} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <Plus className="h-4 w-4" />
              <span>Tambah Entry</span>
            </button>
          </div>
        </div>

        {/* Filters & Stats Combined */}
        <div className="bg-white rounded-lg shadow-sm mb-4">
          {/* Filter Section */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Date Filter */}
              <div className='relative'>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Periode:</label>
                  <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        className={`pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent w-30 ${
                          statusFilter === "DRAF" ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                        disabled={statusFilter === "DRAF"} 
                      />
                  </div>
                  <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Sampai:</span>
                  <div className="relative">
                    <input
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      className={`pl-3 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent w-30 ${
                        statusFilter === "DRAF" ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      disabled={statusFilter === "DRAF"} 
                    />
                  </div>
                </div>
                {isDateRangeInvalid && (
                  <div className="text-xs text-red-500 absolute">
                    Tanggal tidak valid. Maksimal {maxRangeDays} hari dan tidak boleh lebih.
                  </div>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => dispatch(setStatusFilter(e.target.value))}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent w-32"
                >
                  <option value="FINALIZE">Finalize</option>
                  <option value="DRAF">Draf</option>
                  <option value="VOID">Void</option>
                </select>
              </div>

              {/* Event Filter */}
              { statusFilter === 'FINALIZE' &&  (
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Event</label>
                  <select
                    value={eventFilter}
                    onChange={(e) => dispatch(setEventFilter(e.target.value))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent w-36"
                  >
                    {uniqueEvents.map(event => (
                      <option key={event} value={event}>{event}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Search */}
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan event, transaction ID, atau akun..."
                    value={searchTerm}
                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          { statusFilter === 'FINALIZE' && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                  <div>
                    <p className="text-sm font-medium text-green-700">Total Debit</p>
                    <p className="text-xl font-bold text-green-800">{formatCurrency(totals.totalDebit)}</p>
                  </div>
                  <div className="bg-green-200 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-700" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Total Kredit</p>
                    <p className="text-xl font-bold text-blue-800">{formatCurrency(totals.totalKredit)}</p>
                  </div>
                  <div className="bg-blue-200 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div>
                    <p className="text-sm font-medium text-purple-700">Total Entries</p>
                    <p className="text-xl font-bold text-purple-800">{eventFilter === 'Agregasi' ? journalDataAgregasi.length : journalDataNonAgregasi.length}</p>
                  </div>
                  <div className="bg-purple-200 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-purple-700" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        { ((statusFilter === 'DRAF' && journalDataDraf.length > 0) || (eventFilter === 'Agregasi' && journalDataAgregasi.length > 0) || 
          (eventFilter === 'Non Agregasi' &&journalDataNonAgregasi.length > 0)) && (
          <div className="text-sm text-red-800 rounded mb-3">
              Menampilkan data untuk <strong>hari ini</strong>
          </div>
        )}


        {/* Journal Entries */}
        <div className="space-y-6">
          {spinnerRelative ? (
            <div className="bg-white rounded-lg h-[70vh] shadow-sm p-12 flex items-center justify-center">
              <SpinnerRelative />
            </div>
          ) : (
            <>
              {  isDataEmpty ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <FileText className="h-10 w-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {startDate === endDate && startDate === new Date().toISOString().split('T')[0]
                        ? "Belum Ada Jurnal Hari Ini"
                        : "Tidak Ada Data Jurnal"}
                    </h3>
                    <div className="max-w-md mx-auto space-y-2">
                    <p className="text-gray-600 leading-relaxed">
                        {startDate === endDate && startDate === new Date().toISOString().split('T')[0]
                        ? "Anda belum memiliki catatan jurnal untuk hari ini. Mulai dengan membuat entry jurnal pertama Anda."
                        : statusFilter 
                            ? `Tidak ada entry journal dengan status "${statusFilter}" yang sesuai dengan filter yang dipilih.`
                            : "Tidak ada entry journal yang sesuai dengan kriteria pencarian Anda."}
                    </p>
                
                    {startDate === endDate && startDate === new Date().toISOString().split('T')[0] && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 rounded-full p-1">
                            <Clock className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="text-left">
                            <p className="text-sm font-medium text-blue-800">Tips Jurnal Harian</p>
                            <p className="text-sm text-blue-700 mt-1">
                                Catat setiap transaksi bisnis Anda secara real-time untuk laporan keuangan yang akurat.
                            </p>
                            </div>
                        </div>
                        </div>
                    )}
                    </div>
                    <button onClick={() => navigate('/internal/admin/general-journal/form')} className="mt-6 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors shadow-sm">
                    <Plus className="h-4 w-4" />
                    <span>Buat Entry Pertama</span>
                    </button>
                </div>
              ) : (
                <>
                  { statusFilter === 'FINALIZE' ? (
                    eventFilter === 'Agregasi' ? (
                      // Render data Agregasi
                      Object.entries(groupedDataAgregasi).map(([event, entries], index) => (
                        <div key={event} className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="bg-gray-800 flex justify-between px-6 py-4">
                            <h4 className="text-lg font-semibold text-white capitalize">
                              {event.replace('_', ' ')}{' '}
                            </h4>
                          </div>
                          
                          <div className="divide-y divide-gray-200">
                            {entries.map((entry, entryIndex) => {
                              const statusConfig = getStatusConfig('FINALIZE');
                              const StatusIcon = statusConfig.icon;
                              
                              // Sort accounts: DEBIT first, then KREDIT
                              const sortedAccounts = [...entry.accounts].sort((a, b) => {
                                if (a.type === 'DEBIT' && b.type === 'KREDIT') return -1;
                                if (a.type === 'KREDIT' && b.type === 'DEBIT') return 1;
                                return 0;
                              });
                              
                              return (
                                <div key={entryIndex} className="p-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                      <div className={`${statusConfig.bgColor} p-2 rounded-full`}>
                                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                                      </div>
                                      <div>
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium text-gray-900">{entry.date}</span>
                                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                                            {statusConfig.label}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="border-b border-gray-200">
                                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Kode Akun</th>
                                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Nama Akun</th>
                                          <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Debit</th>
                                          <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Kredit</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {sortedAccounts.map((account, accIndex) => (
                                          <tr key={accIndex} className="border-b border-gray-100 last:border-b-0">
                                            <td className="py-3 px-3 text-sm font-mono text-gray-600">{account.account_code}</td>
                                            <td className="py-3 px-3 text-sm text-gray-900">{account.account_name}</td>
                                            <td className="py-3 px-3 text-sm text-right font-medium">
                                              {account.type === 'DEBIT' ? (
                                                <span className="text-green-600">{formatCurrency(account.amount)}</span>
                                              ) : (
                                                <span className="text-gray-400">-</span>
                                              )}
                                            </td>
                                            <td className="py-3 px-3 text-sm text-right font-medium">
                                              {account.type === 'KREDIT' ? (
                                                <span className="text-blue-600">{formatCurrency(account.amount)}</span>
                                              ) : (
                                                <span className="text-gray-400">-</span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      // Render data Non Agregasi
                      Object.entries(groupedDataNonAgregasi).map(([event, entries], index) => (
                        <div key={event} className="bg-white rounded-lg shadow-sm overflow-hidden">
                          <div className="bg-gray-800 flex justify-between px-6 py-4">
                            <h4 className="text-lg font-semibold text-white capitalize">
                              {event.replace('_', ' ')}{' '}
                            </h4>
                          </div>
                          
                          <div className="divide-y divide-gray-200">
                            {entries.map((entry, entryIndex) => {
                              const status = entry.accounts[0]?.action || 'UNKNOWN';
                              const statusConfig = getStatusConfig('FINALIZE'); // Non agregasi selalu FINALIZE
                              const StatusIcon = statusConfig.icon;
                              
                              // Sort accounts: DEBIT first, then KREDIT
                              const sortedAccounts = [...entry.accounts].sort((a, b) => {
                                if (a.type === 'DEBIT' && b.type === 'KREDIT') return -1;
                                if (a.type === 'KREDIT' && b.type === 'DEBIT') return 1;
                                return 0;
                              });
                              
                              return (
                                <div key={entryIndex} className="p-6">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                      <div className={`${statusConfig.bgColor} p-2 rounded-full`}>
                                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                                      </div>
                                      <div>
                                        <div className="flex items-center space-x-2">
                                          <span className="font-medium text-gray-900">{entry.date}</span>
                                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}>
                                            {statusConfig.label}
                                          </span>
                                        </div>
                                        {entry.transaction_id && (
                                          <p className="text-sm text-gray-600">ID: {entry.transaction_id}</p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="border-b border-gray-200">
                                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Kode Akun</th>
                                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Nama Akun</th>
                                          <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Debit</th>
                                          <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Kredit</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {sortedAccounts.map((account, accIndex) => (
                                          <tr key={accIndex} className="border-b border-gray-100 last:border-b-0">
                                            <td className="py-3 px-3 text-sm font-mono text-gray-600">{account.account_code}</td>
                                            <td className="py-3 px-3 text-sm text-gray-900">{account.account_name}</td>
                                            <td className="py-3 px-3 text-sm text-right font-medium">
                                              {account.type === 'DEBIT' ? (
                                                <span className="text-green-600">{formatCurrency(account.amount)}</span>
                                              ) : (
                                                <span className="text-gray-400">-</span>
                                              )}
                                            </td>
                                            <td className="py-3 px-3 text-sm text-right font-medium">
                                              {account.type === 'KREDIT' ? (
                                                <span className="text-blue-600">{formatCurrency(account.amount)}</span>
                                              ) : (
                                                <span className="text-gray-400">-</span>
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    )
                  ) : (statusFilter === 'DRAF' ?  (
                    <DrafVoidDataComponent drafData={journalDataDraf}  typeComponent={"DRAF"} handleConfirmModelVoid={handleConfirmModelVoid}/>
                  ) : (
                    statusFilter === 'VOID' && (
                    <DrafVoidDataComponent drafData={journalDataVoid} typeComponent={"VOID"}/>
                    )
                  )) }
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};