import { useState, useRef } from "react"
import { ArrowDown, ArrowUp, Search, Currency, History,  Download, CalendarRange } from "lucide-react"
import { CalendarIcon } from "@heroicons/react/24/outline"
import { data, useNavigate } from "react-router-dom"
import FilterPanel from "./dateFilter"
import Order from "../component/orderTable"
import { useDispatch, useSelector } from "react-redux"
import { SpinnerRelative } from "../helper/spinner"
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
import { FormatDate } from "../helper/formatdate";
import { formatDate } from "date-fns";
import { CountDownRemoveData } from "../helper/countDown";
import { ErrorAlert } from "./alert";
import { da } from "date-fns/locale";

const TransactionTable = () => {
  const panelRef = useRef(null)
  const [search, setSearch] = useState("")
  const [dateFilter, setDateFilter] = useState(false)
  const navigate = useNavigate()
  const [filterTransaction, setFilterTransaction] = useState("methodCash")
  const [filterTimeTransaction, setFilterTimeTransaction] = useState("onGoing")
  const [error, setError] = useState(null)    

  const dispatch = useDispatch()
  const [spinner, setSpinner] = useState(false)



   // handle close component saat click outside
   useEffect(() => {
        function handleClickOutside(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setDateFilter(false); // ubah dateFilter ke false jika klik di luar
            }
        }

        if (dateFilter) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dateFilter]);

    // get transaction cash on going
    const { removeTransactionCashOnGoingInternalById } = transactionCashOnGoingInternalSlice.actions
    const {dataTransactionCashInternal, errorTransactionCashInternal, loadingTransactionCashInternal} = useSelector((state) => state.persisted.transactionCashOnGoingInternal)
    useEffect(() => {
        setSpinner(loadingTransactionCashInternal)
    }, [loadingTransactionCashInternal])

    useEffect(() => {
        if (!dataTransactionCashInternal || Object.keys(dataTransactionCashInternal).length === 0) {
            dispatch(fetchTransactionCashOnGoingInternal())
        }
    }, [dataTransactionCashInternal])





    // get transaction non cash on going
    const { removeTransactionNonCashOnGoingInternalById } = transactionNonCashOnGoingInternalSlice.actions
    const {dataTransactionNonCashInternal, errorTransactionNonCashInternal, loadingTransactionNonCashInternal} = useSelector((state) => state.persisted.transactionNonCashOnGoingInternal)

    useEffect(() => {
        setSpinner(loadingTransactionNonCashInternal)
    }, [loadingTransactionNonCashInternal])

    useEffect(() => {
        if (filterTransaction === "methodNonCash" && (!dataTransactionNonCashInternal || Object.keys(dataTransactionNonCashInternal).length === 0)) {
        dispatch(fetchTransactionNonCashOnGoingInternal());
        }
    }, [filterTransaction, dataTransactionNonCashInternal]);





    // buy transaction cash on going
    const { resetBuyTransactionCashOnGoingInternal } = buyTransactionCashOnGoingInternalSlice.actions
    const { successBuyTransactionCashOnGoing, errorBuyTransactionCashOnGoing, loadingBuyTransactionCashOnGoing } = useSelector((state) => state.buyTransactionCashOnGoingInternalState)

    const handleBuyTransaction = (transactionId) => {
        const data = {
            transaction_id: transactionId,
        }
        dispatch(buyTransactionCashOnGoingInternal(data))
    }

    useEffect(() => {
        if (errorBuyTransactionCashOnGoing) {
            setError(errorBuyTransactionCashOnGoing) 

            const timer = setTimeout(() => {
                dispatch(resetBuyTransactionCashOnGoingInternal())
                setError(null)
            }, 200)

            return () => clearTimeout(timer)
        }
    }, [errorBuyTransactionCashOnGoing])

    useEffect(() => {
        setSpinner(loadingBuyTransactionCashOnGoing)
    }, [loadingBuyTransactionCashOnGoing])





    // check Transaction non cash to thired party
    const { updateStatusTransactionNonCashOnGoingInternalById } = transactionNonCashOnGoingInternalSlice.actions
    const { resetCheckTransactionNonCash } = checkTransactionNonCashInternalSlice.actions
    const { checkTransactionNonCashId, statusCheckTransactionNonCash, errorCheckTransactionNonCash, loadingCheckTransactionNonCash } = useSelector((state) => state.checkTransactionNonCashInternalState)

    const handleCheckTransactionNonCash = (transactionId) => {
        const data = {
            transaction_id: transactionId,
        }
        dispatch(checkTransactionNonCashInternal(data))
    } 

    useEffect(() => {
        if (checkTransactionNonCashId && statusCheckTransactionNonCash === "PAID") {
            const data = {
                id: checkTransactionNonCashId,
                status_transaction: statusCheckTransactionNonCash,
            }
            dispatch(updateStatusTransactionNonCashOnGoingInternalById(data))
            dispatch(resetCheckTransactionNonCash())
        } else {
            dispatch(resetCheckTransactionNonCash())
        }
    }, [checkTransactionNonCashId, statusCheckTransactionNonCash])

    useEffect(() => {
        setSpinner(loadingCheckTransactionNonCash)
    }, [loadingCheckTransactionNonCash])


    useEffect(() => {
        if (errorCheckTransactionNonCash) {
            setError(errorCheckTransactionNonCash)
        }
    }, [errorCheckTransactionNonCash])





    // handle history transaction by selecting filter
    const {resetTransactionHitoryInternal} = transactionHistoryInternalSlice.actions
    const {setData, setIncrementPage, resetData} = dataFilteringTransactionHistorySlice.actions
    const {method, status, startDate, endDate, startTime, endTime , page} = useSelector((state) => state.dataFilteringTransactionHistoryState)

    const [filters, setFilters] = useState({
        method: null,
        status: null,
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        dateError: null
    });

    console.log("filters", filters)

    // Handlers untuk update state
    const handleMethodChange = (method) => {
        setFilters(prev => ({...prev, method}));
    };

    const handleStatusChange = (status) => {
        setFilters(prev => ({...prev, status}));
    };

    const handleDateChange = (type, value) => {
        setFilters(prev => ({
        ...prev,
        [type]: value,
        dateError: null // Reset error saat date diubah
        }));
    };

    const handleTimeChange = (type, value) => {
        setFilters(prev => ({...prev, [type]: value}));
    };

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
        // Validasi tanggal
        if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate)
        const end = new Date(filters.endDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays > 92) {
            setFilters(prev => ({...prev, dateError: 'Maksimal rentang tanggal 92 hari'}))
            return;
        }
        }
        
        const data = {
            method: filters.method,
            status: filters.status,
            startDate: filters.startDate,
            endDate: filters.endDate,
            startTime: filters.startTime,
            endTime: filters.endDate,
            page: 1
        }

        dispatch(resetData())
        dispatch(resetTransactionHitoryInternal())
        dispatch(setData(data))
        dispatch(fetchTransactionHistory(data))
        // Lakukan apply filter disini
        console.log('Applied filters:', filters)
    };


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

            {/* create transactions or create order */}
            <div onClick={() => navigate("/internal/admin/kasir/transaction/create")} className="text-white h-10 rounded-md text-center cursor-pointer mb-6 font-semibold text-md py-2 transition-all duration-300 bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl">
                <button>Transaction</button>
            </div>


            {/* Filter & Search */}
            <div className="flex justify-between items-center mb-4">
                
                <div className="flex items-center space-x-3">
                    <button className={`flex items-center h-10 text-gray-700 border  border-black  px-4 py-1 rounded-md rounded-md ${filterTransaction === "methodCash" ? "bg-gray-900 text-white" : "bg-white"}`} onClick={() => setFilterTransaction("methodCash")}>
                        Method Cash
                    </button>

                    <button className={`flex items-center h-10 text-gray-700 border  border-black px-4 py-1 rounded-md rounded-md ${filterTransaction === "methodNonCash" ? "bg-gray-900 text-white" : "bg-white"}`} onClick={() => setFilterTransaction("methodNonCash")}>
                        Method Non Cash
                    </button>
                </div>

                <div>
                    {/* button show card select history */}
                   <div
                        onClick={() => setDateFilter(true)}
                        className="w-[220px] h-10 flex items-center bg-white justify-between border border-gray-300 rounded-md px-1 relative cursor-pointer hover:shadow-sm transition-all"
                        >
                        <div className="flex w-[80%] justify-between text-gray-800">
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-700">27/05/2025</span>
                                <span className="text-xs text-gray-500">12:00 AM</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm text-gray-700">27/05/2025</span>
                                <span className="text-xs text-gray-500">12:00 AM</span>
                            </div>
                        </div>
                        <CalendarRange className="text-black" size={20} />
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
                        className="w-full pl-10 pr-4 py-1 h-10 border placeholder-black text-black border-black rounded-md focus:outline-none focus:ring-2  focus:border-black-100 transition-all"
                    />
                    {/* Icon Search */}
                </div>

                <div className="flex space-x-2">
                    <button 
                    className={`flex items-center gap-2 h-10 px-4 py-1 rounded-md text-gray-700 border border-black ${filterTimeTransaction == "onGoing" ? "bg-gray-900 text-white" : "bg-white"}`}
                    onClick={() => setFilterTimeTransaction("onGoing")}
                    >
                        <History/>
                        On Going
                    </button>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="rounded-lg shadow-md overflow-hidden w-full">
                <table className="w-full text-left">
                    {(dataTransactionCashInternal && filterTransaction === "methodCash") || (dataTransactionNonCashInternal && filterTransaction !== "methodCash") ? (
                    <>
                        <thead className="bg-gray-900">
                        <tr>
                            {["Status", "Channel", "Account", "Amount", "Table/DineIn", "Date", "Buy"].map((header) => (
                            <th 
                                key={header} 
                                className="py-3 px-4 text-white font-medium text-sm border-b border-gray-200"
                            >
                                {header}
                            </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {(filterTransaction === "methodCash" ? dataTransactionCashInternal : dataTransactionNonCashInternal)?.map((t, index) => (
                            <tr 
                            key={index} 
                            className="bg-white text-black border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                            {filterTransaction === "methodCash" ? (
                                <td className="hidden">
                                <CountDownRemoveData 
                                    expiry={t.expires_at} 
                                    transactionId={t.id} 
                                    remove={removeTransactionCashOnGoingInternalById}
                                />
                                </td>
                            ) : (
                                <td className="hidden">
                                <CountDownRemoveData 
                                    expiry={t.expires_at} 
                                    transactionId={t.id} 
                                    remove={removeTransactionNonCashOnGoingInternalById}
                                />
                                </td>
                            )}
                            <td className="py-3 px-4 text-red-500">{t.status_transaction?.toLowerCase()}</td>
                            <td className="py-3 px-4">{t.channel_code?.toLowerCase()}</td>
                            <td className="py-3 px-4">{t.username}</td>
                            <td className="py-3 px-4 flex items-center gap-2">
                                {t.amount_price?.toLocaleString("id-ID")}
                            </td>
                            <td className="py-3 px-4">
                                {t.table === 0 ? t.order_type : t.table}
                            </td>
                            <td className="py-3 px-4">{FormatDate(t.created_at)}</td>
                            <td className="py-3 px-4">
                                <button 
                                // onClick={() => filterTransaction === "methodCash" 
                                //     ? handleBuyTransaction(t.id) 
                                //     : handleCheckPayment(t.id)}
                                className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition-colors"
                                >
                                {filterTransaction === "methodCash" ? "Buy" : "Check Payment"}
                                </button>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </>
                    ) : (
                    <tbody>
                        <tr>
                        <td colSpan="7">
                            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white p-8 text-center">
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
                                // onClick={handleFilterChange}
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

            {/* alert error */}
            { error && (
                <ErrorAlert message={error}/>
            )}
        </div>
    </div>
  );
};

export default TransactionTable;
