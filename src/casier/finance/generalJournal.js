import React, { useState, useMemo, useEffect, useRef, use, useCallback } from 'react';
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
  AlertTriangle,
  BookText,
  Maximize,
  Minimize,
  Menu,
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
  loadMoreGeneralJournalNonAgregasi,
  loadMoreGeneralJournalVoidInternal,
  navbarInternalSlice,
} from '../../reducers/reducers'
import {
  getGeneralJournalByEventPerDayInternalSlice
} from '../../reducers/get.js'
import { SpinnerRelative } from '../../helper/spinner';
import {
  fetchGeneralJournalByEventAllInternal, 
  fetchGeneralJournalByEventPerDayInternal, 
  fetchGeneralJournalVoidInternal, 
  fetchGeneralJournalDrafInternal,
} from '../../actions/get';
import {formatCurrency, useInfiniteScroll, useFullscreen, useElementHeight} from '../../helper/helper'
import {DateFilterComponent,validateDateRange} from '../../helper/formatdate';
import { set } from 'date-fns';
 
export default function GeneralJournalDashboard() {
    const [activeMenu, setActiveMenu] = useState("general-journal")
    const dispatch = useDispatch()

    // maxsimaz minimaz layar
    const contentRef = useRef(null);
    const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);

    // handle sidebar and elemant header yang responsice
    const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)


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
      <div className="flex relative">
        {errorAllertVoid && (

          <ErrorAlert 
          message={"There was an error on the internal server, we are fixing it."}
          onClose={() => setErrorAlertVoid(false)}
          />
        )}

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
            <JournalDashboard
            isFullScreen={isFullScreen}
            fullscreenchange={toggleFullScreen}
            />
        </div>
      </div>
    )
}

const JournalDashboard = ({isFullScreen, fullscreenchange}) => {
  const dateInputRef = useRef(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [spinnerRelative, setSpinnerRelative] = useState(false)

  // data general journal status finisize 
  const {resetGeneralJournalEventPerDayPagination} = getGeneralJournalByEventPerDayInternalSlice.actions
  const {
    dataGeneralJournalByEventPerDayInternal : journalDataNonAgregasi,
    loadingGeneralJournalByEventPerDayInternal = false,
    page: pageJournalNonAgregasi,
    hasMore: hasMoreJournalNonAgregasi,
    isLoadMore: isLoadMoreNonAgregasi,
    totalEntry: totalEntryNonAgregasi = 0,
    totalKredit: totalKreditNonAgregasi = 0,
    totalDebet: totalDebetNonAgregasi = 0,
  } = useSelector((state) => state.persisted.getGeneralJournalByEventPerDayInternal)
  useEffect(() => {
    setSpinnerRelative(loadingGeneralJournalByEventPerDayInternal)
  }, [loadingGeneralJournalByEventPerDayInternal])


  // data general journal status finisize event agregasi
  const { dataGeneralJournalByEventAllInternal : journalDataAgregasi, loadingGeneralJournalByEventAllInternal} = useSelector((state) => state.persisted.getGeneralJournalByEventInternal)
  useEffect(() => {
    setSpinnerRelative(loadingGeneralJournalByEventAllInternal)
  }, [loadingGeneralJournalByEventAllInternal])

  // general journal data draf
  const {
    dataGeneralJournalDrafInternal : journalDataDraf, 
    loadingGeneralJournalDrafInternal = false,
  } = useSelector((state) => state.persisted.getGeneralJournalDrafInternal)
  useEffect(() => {
    setSpinnerRelative(loadingGeneralJournalDrafInternal )
  }, [loadingGeneralJournalDrafInternal])


  // general journal data void
  const {
    dataGeneralJournalVoidInternal : journalDataVoid, 
    loadingGeneralJournalVoidInternal = false, 
    page: pageJournalVoid = 1,
    hasMore: hasMoreJournalVoid = false,
    isLoadMore: isLoadMoreJournalVoid = false,
  } = useSelector((state) => state.persisted.getGeneralJournalVoidInternal)
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
    if (statusFilter === 'FINALIZE') {
        if (eventFilter === 'Agregasi') {
          if (journalDataAgregasi.length === 0) {
            dispatch(fetchGeneralJournalByEventAllInternal('', ''))
          }
        } else if (eventFilter === 'Non Agregasi') {
          if (journalDataNonAgregasi.length === 0) {
            dispatch(fetchGeneralJournalByEventPerDayInternal('', '', 1, false))
          }
        }
      }

      if (statusFilter === 'DRAF') {
        if (journalDataDraf.length === 0) {
          dispatch(fetchGeneralJournalDrafInternal())
        }
      } 

      if (statusFilter === 'VOID') {
        if (journalDataVoid.length === 0) {
          dispatch(fetchGeneralJournalVoidInternal('', '', 1, false))
        }
      }
  }, [])

  // handle ketika sebelumny fetch data menggunkan date maka hapus filter
  useEffect(() => {
    if ((startDate === '' && endDate !== '') || (startDate !== '' && endDate === '')) {
      dispatch(fetchGeneralJournalByEventAllInternal('', ''))
      dispatch(fetchGeneralJournalByEventPerDayInternal('', '', 1, false))
      dispatch(fetchGeneralJournalVoidInternal('', '', 1, false))
    }
  }, [startDate, endDate])

  useEffect(() => {
    if (statusFilter === 'FINALIZE') {
        if (eventFilter === 'Agregasi') {
          if (journalDataAgregasi.length === 0) {
            dispatch(fetchGeneralJournalByEventAllInternal(startDate, endDate))
          }
        } else if (eventFilter === 'Non Agregasi') {
          if (journalDataNonAgregasi.length === 0) {
            dispatch(fetchGeneralJournalByEventPerDayInternal(startDate, endDate, 1, false))
          }
        }
      }

      if (statusFilter === 'DRAF') {
        if (journalDataDraf.length === 0) {
          dispatch(fetchGeneralJournalDrafInternal())
        }
      } 

      if (statusFilter === 'VOID') {
        if (journalDataVoid.length === 0) {
          dispatch(fetchGeneralJournalVoidInternal(startDate, endDate, 1, false))
        }
      }
  }, [statusFilter, eventFilter])

  useEffect(() => {
    if (startDate !== '' && endDate !== '') {
      if (statusFilter === 'FINALIZE') {
        if (eventFilter === 'Agregasi') {
            dispatch(fetchGeneralJournalByEventAllInternal(startDate, endDate))
        } else if (eventFilter === 'Non Agregasi') {
            dispatch(fetchGeneralJournalByEventPerDayInternal(startDate, endDate, 1, false))
        }
      }

      if (statusFilter === 'VOID') {
          dispatch(fetchGeneralJournalVoidInternal(startDate, endDate, 1, false))
      } 
    } 
  }, [startDate, endDate, eventFilter, statusFilter])


  const handleResetFilter = () => {
    dispatch(fetchGeneralJournalVoidInternal('', '', 1, false))
    dispatch(fetchGeneralJournalByEventAllInternal('', '', 1, false))
    dispatch(fetchGeneralJournalByEventPerDayInternal('', '', 1, false))
    dispatch(setEndDate(''))
    dispatch(setStartDate(''))
  }

  console.log(journalDataAgregasi)
  console.log('non:', journalDataNonAgregasi)

  // handle load more data non agregasi
  const handleLoadMoreJournalNonAgregasiCallback = useCallback(() => {
    // ✅ Fix: Kondisi yang lebih sederhana dan jelas
    if (eventFilter === 'Non Agregasi' && 
        hasMoreJournalNonAgregasi && 
        !isLoadMoreNonAgregasi && 
        !loadingGeneralJournalByEventPerDayInternal) {
        
        console.log("Triggering load more from useEffect");
        dispatch(loadMoreGeneralJournalNonAgregasi());
    }
  }, [eventFilter, hasMoreJournalNonAgregasi, isLoadMoreNonAgregasi, loadingGeneralJournalByEventPerDayInternal, dispatch])

  // ✅ IMPROVED INFINITE SCROLL HOOK
  const { ref: loadMoreGeneralJournalNonAgregasiRef } = useInfiniteScroll({
      hasMore: hasMoreJournalNonAgregasi,
      loading: isLoadMoreNonAgregasi || loadingGeneralJournalByEventPerDayInternal,
      loadMore: handleLoadMoreJournalNonAgregasiCallback,
      threshold: 1.0,
      rootMargin: '100px',
  })

  
  // handle load more general journal void
  const loadMoreJournalVoidCallback = useCallback(() => {
    if (statusFilter === 'VOID' && hasMoreJournalVoid && !isLoadMoreJournalVoid) {
      dispatch(loadMoreGeneralJournalVoidInternal())
    } 
  }, [statusFilter, hasMoreJournalVoid, isLoadMoreJournalVoid, dispatch])

  const { ref: loadMoreJournalVoidRef } = useInfiniteScroll({
    hasMore: hasMoreJournalVoid,
    loading: isLoadMoreJournalVoid,
    loadMore: loadMoreJournalVoidCallback,
    threshold: 1.0,
    rootMargin: '100px',
  })

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
  
  
  // Calculate totals
  const totals = useMemo(() => {
  let totalDebit = 0;
  let totalKredit = 0;
  
  // Debug: tambahkan console.log untuk melihat data
  console.log('eventFilter:', eventFilter);
  console.log('journalDataNonAgregasi length:', journalDataNonAgregasi?.length || 0);
  console.log('journalDataAgregasi length:', journalDataAgregasi?.length || 0);
  
  if (eventFilter === 'Non Agregasi') {
    totalDebit = totalDebetNonAgregasi
    totalKredit = totalKreditNonAgregasi
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
// const totalsAlternative = useMemo(() => {
//   let totalDebit = 0;
//   let totalKredit = 0;
  
//   // Hitung Non Agregasi
//   if (eventFilter === 'Non Agregasi' && journalDataNonAgregasi) {
//     journalDataNonAgregasi.forEach(entry => {
//       entry.accounts.forEach(acc => {
//         if (acc.type === 'DEBIT') {
//           totalDebit += acc.amount;
//         } else if (acc.type === 'KREDIT') {
//           totalKredit += acc.amount;
//         }
//       });
//     });
//   }
  
//   // Hitung Agregasi
//   if (eventFilter === 'Agregasi' && journalDataAgregasi) {
//     journalDataAgregasi.forEach(entry => {
//       entry.accounts.forEach(acc => {
//         if (acc.type === 'DEBIT') {
//           totalDebit += acc.amount;
//         } else if (acc.type === 'KREDIT') {
//           totalKredit += acc.amount;
//         }
//       });
//     });
//   }
  
//   return { totalDebit, totalKredit };
// }, [journalDataNonAgregasi, journalDataAgregasi, eventFilter]);


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
    setIsDateRangeInvalid(false); // Reset validasi saat endDate diubah
  };

  const isMissingDate = startDate === '' || endDate === '';
  const shouldShowInfoToday =
  isMissingDate &&
  (
    (eventFilter === 'Agregasi' && journalDataAgregasi.length > 0) ||
    (eventFilter === 'Non Agregasi' && journalDataNonAgregasi.length > 0) ||
    (statusFilter === 'VOID' && journalDataVoid.length > 0)
  );


  // handle sidebar and elemant header yang responsice
  const { ref: headerRef, height: headerHeight } = useElementHeight();
  const { setIsOpen } = navbarInternalSlice.actions
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

  return (
    <div className="min-h-screen bg-gray-50">        

        { modelConfirmVoid && (
          <VoidJournalConfirmationModal onConfirm={handeSubmitVoid} onCancel={handleCloseConfirmModelVoid} journalName={'Void'}/>
        )}
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
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Journal Umum</h1>
                <p className="text-gray-600 text-xs">Kelola catatan jurnal akuntansi</p>
              </div>
            </div>

            <div className='flex space-x-3'>
              <button onClick={() => navigate('/internal/admin/general-journal/form')} className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus className="h-3 w-3" />
                <span>Tambah Entry</span>
              </button>
              <button onClick={() => fullscreenchange()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors hover:scale-105">
               {isFullScreen ? <Minimize className="w-7 h-7 text-gray-600" /> : <Maximize className="w-7 h-7 text-gray-600" />}
              </button>
              { isMobileDeviceType && !isFullScreen && (
                <button 
                  onClick={() => dispatch(setIsOpen(true))}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className='p-4' style={{marginTop: headerHeight}}>
          {/* Filters & Stats Combined */}
          <div className="bg-white rounded-lg shadow-sm mb-4">
            {/* Filter Section */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex  justify-between flex-col lg:flex-row lg:items-center gap-4">
                {/* Date Filter */}
                <div className='relative'>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Periode:</label>
                    <div className="relative">
                        <input
                          type="date"
                          value={statusFilter !== 'DRAF' ? startDate || '' : ''}
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
                        value={statusFilter !== 'DRAF' ? endDate || '' : ''}
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
                <div className='flex space-x-2'>
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
                      <p className="text-xl font-bold text-purple-800">{eventFilter === 'Agregasi' ? journalDataAgregasi.length : totalEntryNonAgregasi}</p>
                    </div>
                    <div className="bg-purple-200 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-purple-700" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          { shouldShowInfoToday &&  (
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
                  <div className="relative -white rounded-lg shadow-xl border border-gray-100 overflow-hidden flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5 pointer-events-none">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gray-800 rounded-full translate-x-12 -translate-y-12"></div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gray-800 rounded-full -translate-x-8 translate-y-8"></div>
                    </div>

                    {/* Floating Dots */}
                    <div className="absolute top-6 left-6 w-2 h-2 bg-gray-300 rounded-full animate-ping"></div>
                    <div className="absolute top-12 right-10 w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 left-14 w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>

                    {/* Main Content */}
                    <div className="relative z-10 text-center flex flex-col items-center gap-6">
                      {/* Icon */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg group hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <BookText className="w-8 h-8 sm:w-10 sm:h-10 text-gray-800 group-hover:text-gray-700 transition-colors duration-300" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-800 rounded-full opacity-20 animate-pulse"></div>
                        {/* Decorative Rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 border border-gray-200 rounded-full animate-pulse"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 sm:w-36 sm:h-36 border border-gray-100 rounded-full animate-pulse animation-delay-700"></div>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                        Tidak Ada Jurnal Umum
                      </h2>

                      {/* Description */}
                      <p className="text-gray-600 text-base text-md leading-relaxed max-w-md sm:max-w-lg">
                        Belum ada jurnal yang tercatat untuk periode ini. Silakan tambahkan jurnal baru atau periksa filter tanggal.
                      </p>

                      {/* CTA Button */}
                      <button className="group relative bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-6 rounded-2xl transition duration-300 transform hover:scale-105 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50">
                        <div className="flex items-center justify-center space-x-2">
                          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                          <span>Tambah Jurnal</span>
                        </div>
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white to-transparent -skew-x-12 group-hover:animate-shimmer"></div>
                      </button>

                      {/* Footer text */}
                      <p className="text-gray-600 text-base text-sm">
                        Atau periksa kembali periode atau status jurnal yang dipilih
                      </p>
                    </div>

                    {/* Soft Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/20 via-transparent to-gray-100/20 pointer-events-none"></div>

                    {/* Custom Animation */}
                    <style jsx>{`
                      @keyframes shimmer {
                        0% {
                          transform: translateX(-100%) skewX(-12deg);
                        }
                        100% {
                          transform: translateX(200%) skewX(-12deg);
                        }
                      }
                      .animate-shimmer {
                        animation: shimmer 1.5s ease-in-out;
                      }
                      .animation-delay-700 {
                        animation-delay: 700ms;
                      }
                    `}</style>
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
                        <>
                        {Object.entries(groupedDataNonAgregasi).map(([event, entries], index) => (
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
                        ))}

                        {eventFilter === 'Non Agregasi' && (
                          <div
                            ref={loadMoreGeneralJournalNonAgregasiRef}
                            className="w-full h-10 flex items-center justify-center px-2 sm:px-4"
                          >
                            {isLoadMoreNonAgregasi && (
                              <div className="flex items-center gap-2 py-2">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500"></div>
                                <span className="text-sm text-gray-500 whitespace-nowrap">Loading more data...</span>
                              </div>
                            )}
                            {!hasMoreJournalNonAgregasi && journalDataNonAgregasi.length > 0 && (
                              <div className="py-2 text-sm text-gray-500 text-center">
                                No more data to load
                              </div>
                            )}
                          </div>
                        )}

                        </>
                    )) : (statusFilter === 'DRAF' ?  (
                      <DrafVoidDataComponent drafData={journalDataDraf}  typeComponent={"DRAF"} handleConfirmModelVoid={handleConfirmModelVoid}/>
                    ) : (
                      statusFilter === 'VOID' && (
                        <>
                          <DrafVoidDataComponent drafData={journalDataVoid} typeComponent={"VOID"}/>
                          {journalDataVoid.length > 0 && (
                            <div
                              ref={loadMoreJournalVoidRef}
                              className="w-full h-10 flex items-center justify-center px-2 sm:px-4"
                            >
                              {isLoadMoreJournalVoid && (
                                <div className="flex items-center gap-2 py-2">
                                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-500"></div>
                                  <span className="text-sm text-gray-500 whitespace-nowrap">Loading more data...</span>
                                </div>
                              )}
                              {!hasMoreJournalVoid && journalDataVoid.length > 0 && (
                                <div className="py-2 text-sm text-gray-500 text-center">
                                  No more data to load
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )
                    )) }
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};