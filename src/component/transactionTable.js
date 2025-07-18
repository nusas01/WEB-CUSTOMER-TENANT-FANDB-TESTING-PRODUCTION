import { useState, useRef } from "react"
import { ArrowDown, TrendingUp, Clock, Banknote, CreditCard, RefreshCw, Filter, Search, Currency, History,  ScanBarcode, Bell, Settings, CalendarRange } from "lucide-react"
import { CalendarIcon } from "@heroicons/react/24/outline"
import { data, useNavigate } from "react-router-dom"
import FilterPanel from "./dateFilter"
import Order from "../component/orderTable"
import { useDispatch, useSelector } from "react-redux"
import { SpinnerRelative, SpinnerFixed } from "../helper/spinner"
import { 
    fetchTransactionCashOnGoingInternal,
    fetchTransactionNonCashOnGoingInternal, 
    checkTransactionNonCashInternal,
    fetchTransactionHistory,
 } from "../actions/get"
import {
    buyTransactionCashOnGoingInternalSlice,

} from "../reducers/patch"
import { 
    buyTransactionCashOnGoingInternal
} from "../actions/patch"
import { 
    transactionCashOnGoingInternalSlice, 
    transactionNonCashOnGoingInternalSlice,
    checkTransactionNonCashInternalSlice,
    dataFilteringTransactionHistorySlice,
    transactionHistoryInternalSlice,
} from "../reducers/get" 
import { useEffect } from "react"
import { FormatDate } from "../helper/formatdate"
import { formatDate } from "date-fns"
import { CountDownRemoveData } from "../helper/countDown"
import { da } from "date-fns/locale"
import {ConfirmationModal, CashPaymentModal, ErrorAlert} from "./alert"

const TransactionTable = () => {
  const panelRef = useRef(null)
  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState(false)
  const navigate = useNavigate()
  const [filterTransaction, setFilterTransaction] = useState("methodCash")   
  const [validationErrors, setValidationErrors] = useState({})
  const dispatch = useDispatch()
  const [spinner, setSpinner] = useState(false)
  const [spinnerRelatif, setSpinnerRelatif] = useState(false)
  const [isFetchedOnce, setIsFetchedOnce] = useState(false)

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
    const {dataTransactionHistoryInternal, loadingTransactionHistoryInternal} = useSelector((state) => state.persisted.transactionHistoryInternal)

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

    const handleTimeChange = (type, value) => {
        setFilters(prev => ({...prev, [type]: value}))
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

    const loadMoreHistoryTransaction = () => {
        dispatch(setIncrementPage())
        const data = {
            method: method,
            status: status,
            startDate: startDate,
            endDate: endDate,
            startTime: startTime,
            endTime: endDate,
            page: page + 1
        }
        dispatch(fetchTransactionHistory(data))
    }

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
        
        if (!filters.startTime) {
            newErrors.startTime = 'Start time is required'
        }

        if (!filters.endTime) { 
            newErrors.endTime = 'End time is required'
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
            startTime: filters.startTime,
            endTime: filters.endTime,
            page: 1
        }

        dispatch(resetData())
        dispatch(resetTransactionHitoryInternal())
        dispatch(setData(data))
        
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
        dispatch(resetTransactionHitoryInternal())
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
        dispatch(resetTransactionHitoryInternal())
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
    const [searchTerm, setSearchTerm] = useState('')

    const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    }

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

    console.log(dataTransactionNonCashInternal)

    // Filter data berdasarkan kata kunci
    const lowercasedSearch = searchTerm.toLowerCase()
    return data.filter(item => 
        (item.channel_code?.toLowerCase().includes(lowercasedSearch)) ||
        (item.username?.toLowerCase().includes(lowercasedSearch)) ||
        (item.id?.toString().includes(searchTerm)) 
    )
    }

    const filteredData = getFilteredData()

    // Handle click outside dateFilter panel
    useEffect(() => {
        function handleClickOutside(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
            setDateFilter(false)   
            }
        }

        if (dateFilter) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [dateFilter])  

    // Handle click outside modal bayar
    useEffect(() => {
        function handleClickOutside(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setOpenModelBuyPaymentCash(false)
                handleCloseConfirmationModalError()
                handleCloseConfirmationModalSuccess()
                setValidationErrors({})
                setDataPaymentCash({
                    transaction_id: null,
                    amount_price: 0,
                    money_received: 0,
                })
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
       
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


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

    console.log("data transaction cash: ", dataTransactionCashInternal)

  return (
     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                <ScanBarcode className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Transactions Management</h1>
                <p className="text-gray-500 text-sm font-medium">Kelola transaksi masuk dan pantau status pembayaran</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105" 
                onClick={() => navigate('/internal/admin/settings')}
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Enhanced Summary Cards */}
        <div className="mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-md shadow-xl border border-gray-200/50 p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Incoming Amount</h2>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">IDR 40.000</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Transactions Count: 3</span>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-2xl">
                <ArrowDown className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-wrap gap-4 mb-4 items-center justify-between">
          {/* Method Filter Buttons */}
          <div className="flex items-center gap-3">
            <button 
              className={`flex items-center gap-2 h-12 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                filterTransaction === "methodCash" 
                  ? "bg-gray-900 text-white shadow-lg scale-105" 
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:scale-105"
              }`} 
              onClick={handleMethodCashTransaction}
            >
              <Banknote className="w-4 h-4" />
              Method Cash
            </button>

            <button 
              className={`flex items-center gap-2 h-12 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                filterTransaction === "methodNonCash" 
                  ? "bg-gray-900 text-white shadow-lg scale-105" 
                  : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:scale-105"
              }`} 
              onClick={handleMethodNonCashTransaction}
            >
              <CreditCard className="w-4 h-4" />
              Method Non Cash
            </button>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <div
              onClick={() => setDateFilter(true)}
              className={`w-64 h-12 flex items-center justify-between px-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 ${
                filterTransaction === "methodFilterTransaction" 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex justify-between w-full">
                <div className="flex flex-col items-start">
                  <span className={`text-sm font-medium ${
                    filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-700'
                  }`}>27/05/2025</span>
                  <span className={`text-xs ${
                    filterTransaction === "methodFilterTransaction" ? 'text-gray-300' : 'text-gray-500'
                  }`}>12:00 AM</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-sm font-medium ${
                    filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-700'
                  }`}>27/05/2025</span>
                  <span className={`text-xs ${
                    filterTransaction === "methodFilterTransaction" ? 'text-gray-300' : 'text-gray-500'
                  }`}>12:00 AM</span>
                </div>
              </div>
              <CalendarRange className={`ml-2 ${
                filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-500'
              }`} size={18} />
            </div>
            
            {dateFilter && (
              <div className="absolute z-10" ref={panelRef}>
                <FilterPanel
                  filterMethod={filters.method}
                  filterStatus={filters.status}
                  startDate={filters.startDate}
                  endDate={filters.endDate}
                  startTime={filters.startTime}
                  endTime={filters.endTime}
                  dateError={filters.dateError}
                  onMethodChange={handleMethodChange}
                  onStatusChange={handleStatusChange}
                  onStartDateChange={(value) => handleDateChange('startDate', value)}
                  onEndDateChange={(value) => handleDateChange('endDate', value)}
                  onStartTimeChange={(value) => handleTimeChange('startTime', value)}
                  onEndTimeChange={(value) => handleTimeChange('endTime', value)}
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

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search
                className="absolute inset-y-0 left-4 my-auto text-gray-400"
                size={20}
            />
            <input
                type="text"
                placeholder="Search by id, email, username...."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 h-12 border-2 border-green-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all duration-200 bg-white placeholder-gray-400 text-gray-900"
            />
            </div>


          {/* Status Filter */}
          <div>
            <button className={`flex items-center gap-2 h-12 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              filterTransaction !== "methodFilterTransaction" 
                ? "bg-gray-900 text-white shadow-lg scale-105" 
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:scale-105"
            }`}>
              <History className="w-4 h-4" />
              On Going
            </button>
          </div>
        </div>

        {/* Modern Transaction Table */}
        <div className="bg-white/80 rounded-md shadow-xl border border-gray-200/50 overflow-hidden min-h-[70vh] relative">
          {spinnerRelatif && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
              <SpinnerRelative />
            </div>
          )}
          
          <div className="p-8">
            {(dataTransactionCashInternal.length > 0 || dataTransactionNonCashInternal.length > 0) && (
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Daftar Transaksi</h2>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                {(dataTransactionCashInternal?.length > 0 && filterTransaction === "methodCash") || 
                 (dataTransactionNonCashInternal?.length > 0 && filterTransaction === "methodNonCash") || 
                 (dataTransactionHistoryInternal?.length > 0 && filterTransaction === "methodFilterTransaction") ? (
                  <>
                    <thead className="bg-gray-50/50 backdrop-blur-sm">
                      <tr>
                        {["Status", "Channel", "Account", "Amount", "Table/DineIn", "Date"]
                          .concat(filterTransaction === 'methodFilterTransaction' ? [] : ["Buy"])
                          .map((header) => (
                            <th 
                              key={header} 
                              className="py-4 px-6 text-left font-semibold text-sm text-gray-700 uppercase tracking-wider border-b border-gray-200"
                            >
                              {header}
                            </th>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(filteredData?.length > 0 ? filteredData : 
                        (filterTransaction === "methodCash"
                          ? dataTransactionCashInternal
                          : filterTransaction === "methodNonCash"
                          ? dataTransactionNonCashInternal
                          : dataTransactionHistoryInternal
                        ))?.map((t, index) => (
                        <tr 
                          key={index} 
                          className="hover:bg-gray-50/50 transition-all duration-200 group"
                        >
                          <td className="hidden">
                            <CountDownRemoveData 
                              expiry={t?.expires_at} 
                              transactionId={t.id} 
                              remove={filterTransaction === "methodCash" 
                                ? removeTransactionCashOnGoingInternalById 
                                : removeTransactionNonCashOnGoingInternalById}
                            />
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
                              {t.status_transaction}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-medium text-gray-900">{t.channel_code}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-700">{t.username || t.email_order_from_cashier}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="font-bold text-gray-900">
                              IDR {t.amount_price?.toLocaleString("id-ID")}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-700">
                              {t.table === 0 ? t.order_type : `Table ${t.table}`}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-gray-600">{FormatDate(t.created_at)}</span>
                          </td>
                          {filterTransaction !== "methodFilterTransaction" && (
                            <td className="py-4 px-6">
                              <button 
                                onClick={() => filterTransaction === "methodCash" 
                                  ? handleOpenModelPaymentCash(t.id, t.amount_price)
                                  : handleCheckTransactionNonCash(t.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all duration-200 hover:scale-105 shadow-md"
                              >
                                {filterTransaction === "methodCash" ? "Buy" : "Check Payment"}
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan="7">
                        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
                          <div className="mb-8 relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg">
                              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
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
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {spinner && (
          <SpinnerFixed colors={'border-gray-900'} />
        )}

        {/* Success Modals */}
        {(allertSuccessBuyTransactionCash || allertSuccessCheckTransactionNonCash) && (
          <div ref={panelRef}>
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
          <div ref={panelRef}>
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
          <div ref={panelRef}>
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
          <CashPaymentModal 
            ref={panelRef} 
            data={{
              transaction_id: dataPaymentCash.transaction_id,
              amount_price: dataPaymentCash.amount_price,
            }} 
            setData={setDataPaymentCash}
            onClose={() => setDataPaymentCash({ open: false, transactionId: null, amountPrice: 0 })}
            onBayar={handleBuyTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
