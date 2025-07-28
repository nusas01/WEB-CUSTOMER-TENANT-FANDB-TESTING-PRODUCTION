import { useState, useRef, useCallback, useEffect } from "react"
import { TrendingUp, Clock, Banknote, CreditCard, Menu, Minimize, Maximize, RefreshCw, Filter, Search, History,  ScanBarcode, Bell, Settings, CalendarRange } from "lucide-react"
import { useNavigate } from "react-router-dom"
import FilterPanel from "./dateFilter"
import { useDispatch, useSelector } from "react-redux"
import { 
  SpinnerRelative, 
  SpinnerFixed, 
  BottomLoadingIndicator,
} from "../helper/spinner"
import { 
    fetchTransactionCashOnGoingInternal,
    fetchTransactionNonCashOnGoingInternal, 
    checkTransactionNonCashInternal,
    fetchTransactionHistory,
    fetchSearchTransactionInternal,
 } from "../actions/get"
import {
    buyTransactionCashOnGoingInternalSlice,

} from "../reducers/patch"
import { navbarInternalSlice } from "../reducers/reducers"
import { 
    buyTransactionCashOnGoingInternal
} from "../actions/patch"
import { 
    transactionCashOnGoingInternalSlice, 
    transactionNonCashOnGoingInternalSlice,
    checkTransactionNonCashInternalSlice,
    dataFilteringTransactionHistorySlice,
    transactionHistoryInternalSlice,
    getSearchTransactionInternalSlice,
} from "../reducers/get" 
import { loadMoreTransactionHistory  } from "../reducers/reducers"
import { FormatDate } from "../helper/formatdate"
import { formatDate } from "date-fns"
import { CountDownRemoveData } from "../helper/countDown"
import { da } from "date-fns/locale"
import {ConfirmationModal, CashPaymentModal, ErrorAlert} from "./alert"
import { useInfiniteScroll, useElementHeight, useOutsideClick } from "../helper/helper"

const TransactionTable = ({isFullScreen, fullscreenchange}) => {
  const modalBayarRef = useRef(null)
  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState(false)
  const navigate = useNavigate()
  const [filterTransaction, setFilterTransaction] = useState("methodCash")   
  const [validationErrors, setValidationErrors] = useState({})
  const dispatch = useDispatch()
  const [spinner, setSpinner] = useState(false)
  const [spinnerRelatif, setSpinnerRelatif] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

   const [initialFetchDone, setInitialFetchDone] = useState({
    cash: false,
    nonCash: false,
    history: false
  });


    // get transaction cash on going
    const { removeTransactionCashOnGoingInternalById } = transactionCashOnGoingInternalSlice.actions
    const {dataTransactionCashInternal, errorTransactionCashInternal, loadingTransactionCashInternal} = useSelector((state) => state.persisted.transactionCashOnGoingInternal)
    useEffect(() => {
        setSpinnerRelatif(loadingTransactionCashInternal)
    }, [loadingTransactionCashInternal])

    useEffect(() => {
    if (!loadingTransactionCashInternal && 
        !initialFetchDone.cash && 
        (!dataTransactionCashInternal || dataTransactionCashInternal.length === 0)) {
      dispatch(fetchTransactionCashOnGoingInternal());
      setInitialFetchDone(prev => ({...prev, cash: true}));
    }
  }, [dataTransactionCashInternal, loadingTransactionCashInternal, initialFetchDone.cash]);
  console.log("data transaction cash: ", dataTransactionCashInternal)

    // get transaction non cash on going
    const { removeTransactionNonCashOnGoingInternalById } = transactionNonCashOnGoingInternalSlice.actions
    const {dataTransactionNonCashInternal, errorTransactionNonCashInternal, loadingTransactionNonCashInternal} = useSelector((state) => state.persisted.transactionNonCashOnGoingInternal)

    useEffect(() => {
        setSpinnerRelatif(loadingTransactionNonCashInternal)
    }, [loadingTransactionNonCashInternal])

    useEffect(() => {
        if (filterTransaction === "methodNonCash" && 
            !loadingTransactionNonCashInternal && 
            !initialFetchDone.nonCash && 
            (!dataTransactionNonCashInternal || dataTransactionNonCashInternal.length === 0)) {
        dispatch(fetchTransactionNonCashOnGoingInternal());
        setInitialFetchDone(prev => ({...prev, nonCash: true}));
        }
    }, [filterTransaction, dataTransactionNonCashInternal, loadingTransactionNonCashInternal, initialFetchDone.nonCash]);
    console.log("data transaction non cash:", dataTransactionNonCashInternal)


    // buy transaction cash on going
    const [ openModelBuyPaymentCash, setOpenModelBuyPaymentCash ] = useState(false)
    const { resetBuyTransactionCashOnGoingInternal } = buyTransactionCashOnGoingInternalSlice.actions
    const { successBuyTransactionCashOnGoing, errorBuyTransactionCashOnGoing, errorFieldBuyTransactionCashOnGoing, loadingBuyTransactionCashOnGoing } = useSelector((state) => state.buyTransactionCashOnGoingInternalState)
    const [ allertSuccessBuyTransactionCash, setAllertSuccessBuyTransactionCash] = useState(false)
    const [ allertErrorBuyTransactionCash, setAllertErrorBuyTransactionCash] = useState(false)
    const [dataPaymentCash, setDataPaymentCash] = useState({
        transaction_id: null,
        amount_price: 0,
        money_received: 0,
        open: false,
    })
    
    const handleBuyTransaction = () => {
        const data = {
            transaction_id: dataPaymentCash.transaction_id,
            money_received: dataPaymentCash.money_received,
        }
        dispatch(buyTransactionCashOnGoingInternal(data))
    }

    useEffect(() => {
        if (successBuyTransactionCashOnGoing) {
            setDataPaymentCash({
                transaction_id: null,
                amount_price: 0,
                money_received: 0,
                open: false, 
            })
            dispatch(removeTransactionCashOnGoingInternalById(successBuyTransactionCashOnGoing.id))
            setAllertSuccessBuyTransactionCash(true)
        }
    }, [successBuyTransactionCashOnGoing])

    useEffect(() => {
        if (errorBuyTransactionCashOnGoing || errorFieldBuyTransactionCashOnGoing) { 
            setDataPaymentCash({
                transaction_id: null,
                amount_price: 0, 
                money_received: 0,
                open: false, 
            })
            setAllertErrorBuyTransactionCash(true)
        }
    }, [errorBuyTransactionCashOnGoing, errorFieldBuyTransactionCashOnGoing])

    useEffect(() => {
        setSpinner(loadingBuyTransactionCashOnGoing)
        if (loadingBuyTransactionCashOnGoing) {
            setDataPaymentCash((prev) => ({
                ...prev,
                open: false,
            }))
        }
    }, [loadingBuyTransactionCashOnGoing])

    const handleOpenModelPaymentCash = (transactionId, amountPrice) => {
        setDataPaymentCash({
            open: true,
            transaction_id: transactionId,
            amount_price: amountPrice
        })
    }



    // check Transaction non cash to thired party
    const { resetCheckTransactionNonCash } = checkTransactionNonCashInternalSlice.actions
    const { checkTransactionNonCashId, statusCheckTransactionNonCash, loadingCheckTransactionNonCash } = useSelector((state) => state.checkTransactionNonCashInternalState)
    const [allertSuccessCheckTransactionNonCash, setAllertSuccessCheckTransactionNonCash] = useState(false)
    const [allertPendingCheckTransactionNonCash, setAllertPendingCheckTransactionNonCash] = useState(false)

    const handleCheckTransactionNonCash = (transactionId) => {
        const data = {
            transaction_id: transactionId,
        }
        dispatch(checkTransactionNonCashInternal(data))
    } 

    useEffect(() => {
        if (checkTransactionNonCashId && statusCheckTransactionNonCash === "PAID") {
            dispatch(removeTransactionNonCashOnGoingInternalById(checkTransactionNonCashId))
            setAllertSuccessCheckTransactionNonCash(true)
        } else if (checkTransactionNonCashId && statusCheckTransactionNonCash === "PENDING") {
            setAllertPendingCheckTransactionNonCash(true)
        }
    }, [checkTransactionNonCashId, statusCheckTransactionNonCash])

    useEffect(() => {
        setSpinner(loadingCheckTransactionNonCash)
    }, [loadingCheckTransactionNonCash])




    // handle history transaction by selecting filter
    const {resetTransactionHitoryInternal} = transactionHistoryInternalSlice.actions
    const {setData, setIncrementPage, resetData} = dataFilteringTransactionHistorySlice.actions
    const {method, status, startDate, endDate, startTime, endTime , page} = useSelector((state) => state.persisted.dataFilteringTransactionHistoryState)
    const {
    dataTransactionHistoryInternal,
    loadingTransactionHistoryInternal,
    hasMore,
    totalCount: totalCountFilter,
    totalRevenue: totalRevenueFilter,
  } = useSelector((state) => state.persisted.transactionHistoryInternal);

  useEffect(() => {
    if (dataTransactionHistoryInternal.length > 0) {
      setTotalCount(totalCountFilter)
      setTotalAmount(totalRevenueFilter)
    }
  }, [totalCountFilter, totalRevenueFilter])

  const loadMoreCallback = useCallback(() => {
    if (filterTransaction === "methodFilterTransaction") {
      dispatch(setIncrementPage());
      dispatch(loadMoreTransactionHistory());
    }
  }, [filterTransaction]);

  // Hook untuk infinite scroll
  const { ref: loadMoreRef } = useInfiniteScroll({
    hasMore,
    loading: loadingTransactionHistoryInternal,
    loadMore: loadMoreCallback,
    threshold: 0.1,
    rootMargin: '50px'
  });

  // hook untuk infinite scroll mobile devaci
  const observerRef = useRef(null);

 useEffect(() => {
   if (loadingTransactionHistoryInternal || !hasMore) return; 

  const node = observerRef.current;

  if (!node) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      console.log("entry.isIntersecting:", entry.isIntersecting); // Debug log
      if (entry.isIntersecting) {
        loadMoreCallback();
      }
    },
    {
      root: null,               // ✅ gunakan viewport (window)
      rootMargin: '100px',      // ✅ bisa disesuaikan, contoh: "100px" agar trigger sebelum sepenuhnya terlihat
      threshold: 0.5,           // ✅ bisa 0.0 (sedikit terlihat), atau 1.0 (sepenuhnya terlihat)
    }
  );

  observer.observe(node);

  return () => {
    observer.disconnect();
  };
}, [loadMoreCallback, loadingTransactionHistoryInternal, hasMore]);


    useEffect(() => {
        setSpinnerRelatif(loadingTransactionHistoryInternal)
    }, [loadingTransactionHistoryInternal])

    const [filters, setFilters] = useState({
        method: null,
        status: null,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        dateError: null
    });
    


    // handle untuk ketika data filter transaction masih ada maka set button ke button filter
    useEffect(() => {
        if (method) {
            setFilterTransaction("methodFilterTransaction")
            setFilters({
                method: method,
                status: status,
                startDate: startDate,
                endDate: endDate,
                startTime: startTime,
                endTime: endTime,
            })
        }
    }, [method])

    // Handlers untuk update state
    const handleMethodChange = (method) => {
        setFilters(prev => ({...prev, method}))
    };

    const handleStatusChange = (status) => {
        setFilters(prev => ({...prev, status}))
    };

    const handleDateChange = (type, value) => {
        setFilters(prev => ({
        ...prev,
        [type]: value,
        dateError: null // Reset error saat date diubah
        }))
    }

    const handleClear = () => {
        setFilters({
        method: null,
        status: null,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        dateError: null
        });
        dispatch(resetTransactionHitoryInternal())
        dispatch(resetData())
    };

    const handleApply = () => {
        const newErrors = {}
        
        if (!filters.method) {
            newErrors.method = 'Payment method is required'
        }
        
        if (!filters.status) {
            newErrors.status = 'Transaction status is required'
        }

        if (!filters.startDate) {
            newErrors.startDate = 'Start date is required'
        } 
        if (!filters.endDate) { 
            newErrors.endDate = 'End date is required'
        }
        
        // Jika ada error, tampilkan dan berhenti
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors)
            return
        }
        
        // Validasi tanggal
        if (filters.startDate && filters.endDate) {
          const start = new Date(filters.startDate)
          const end = new Date(filters.endDate)
          const diffTime = Math.abs(end - start)
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays > 92) {
              setFilters(prev => ({...prev, dateError: 'Maksimal rentang tanggal 92 hari'}))
              return
          }
        }
        
        const data = {
            method: filters.method,
            status: filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate,
            page: 1
        }

        dispatch(resetData())
        dispatch(resetTransactionHitoryInternal())
        dispatch(setData(data))
        setSearchTerm('')
        dispatch(resetSearchTransactionInternal())
        
        // Reset status fetch history dan lakukan fetch
        setInitialFetchDone(prev => ({...prev, history: false}))
        
        if (!initialFetchDone.history) {
        dispatch(fetchTransactionHistory(data))
        setInitialFetchDone(prev => ({...prev, history: true}))
        }
        
        setFilterTransaction("methodFilterTransaction")
        setDateFilter(false)
        setValidationErrors({})
    }

    // handle button
     const handleMethodNonCashTransaction = () => {
        setFilterTransaction("methodNonCash")
        dispatch(resetData())
        setSearchTerm('')
        dispatch(resetTransactionHitoryInternal())
        dispatch(resetSearchTransactionInternal())
        setFilters({
        method: null,
        status: null,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        dateError: null
        })
    }

    const handleMethodCashTransaction = () => {
        setFilterTransaction("methodCash")
        dispatch(resetData())
        setSearchTerm('')
        dispatch(resetTransactionHitoryInternal())
        dispatch(resetSearchTransactionInternal())
        setFilters({
        method: null,
        status: null,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        dateError: null
        })
    }


    // handle search 
    const {dataSearchTransactionInternal, loadingSearchTransactionInternal} = useSelector((state) => state.getSearchTransactionInternalState)
    const {resetSearchTransactionInternal} = getSearchTransactionInternalSlice.actions
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = () => {
      dispatch(fetchSearchTransactionInternal(searchTerm))
    }

    useEffect(() => {
      setSpinnerRelatif(loadingSearchTransactionInternal)
    }, [loadingSearchTransactionInternal])

    useEffect(() => {
      if (searchTerm === '') {
        dispatch(resetSearchTransactionInternal())
      }
    }, [searchTerm])

    // Fungsi untuk memfilter data berdasarkan kondisi

    const getFilteredData = () => {
      let data = []
      
      if (filterTransaction === "methodCash") {
          data = dataTransactionCashInternal || []
      } else if (filterTransaction === "methodNonCash") {
          data = dataTransactionNonCashInternal || []
      } else if (filterTransaction === "methodFilterTransaction") {
          data = dataTransactionHistoryInternal || []
      }

      console.log(dataTransactionHistoryInternal)

      // Filter data berdasarkan kata kunci
      const lowercasedSearch = searchTerm.toLowerCase()
      return data.filter(item => 
          (item.channel_code?.toLowerCase().includes(lowercasedSearch)) ||
          (item.username?.toLowerCase().includes(lowercasedSearch)) ||
          (item.id?.toString().includes(searchTerm)) 
      )
    }

    const filteredData = getFilteredData()

    // Handle click outside modal bayar
    useOutsideClick({
        ref: modalBayarRef,
        callback: () => {
            setOpenModelBuyPaymentCash(false);
            handleCloseConfirmationModalError();
            handleCloseConfirmationModalSuccess();
            setValidationErrors({});
            setDataPaymentCash({
                transaction_id: null,
                amount_price: 0,
                money_received: 0,
            });
        },
        isActive: openModelBuyPaymentCash
      });


  const handleCloseConfirmationModalError = () => {
      setAllertErrorBuyTransactionCash(false)
      setAllertPendingCheckTransactionNonCash(false)
      dispatch(resetBuyTransactionCashOnGoingInternal()) 
      dispatch(resetCheckTransactionNonCash())
  }

  const handleCloseConfirmationModalSuccess = () => {
      setAllertSuccessBuyTransactionCash(false)
      setAllertSuccessCheckTransactionNonCash(false)
      dispatch(resetBuyTransactionCashOnGoingInternal()) 
      dispatch(resetCheckTransactionNonCash())
  }

  
  // handle amount dan count dari data by filter
  useEffect(() => {
    let data = [];

    if (filteredData?.length > 0) {
      data = filteredData;
    } else if (filterTransaction === "methodCash") {
      data = dataTransactionCashInternal || [];
    } else if (filterTransaction === "methodNonCash") {
      data = dataTransactionNonCashInternal || [];
    } else if (filterTransaction === "methodFilterTransaction") {
      data = dataTransactionHistoryInternal || [];
    }

    const total = data.reduce((sum, t) => sum + (t.amount_price || 0), 0);

    if (totalCountFilter === 0) {
      setTotalAmount(total);
      setTotalCount(data.length);
    }
  }, [
    filteredData,
    dataTransactionCashInternal,
    dataTransactionNonCashInternal,
    dataTransactionHistoryInternal,
    filterTransaction
  ]);


  // handle refersh tansaction
  const handleRefreshTransaction = () => {
    if (filterTransaction === 'methodCash') {
      dispatch(fetchTransactionCashOnGoingInternal())
    } 
    if (filterTransaction === 'methodNonCash') {
      dispatch(fetchTransactionNonCashOnGoingInternal())
    }
    if (filterTransaction === 'methodFilterTransaction') {
      const data = {
          method: filters.method,
          status: filters.status,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: 1
      }
      dispatch(fetchTransactionHistory(data))
    }
  }

  console.log("data history search: ", dataSearchTransactionInternal)
  
  // handle sidebar dan element header yang responsive 
  const { ref: headerRef, height: headerHeight } = useElementHeight();
  const { setIsOpen } = navbarInternalSlice.actions
  const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)


  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div
        ref={headerRef}
        className={`fixed top-0 z-10 bg-white border-b border-gray-200 ${(isOpen && isMobileDeviceType) || spinner  ? 'hidden' : ''}`}
        style={{
          left: (isFullScreen || isMobileDeviceType) ? '0' : '288px',
          width: isMobileDeviceType ? '100%' : (isFullScreen ? '100%' : 'calc(100% - 288px)'),
          height: '64px'
        }}
      >
        <div className="h-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
            {/* Left - Logo & Info */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <ScanBarcode className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white"/>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 truncate">
                  Transactions Management
                </h1>
              </div>
            </div>
            
            {/* Right - Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              <button
                onClick={() => handleRefreshTransaction()}
                className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-2 py-1.5 sm:px-3 sm:py-2 lg:px-6 lg:py-2 rounded-lg sm:rounded-xl hover:shadow-sm transition-all duration-300 flex items-center space-x-1 sm:space-x-2 hover:scale-100 touch-manipulation"
                aria-label="Refresh transactions"
              >
                <RefreshCw className="h-4 w-4 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm hidden xs:inline">Refresh</span>
              </button>
              
              <button 
                onClick={() => fullscreenchange()} 
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
                className="p-1.5 sm:p-2 lg:p-3 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 touch-manipulation"
                onClick={() => navigate('/internal/admin/settings')}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              
              {isMobileDeviceType && !isFullScreen && (
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

      <div className="max-w-7xl mx-auto p-4" style={{marginTop: headerHeight}}>
        {/* Enhanced Summary Cards */}
        <div className="mb-4">
          <div className="bg-white backdrop-blur-sm rounded-md shadow-xl border border-gray-200/50 p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-md font-semibold text-gray-800">Total Incoming Amount</h2>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">IDR {totalAmount.toLocaleString("id-ID")}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Transactions Count: {totalCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200/50 mb-4">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-4">
            {/* Method Filter Buttons - Mobile */}
            <div className="flex justify-between gap-3">
              <button 
                className={`flex items-center w-[45%] justify-center gap-2 h-12 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filterTransaction === "methodCash" 
                    ? "bg-gray-900 text-white shadow-lg scale-100" 
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`} 
                onClick={handleMethodCashTransaction}
              >
                <Banknote className="w-4 h-4" />
                Method Cash
              </button>

              <button 
                className={`flex items-center w-[45%] justify-center gap-2 h-12 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filterTransaction === "methodNonCash" 
                    ? "bg-gray-900 text-white shadow-lg scale-100" 
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`} 
                onClick={handleMethodNonCashTransaction}
              >
                <CreditCard className="w-4 h-4" />
                Method Non Cash
              </button>
            </div>

            {/* Date Filter - Mobile */}
            <div className="relative">
              <div
                onClick={() => setDateFilter(prev => !prev)}
                className={`w-full h-12 flex items-center justify-between px-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-100 ${
                  filterTransaction === "methodFilterTransaction" 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between w-full">
                  <div className="flex flex-col items-start">
                    <span className={`text-sm font-medium ${
                      filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-700'
                    }`}>{filters.startDate ? filters.startDate : 'dd/mm/yyyy'}</span>
                    <span className={`text-xs ${
                      filterTransaction === "methodFilterTransaction" ? 'text-gray-300' : 'text-gray-500'
                    }`}>12:00 AM</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-medium ${
                      filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-700'
                    }`}>{ filters.endDate ? filters.endDate : 'dd/mm/yyyy'}</span>
                    <span className={`text-xs ${
                      filterTransaction === "methodFilterTransaction" ? 'text-gray-300' : 'text-gray-500'
                    }`}>12:00 PM</span>
                  </div>
                </div>
                <CalendarRange className={`ml-2 ${
                  filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-500'
                }`} size={18} />
              </div>
              
              {dateFilter && (
                <div 
                className="absolute z-10 left-0 right-0" 
                >
                  <FilterPanel
                    filterMethod={filters.method}
                    filterStatus={filters.status}
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    dateError={filters.dateError}
                    onMethodChange={handleMethodChange}
                    onStatusChange={handleStatusChange}
                    onStartDateChange={(value) => handleDateChange('startDate', value)}
                    onEndDateChange={(value) => handleDateChange('endDate', value)}
                    onClear={handleClear}
                    onApply={handleApply}
                    showMethodFilter={true}
                    showStatusFilter={true}
                    showDateFilter={true}
                    showTimeFilter={true}
                    validationErrors={validationErrors}
                  />
                </div>
              )}
            </div>

            {/* Status Filter - Mobile */}
            <div>
              <div className={`flex items-center justify-center gap-2 h-12 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                filterTransaction !== "methodFilterTransaction" 
                  ? "bg-gray-900 text-white shadow-lg scale-100" 
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:scale-100"
              }`}>
                <History className="w-4 h-4" />
                On Going
              </div>
            </div>

            {/* Search Input & Button - Mobile */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="relative">
                  <Search
                      className="absolute inset-y-0 left-4 my-auto text-gray-400"
                      size={20}
                  />
                  <input
                      type="text"
                      placeholder="Search by id, email, username...."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-[60%] pl-12 pr-4 py-3 h-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400 text-gray-900"
                  />
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-2 h-12 rounded-xl hover:shadow-sm transition-all duration-300 flex items-center justify-center space-x-2 hover:scale-100"
              >
                Search
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex flex-wrap gap-4 items-center justify-between">
            {/* Method Filter Buttons - Desktop */}
            <div className="flex items-center gap-3">
              <button 
                className={`flex items-center gap-2 h-12 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filterTransaction === "methodCash" 
                    ? "bg-gray-900 text-white shadow-lg scale-105" 
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`} 
                onClick={handleMethodCashTransaction}
              >
                <Banknote className="w-4 h-4" />
                Method Cash
              </button>

              <button 
                className={`flex items-center gap-2 h-12 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filterTransaction === "methodNonCash" 
                    ? "bg-gray-900 text-white shadow-lg scale-105" 
                    : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`} 
                onClick={handleMethodNonCashTransaction}
              >
                <CreditCard className="w-4 h-4" />
                Method Non Cash
              </button>
            </div>

            {/* Date Filter - Desktop */}
            <div className="relative">
              <div
                onClick={() => setDateFilter(prev => !prev)}
                className={`w-64 h-12 flex items-center justify-between px-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                  filterTransaction === "methodFilterTransaction" 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex justify-between w-full">
                  <div className="flex flex-col items-start">
                    <span className={`text-sm font-medium ${
                      filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-700'
                    }`}>{filters.startDate ? filters.startDate : 'dd/mm/yyyy'}</span>
                    <span className={`text-xs ${
                      filterTransaction === "methodFilterTransaction" ? 'text-gray-300' : 'text-gray-500'
                    }`}>12:00 AM</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-medium ${
                      filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-700'
                    }`}>{ filters.endDate ? filters.endDate : 'dd/mm/yyyy'}</span>
                    <span className={`text-xs ${
                      filterTransaction === "methodFilterTransaction" ? 'text-gray-300' : 'text-gray-500'
                    }`}>12:00 PM</span>
                  </div>
                </div>
                <CalendarRange className={`ml-2 ${
                  filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-500'
                }`} size={18} />
              </div>
              
              {dateFilter && (
                <div 
                className="absolute z-10" 
                >
                  <FilterPanel
                    filterMethod={filters.method}
                    filterStatus={filters.status}
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    dateError={filters.dateError}
                    onMethodChange={handleMethodChange}
                    onStatusChange={handleStatusChange}
                    onStartDateChange={(value) => handleDateChange('startDate', value)}
                    onEndDateChange={(value) => handleDateChange('endDate', value)}
                    onClear={handleClear}
                    onApply={handleApply}
                    showMethodFilter={true}
                    showStatusFilter={true}
                    showDateFilter={true}
                    showTimeFilter={true}
                    validationErrors={validationErrors}
                  />
                </div>
              )}
            </div>

            {/* Status Filter - Desktop */}
            <div>
              <div className={`flex items-center gap-2 h-12 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                filterTransaction !== "methodFilterTransaction" 
                  ? "bg-gray-900 text-white shadow-lg scale-105" 
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:scale-105"
              }`}>
                <History className="w-4 h-4" />
                On Going
              </div>
            </div>

            {/* Search Input & Button - Desktop */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="relative">
                  <Search
                      className="absolute inset-y-0 left-4 my-auto text-gray-400"
                      size={20}
                  />
                  <input
                      type="text"
                      placeholder="Search by id, email, username...."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 h-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400 text-gray-900"
                  />
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-2 rounded-xl hover:shadow-sm transition-all duration-300 flex items-center space-x-2 hover:scale-105"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Modern Transaction Table */}
        <div className="bg-white rounded-md overflow-x-auto shadow-xl border border-gray-200/50 overflow-hidden h-[100vh] relative">
          {spinnerRelatif && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <SpinnerRelative />
            </div>
          )}
          
          <div className="p-4">
            {(dataTransactionCashInternal.length > 0 || 
              dataTransactionNonCashInternal.length > 0 || 
              dataTransactionHistoryInternal.length > 0 || 
              dataSearchTransactionInternal.length > 0) && (
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Daftar Transaksi</h2>
              </div>
            )}

            <div className="max-h-[90vh]">
              {(dataTransactionCashInternal?.length > 0 && filterTransaction === "methodCash") || 
              (dataTransactionNonCashInternal?.length > 0 && filterTransaction === "methodNonCash") || 
              (dataTransactionHistoryInternal?.length > 0 && filterTransaction === "methodFilterTransaction") || 
              (dataSearchTransactionInternal.length > 0) ? (
                <>
                  {/* Mobile Card Layout */}
                  <div className="block max-h-[84vh] overflow-y-auto">
                    <div className="space-y-4">
                      {(dataSearchTransactionInternal.length > 0 ? dataSearchTransactionInternal : filteredData).map((t, index) => (
                        <div 
                          key={`${t.id}-${index}`} 
                          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-200"
                        >
                          <div className="hidden">
                            <CountDownRemoveData 
                              expiry={t?.expires_at} 
                              transactionId={t.id} 
                              remove={filterTransaction === "methodCash" 
                                ? removeTransactionCashOnGoingInternalById 
                                : removeTransactionNonCashOnGoingInternalById}
                            />
                          </div>
                          
                          {/* Status and Channel Row */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                                {t.status_transaction}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500">Channel</div>
                              <div className="font-medium text-gray-900">{t.channel_code}</div>
                            </div>
                          </div>

                          {/* Account Info */}
                          <div className="mb-3">
                            <div className="text-sm text-gray-500 mb-1">Account</div>
                            <div className="text-gray-700">{t.username || t.email_order_from_cashier}</div>
                          </div>

                          {/* Amount */}
                          <div className="mb-3">
                            <div className="text-sm text-gray-500 mb-1">Amount</div>
                            <div className="font-bold text-gray-900 text-lg">
                              IDR {t.amount_price?.toLocaleString("id-ID")}
                            </div>
                          </div>

                          {/* DineIn/TakeAway and Date Row */}
                          <div className="flex justify-between items-end mb-3">
                            <div>
                              <div className="text-sm text-gray-500 mb-1">DineIn/TakeAway</div>
                              <div className="text-gray-700">
                                {t.table === 0 ? t.order_type : `Table ${t.table}`}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-1">Date</div>
                              <div className="text-gray-600 text-sm">{FormatDate(t.created_at || t.date)}</div>
                            </div>
                          </div>

                          {/* Action Button */}
                          {((filterTransaction === "methodCash" || filterTransaction === "methodNonCash") && dataSearchTransactionInternal.length === 0) && (
                            <div className="pt-3 border-t border-gray-100">
                              <button 
                                onClick={() => filterTransaction === "methodCash" 
                                  ? handleOpenModelPaymentCash(t.id, t.amount_price)
                                  : handleCheckTransactionNonCash(t.id)}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-md"
                              >
                                {filterTransaction === "methodCash" ? "Buy" : "Check Payment"}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}    
                    </div>

                    {/* Infinite Scroll Trigger for Mobile - hanya untuk history transaction */}
                    {filterTransaction === "methodFilterTransaction" && (
                      <div ref={observerRef} className="p-4">
                        <BottomLoadingIndicator 
                          isVisible={loadingTransactionHistoryInternal && hasMore} 
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                  <div className="mb-8 relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Tidak Ada Transaksi Ditemukan
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                    Coba sesuaikan filter pencarian Anda atau mulai buat transaksi pertama Anda.
                  </p>
                  <button 
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 hover:scale-105 shadow-md"
                    onClick={() => setDateFilter(true)}
                  >
                    <Filter className="w-4 h-4" />
                    Ubah Filter
                  </button>
                </div>
              )}

              {/* End of Data Indicator */}
              {filterTransaction === "methodFilterTransaction" && 
              !hasMore && dataTransactionHistoryInternal.length > 0 && (
                <div className="flex justify-center items-center py-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                    <span className="text-sm">Semua data telah dimuat</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {spinner && (
          <div className="fixed">
            <SpinnerFixed colors={'border-gray-900'} />
          </div>
        )}

        {/* Success Modals */}
        {(allertSuccessBuyTransactionCash || allertSuccessCheckTransactionNonCash) && (
          <div ref={modalBayarRef} className="fixed">
            <ConfirmationModal 
              onClose={handleCloseConfirmationModalSuccess} 
              title={"Success!"}  
              message={
                allertSuccessBuyTransactionCash
                  ? "Pembayaran tunai telah berhasil diproses"
                  : "Verifikasi pembayaran non-tunai berhasil"
              }
              type={"success"}
            />
          </div>
        )}

        {/* Pending Modal */}
        {allertPendingCheckTransactionNonCash && (
          <div ref={modalBayarRef} className="fixed">
            <ConfirmationModal
              onClose={handleCloseConfirmationModalError}
              title={"Pending"}
              message={"Status pembayaran non-tunai masih pending. Silakan periksa kembali dalam beberapa saat."}
              type={"pending"}
            />
          </div>
        )}

        {/* Error Modal */}
        {allertErrorBuyTransactionCash && (
          <div ref={modalBayarRef} className="fixed">
            <ConfirmationModal
              onClose={handleCloseConfirmationModalError}
              title={"Gagal!"}
              message={"Pembayaran tunai telah gagal diproses"}
              type={"error"}
            />
          </div>
        )}
        
        {/* Cash Payment Modal */}
        {dataPaymentCash.open && ( 
          <div className="fixed">
            <CashPaymentModal 
              ref={modalBayarRef} 
              data={{
                transaction_id: dataPaymentCash.transaction_id,
                amount_price: dataPaymentCash.amount_price,
              }} 
              setData={setDataPaymentCash}
              onClose={() => setDataPaymentCash({ open: false, transactionId: null, amountPrice: 0 })}
              onBayar={handleBuyTransaction}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
