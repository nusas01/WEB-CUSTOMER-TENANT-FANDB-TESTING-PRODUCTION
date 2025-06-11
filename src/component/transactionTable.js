import { useState, useRef } from "react"
import { ArrowDown, ArrowUp, Search, Currency, History,  Download, CalendarRange } from "lucide-react"
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
        (item.status_transaction?.toLowerCase().includes(lowercasedSearch)) ||
        (item.channel_code?.toLowerCase().includes(lowercasedSearch)) ||
        (item.username?.toLowerCase().includes(lowercasedSearch)) ||
        (item.table?.toString().includes(searchTerm)) 
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
    <div>
        {/* header  */}
        <div className="w-full shadow-lg items-center py-5 z-5 bg-white">
            <p className="font-semibold mx-4 text-lg">Transaction</p>
        </div>

        <div className="p-5 min-h-screen text-white">
            {/* Summary Cards */}
            <div className="mb-6">
                <div className="p-4 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm text-black">Total Incoming Amount</h2>
                    <ArrowDown className="text-green-400" />
                </div>
                <h3 className="text-2xl text-black font-bold">IDR 40.000</h3>
                <p className="text-sm text-black">Transactions Count: 3</p>
                </div>
            </div>

            
            {/* Filter & Search */}
            <div className="flex justify-between items-center mb-4">
                
                <div className="flex items-center space-x-3">
                    <button className={`flex items-center h-10 text-gray-700 border  border-black  px-4 py-1 rounded-md rounded-md ${filterTransaction === "methodCash" ? "bg-gray-900 text-white" : "bg-white"}`} onClick={() => handleMethodCashTransaction()}>
                        Method Cash
                    </button>

                    <button className={`flex items-center h-10 text-gray-700 border  border-black px-4 py-1 rounded-md rounded-md ${filterTransaction === "methodNonCash" ? "bg-gray-900 text-white" : "bg-white"}`} onClick={() => handleMethodNonCashTransaction()}>
                        Method Non Cash
                    </button>
                </div>

                <div>
                    {/* button show card select history */}
                   <div
                        onClick={() => setDateFilter(true)}
                        className={`w-[220px] h-10 flex items-center ${ filterTransaction === "methodFilterTransaction" ? 'bg-gray-900' : 'bg-white'} justify-between border border-gray-300 rounded-md px-1 relative cursor-pointer hover:shadow-sm transition-all`}
                        >
                        <div className="flex w-[80%] justify-between text-gray-800">
                            <div className="flex flex-col items-center">
                                <span className={`text-sm ${ filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-700'} `}>27/05/2025</span>
                                <span className={`text-xs ${ filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-500'}`}>12:00 AM</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className={`text-sm ${ filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-700'}`}>27/05/2025</span>
                                <span className={`text-xs ${ filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-500'}`}>12:00 AM</span>
                            </div>
                        </div>
                        <CalendarRange className={`${ filterTransaction === "methodFilterTransaction" ? 'text-white' : 'text-gray-500'}`} size={20} />
                    </div>
                    
                    {/* Input option and date to select history */}
                    { dateFilter && (
                        <div className="absolute z-10" ref={panelRef}>
                             <FilterPanel
                                filterMethod={filters.method}
                                filterStatus={filters.status}
                                startDate={filters.startDate}
                                endDate={filters.endDate}
                                startTime={filters.startTime}
                                endTime={filters.endTime}
                                dateError={filters.dateError}
                                
                                // State handlers
                                onMethodChange={handleMethodChange}
                                onStatusChange={handleStatusChange}
                                onStartDateChange={(value) => handleDateChange('startDate', value)}
                                onEndDateChange={(value) => handleDateChange('endDate', value)}
                                onStartTimeChange={(value) => handleTimeChange('startTime', value)}
                                onEndTimeChange={(value) => handleTimeChange('endTime', value)}
                                onClear={handleClear}
                                onApply={handleApply}
                                
                                // UI configuration
                                showMethodFilter={true}
                                showStatusFilter={true}
                                showDateFilter={true}
                                showTimeFilter={true}


                                validationErrors={validationErrors}
                            />
                        </div>
                    )}
                </div>


                <div className="relative w-full flex items-center max-w-md">
                    {/* Input Search */}
                    <Search className="absolute left-3  transform -translate-y-1/2 text-black" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full pl-10 pr-4 py-1 h-10 border placeholder-black text-black border-black rounded-md focus:outline-none focus:ring-2  focus:border-black-100 transition-all"
                    />
                    {/* Icon Search */}
                </div>

                <div className="flex space-x-2">
                    <button 
                    className={`flex items-center gap-2 h-10 px-4 py-1 rounded-md text-gray-700 border border-black ${filterTransaction !== "methodFilterTransaction" ? "bg-gray-900 text-white" : "bg-white"}`}
                    >
                        <History/>
                        On Going
                    </button>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="rounded-lg shadow-md bg-white overflow-hidden min-h-[400px] p-4 relative w-full">
                 {spinnerRelatif ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
                    <SpinnerRelative />
                    </div>
                ) : null}
                { (dataTransactionCashInternal.length > 0 || dataTransactionNonCashInternal.length > 0) && (
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Daftar Transaksi</h2>
                )}
                <table className="w-full text-left">
                    {(dataTransactionCashInternal?.length > 0 && filterTransaction === "methodCash") || (dataTransactionNonCashInternal?.length > 0 && filterTransaction === "methodNonCash") || (dataTransactionHistoryInternal?.length > 0 && filterTransaction === "methodFilterTransaction") ? (
                        <>
                        <thead className="bg-gray-100 z-10">
                        <tr>
                            {["Status", "Channel", "Account", "Amount", "Table/DineIn", "Date"]
                            .concat(filterTransaction === 'methodFilterTransaction' ? [] : ["Buy"])
                            .map((header) => (
                                <th 
                                key={header} 
                                className="py-3 px-4 text-white font-medium text-sm border-b border-gray-200py-3 px-4 font-medium text-sm text-gray-600 whitespace-nowrap"
                                >
                                {header}
                                </th>
                            ))
                            }
                        </tr>
                        </thead>
                        <tbody>
                       {( filteredData?.length > 0 ? filteredData : 
                        (filterTransaction === "methodCash"
                            ? dataTransactionCashInternal
                            : filterTransaction === "methodNonCash"
                            ? dataTransactionNonCashInternal
                            : dataTransactionHistoryInternal
                        ))?.map((t, index) => (
                            <tr 
                            key={index} 
                            className="hover:bg-gray-50 transition-colors duration-150"
                            >
                            <td className="hidden">
                                <CountDownRemoveData 
                                    expiry={t?.expires_at} 
                                    transactionId={t.id} 
                                    remove={
                                        filterTransaction === "methodCash" 
                                            ? removeTransactionCashOnGoingInternalById 
                                            : removeTransactionNonCashOnGoingInternalById
                                    }
                                />
                            </td>
                            <td className="py-3 px-4">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800`}>
                                    {t.status_transaction}
                                </span>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">{t.channel_code}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{t.username}</td>
                            <td className="py-3 px-4 text-sm text-gray-800">
                                {t.amount_price?.toLocaleString("id-ID")}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-800">
                                {t.table === 0 ? t.order_type : t.table}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">{FormatDate(t.created_at)}</td>
                            { filterTransaction !== "methodFilterTransaction" && (
                                <td className="py-3 px-4 text-start">
                                    <button 
                                    onClick={() => filterTransaction === "methodCash" 
                                        ? handleOpenModelPaymentCash(t.id, t.amount_price)
                                        : handleCheckTransactionNonCash(t.id)}
                                        className="inline-flex items-center px-3 py-1 bg-red-800 text-white text-sm font-medium rounded-md hover:bg-red-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    >
                                    { filterTransaction === "methodCash" ? "Buy" : "Check Payment"}
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
                            <div className="flex flex-col items-center justify-center min-h-[370px] bg-white p-8 text-center">
                            <div className="mb-6 relative">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Tidak Ada Transaksi Ditemukan
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                Coba sesuaikan filter pencarian Anda atau mulai buat transaksi pertama Anda.
                            </p>
                            <button 
                                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                                onClick={() => setDateFilter(true)}
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                                </svg>
                                Ubah Filter
                            </button>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                    )}
                </table>
            </div>

            { spinner && (
                <SpinnerFixed colors={'fill-gray-900'}/>
            )}

            {/* alert success confirmation modal  */}
            {  (allertSuccessBuyTransactionCash || allertSuccessCheckTransactionNonCash) && (
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


            {/* alert error confirmation modal  */}
            { allertPendingCheckTransactionNonCash && (
                <div ref={panelRef}>
                    <ConfirmationModal
                    onClose={handleCloseConfirmationModalError}
                    title={"Pending"}
                        message={"Status pembayaran non-tunai masih pending. Silakan periksa kembali dalam beberapa saat."}
                    type={"pending"}
                    />
                </div>
            )}

            {/* allert error  */}
            { allertErrorBuyTransactionCash && (
                <div ref={panelRef}>
                    <ConfirmationModal
                    onClose={handleCloseConfirmationModalError}
                    title={"Gagal!"}
                        message={"Pembayaran tunai telah gagal diproses"}
                    type={"error"}
                    />
                </div>
            )}
            
            {/* Model payment cash*/}
            { dataPaymentCash.open && ( 
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
