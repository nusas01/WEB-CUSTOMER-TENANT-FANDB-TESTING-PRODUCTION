import { useState, useEffect } from "react"
import "../style/activity.css"
import BottomNavbar from "./bottomNavbar"
import { useNavigate, useLocation } from "react-router-dom"
import { EmptyComponent, EmptyHistory} from "./empty"
import notaImage from "../image/nota.png"
import { FormatISODate } from "../helper/formatdate"
import {OrderTypeInvalidAlert} from "./alert"
import { useSelector, useDispatch } from "react-redux"
import historyIcon from "../image/nota.png"
import { CountDown } from "../helper/countDown"
import {fetchDetailTransactionHistoryCustomer, fetchTransactionHistoryCustomer, loginStatusCustomer} from "../actions/get"
import { SpinnerRelative } from "../helper/spinner"
import { buttonActivityCustomerSlice } from "../reducers/reducers"
import { da } from "date-fns/locale"
import { 
    Clock, 
    AlertCircle, 
    ChevronRight,
    CheckCircle,
    Loader2,
    Package,
    Truck,
    CreditCard,
} from 'lucide-react';
import {getDetailTransactionsHistoryCustomerSlice} from '../reducers/get'
import { setOrderTypeContext } from "../reducers/reducers"

export default function Activity() {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate();
    const buttonstatus = location.state || "on going"
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
    const [spinner, setSpinner] = useState(false)

    useEffect(() => {
        dispatch(loginStatusCustomer())
    }, [])

    const { loggedIn } = useSelector((state) => state.persisted.loginStatusCustomer)
    useEffect(() => {
        if (!loggedIn) {
        } 
    }, [loggedIn])
    
    // get data transaction on goin 
    const {dataTransactionOnGoing, lengthTransactionOnGoing, loading} = useSelector((state) => state.persisted.transactionOnGoingCustomer)
    useEffect(() => {
        setSpinner(loading)
    }, [loading])

    // get data transaction history or finished
    const {dataTransactionHistory, loadingHistory, lengthTransactionProses} = useSelector((state) => state.persisted.transactionsHistoryCustomer)
    useEffect(() => {
        setSpinner(loadingHistory)
    }, [loadingHistory])

    // get data transaction history
    useEffect(() => {
    if (!dataTransactionHistory || Object.keys(dataTransactionHistory).length === 0) {
        dispatch(fetchTransactionHistoryCustomer(1))
    }  
    }, [])
    

    // get data button active status
    const {setButtonActivity} = buttonActivityCustomerSlice.actions
    const {buttonActive} = useSelector((state) => state.persisted.buttonActivityCustomer)
    const handleButtonActivity = (data) => {
        dispatch(setButtonActivity(data))
    }

    const {resetError} = getDetailTransactionsHistoryCustomerSlice.actions;
    const handleDetail = (id) => {
        dispatch(resetError());
        dispatch(fetchDetailTransactionHistoryCustomer(id))
        navigate("/activity/detail", {state: {id}})
    }

    const handlePembayaran = (detailOrder) => {
        navigate("/activity/pembayaran", {state: { detailOrder }})
    }

    
    // get table id or order_tye_take_away = true from query
    const {tableId, orderTakeAway} = useSelector((state) => state.persisted.orderType)
    if (orderTakeAway === null && tableId === null) {
        const q = new URLSearchParams(location.search);
        const orderTakeAways = q.get("order_type_take_away") === "true";
        const tableIds = q.get("table_id");

        dispatch(setOrderTypeContext({ orderTakeAway: orderTakeAways, tableId: tableIds }));
    }

    useEffect(() => {
        if (tableId === null && orderTakeAway === false) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway])

    return (
        <div>
            <div className="container-activity bg-light">

                { orderTypeInvalid && (
                    <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
                )}

                <div className="body-activity p-6">
                    <div className="container-button-activity">
                        <button 
                            onClick={() => handleButtonActivity("on going")}
                            className={buttonActive !== "on going" ? "button-activity" : "button-activity-active"}
                        >
                            { lengthTransactionOnGoing > 0 && buttonActive !== "on going" && (
                                <p className="cart-badge-profile">
                                    {lengthTransactionOnGoing}
                                </p>
                            )}
                            On Going 
                        </button>
                        <button 
                            onClick={() => handleButtonActivity("history")}
                            className={buttonActive !== "history" ? "button-activity" : "button-activity-active"}
                        >
                            {lengthTransactionProses > 0 && buttonActive !== "history" && (
                                <p className="cart-badge-profile">
                                    {lengthTransactionProses}
                                </p>
                            )}   
                            History
                        </button>
                    </div>

                    {((buttonActive === 'history' && loadingHistory) || (buttonActive === 'on going' && loading)) && (
                        <SpinnerRelative h="h-[70vh]"/>
                    )}

                    {/* HISTORY */}
                    {buttonActive === 'history' && !spinner && (
                        Object.entries(dataTransactionHistory).length > 0 ? (
                            Object.entries(dataTransactionHistory).map(([date, transactions], actIndex) => (
                                <div key={actIndex} className="mb-10">
                                    {/* Modern Date Separator */}
                                    <div className="relative flex items-center justify-center mb-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                    </div>
                                    <div className="relative bg-white px-6 py-2">
                                        <div className="flex items-center gap-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-4 py-2 shadow-sm border border-gray-100">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-semibold text-gray-700">
                                            {new Date(date).toDateString() === new Date().toDateString()
                                            ? "Hari Ini"
                                            : new Date(date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                })}
                                        </span>
                                        </div>
                                    </div>
                                    </div>

                                    {/* Transaction Cards */}
                                    <div className="space-y-3">
                                    {transactions.map((trx, htrIndex) => (
                                        <div
                                        key={htrIndex}
                                        onClick={() =>
                                            handleDetail(trx.id)
                                        } 
                                        className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300
                                                    border border-gray-100 cursor-pointer transform hover:-translate-y-1 
                                                    hover:border-gray-200 backdrop-blur-sm relative overflow-hidden"
                                        >
                                        {/* Subtle gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        
                                        <div className="relative grid grid-cols-12 gap-4 items-center">
                                            {/* Left Section - Order Info */}
                                            <div className="col-span-4 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                    <span className="font-semibold text-gray-800 text-base group-hover:text-gray-900 transition-colors">
                                                        {trx.order_type}
                                                    </span>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <span className="text-sm text-gray-500">{trx.quantity} items</span>
                                                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                                        <span className="text-sm text-gray-500">
                                                        {new Date(trx.created_at).toLocaleTimeString('id-ID', {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                        </span>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Center Section - Amount */}
                                            <div className="col-span-4 text-center">
                                            <div className="space-y-1">
                                                <span className="block text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                                Rp {trx.amount_price.toLocaleString('id-ID')}
                                                </span>
                                                <div className="w-16 h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 mx-auto rounded-full"></div>
                                            </div>
                                            </div>

                                            {/* Right Section - Status & Arrow */}
                                            <div className="col-span-4 flex items-center justify-end gap-3">
                                                <div className="text-right space-y-2">
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                                    {trx.order_status}
                                                    </span>
                                                </div>
                                                
                                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                                            </div>
                                        </div>

                                        {/* Bottom accent line */}
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                                        </div>
                                    ))}
                                    </div>
                                </div>
                                ))                         
                            ) : (
                                <EmptyHistory gambar={historyIcon} title={"Belom Ada Transaction"} desc={"Kamu belum pernah membuat transaksi. Mulai belanja dan lihat aktivitasmu di sini!"}/>
                        )
                    )}


                    
                    {/* TRANSACTION ON GOING */}
                    <div>
                        {buttonActive === 'on going' && !spinner && (
                            Array.isArray(dataTransactionOnGoing) && dataTransactionOnGoing.length > 0 ? (
                                <div className="flex flex-col gap-4 mb-12 px-4">
                                    {dataTransactionOnGoing.map((data, index) => (
                                        <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                            {data.status_transaction == 'PENDING' && (
                                                <p className="hidden"><CountDown expiry={data.expires_at} transactionId={data.id}/></p>
                                            )}
                                            
                                            {/* Status Header */}
                                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                        <span className="text-sm font-medium text-gray-600">Transaction ID: #{data.id}</span>
                                                    </div>
                                                    {data.status_transaction === "PENDING" ? (
                                                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
                                                            <Clock className="w-4 h-4" />
                                                            Belum Bayar
                                                        </span>
                                                    ) : (
                                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                                                            ${data.order_status === "PROSES" ? "bg-red-100 text-red-800" : ""}
                                                            ${data.order_status === "PROGRES" ? "bg-yellow-100 text-yellow-800" : ""}
                                                            ${data.order_status === "FINISHED" ? "bg-green-100 text-green-800" : ""}
                                                        `}>
                                                            {data.order_status === "PROSES" && <AlertCircle className="w-4 h-4" />}
                                                            {data.order_status === "PROGRES" && <Loader2 className="w-4 h-4 animate-spin" />}
                                                            {data.order_status === "FINISHED" && <CheckCircle className="w-4 h-4" />}
                                                            {data.order_status}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Items */}
                                            <div className="p-6">
                                                <div className="space-y-4">
                                                    {data.order.map((item, idx) => (
                                                        <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                                                            <div className="relative">
                                                                <img
                                                                    src={`https://nusas-bucket.oss-ap-southeast-5.aliyuncs.com/${item.product.image}`}
                                                                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                                                    alt={item.product.name}
                                                                />
                                                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                                                    {item.quantity}
                                                                </div>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-gray-900 text-base leading-tight mb-2">
                                                                    {item.product.name}
                                                                </h4>
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-green-600 font-bold text-lg">
                                                                        Rp {(item.product.price).toLocaleString("id-ID")}
                                                                    </span>
                                                                    <span className="text-gray-500 text-sm bg-white px-2 py-1 rounded-md">
                                                                        x{item.quantity}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Summary Section */}
                                                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Package className="w-5 h-5 text-green-600" />
                                                            <span className="font-medium text-gray-700">{data.order.length} item</span>
                                                        </div>
                                                        
                                                        <div className="text-right">
                                                            {(data.status_transaction === "PAID" && data.order_status === 'PROCESS') ? (
                                                                <div className="flex items-center gap-2 text-blue-600">
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    <span className="text-sm font-medium">Pesanan Anda Sedang Kami Proses</span>
                                                                </div>
                                                            ) : data.order_status === "PROGRESS" ? (
                                                                <div className="flex items-center gap-2 text-yellow-600">
                                                                    <Truck className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">Pesanan Sedang Diproses</span>
                                                                </div>
                                                            ) : data.order_status === "FINISHED" ? (
                                                                <div className="flex items-center gap-2 text-green-600">
                                                                    <CheckCircle className="w-4 h-4" />
                                                                    <span className="text-sm font-medium">Pesanan Selesai</span>
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <p className="text-sm text-gray-600 mb-1">Total Pembayaran</p>
                                                                    <p className="text-2xl font-bold text-green-600">
                                                                        Rp {data.amount_price.toLocaleString("id-ID")}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Payment Actions */}
                                                    {data.status_transaction !== 'PAID' && (
                                                        <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Clock className="w-4 h-4 text-amber-600" />
                                                                <span className="text-sm text-amber-700 font-medium">
                                                                    Bayar sebelum {FormatISODate(data.expires_at)}
                                                                </span>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    if (data.payment_method_type === "EWALLET") {
                                                                        localStorage.setItem("pendingTransaction", data.id);
                                                                        window.location.href = data.payment_reference;
                                                                    } else {
                                                                        handlePembayaran({
                                                                            id: data.id,
                                                                            amount: data.amount_price,
                                                                            methodPembayaran: data.payment_method_type,
                                                                            exp: data.expires_at,
                                                                            unixNumber: data.payment_reference,
                                                                            channel_code: data.channel_code,
                                                                        });
                                                                    }
                                                                }}
                                                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg"
                                                            >
                                                                <CreditCard className="w-5 h-5" />
                                                                Bayar Sekarang
                                                            </button>
                                                        </div>
                                                    )}

                                                    {data.status_transaction === 'FINISHED' && (
                                                        <div className="flex justify-end mt-4">
                                                            <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 shadow-lg">
                                                                <CheckCircle className="w-5 h-5" />
                                                                Diterima
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyHistory 
                                    gambar={historyIcon} 
                                    title={"Belum Ada Transaksi"} 
                                    desc={"Kamu belum memiliki transaksi yang sedang berlangsung. Mulai belanja dan lihat aktivitasmu di sini!"} 
                                />
                            )
                        )}
                    </div>

                </div>
                <BottomNavbar/>
            </div>
        </div>
    )
} 