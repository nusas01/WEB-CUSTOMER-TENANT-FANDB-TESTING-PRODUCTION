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
import {fetchTransactionOnGoingCustomer, fetchTransactionHistoryCustomer} from "../actions/get"
import { SpinnerRelative } from "../helper/spinner"
import { buttonActivityCustomerSlice } from "../reducers/reducers"
import { da } from "date-fns/locale"
import { Clock, UtensilsCrossed, ChevronRight } from 'lucide-react';


export default function Activity() {
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate();
    const buttonstatus = location.state || "on going"
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
    const [spinner, setSpinner] = useState(false)
   
    
    // get data transaction on goin 
    const {dataTransactionOnGoing, lengthTransactionOnGoing, loading} = useSelector((state) => state.persisted.transactionOnGoingCustomer)
    useEffect(() => {
        setSpinner(loading)
    }, [loading])
    console.log("data transaction on goin: ", dataTransactionOnGoing)

    // get data transaction history or finished
    const {dataTransactionHistory, loadingHistory, lengthTransactionProses} = useSelector((state) => state.persisted.transactionsHistoryCustomer)
    console.log("apa yang terjadi terjadi: ", dataTransactionHistory)
    useEffect(() => {
        setSpinner(loadingHistory)
    }, [loadingHistory])
    

    // get data button active status
    const {setButtonActivity} = buttonActivityCustomerSlice.actions
    const {buttonActive} = useSelector((state) => state.persisted.buttonActivityCustomer)
    const handleButtonActivity = (data) => {
        dispatch(setButtonActivity(data))
    }


    const handleDetail = (detailOrder) => {
        navigate("/activity/detail", { state: { detailOrder } })
    }

    const handlePembayaran = (detailOrder) => {
        navigate("/activity/pembayaran", {state: { detailOrder }})
    }

    const {tableId, orderTakeAway} = useSelector((state) => state.persisted.orderType)
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

                    {spinner && (
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
                                            handleDetail({
                                            id: trx.id,
                                            created_at: trx.created_at,
                                            items: trx.order,
                                            subTotal: trx.sub_total,
                                            fee: trx.payment_method_fee,
                                            tax: trx.tax,
                                            amount: trx.amount_price,
                                            methodPembayaran: trx.payment_method_type,
                                            channel_code: trx.channel_code,
                                            statusPembayaran: trx.order_status,
                                            notes: "lupa kasih notes",
                                            })
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
                        {buttonActive === 'on going' && !spinner &&  (
                            Array.isArray(dataTransactionOnGoing) && dataTransactionOnGoing.length > 0 ? (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '50px'}}>
                                    {dataTransactionOnGoing.map((data, index) => (
                                        <div key={index} className="container-belum-bayar p-6 bg-light">
                                            { data.status_transaction == 'PENDING' && (
                                                <p class="hidden"><CountDown expiry={data.expires_at} transactionId={data.id}/></p>
                                            )}
                                            <div className="flex justify-end">
                                                { data.status_transaction === "PENDING" ? (
                                                    <p style={{margin: '5px 0'}}>
                                                        Belum Bayar
                                                    </p>
                                                ):(
                                                        <p
                                                            style={{ margin: "5px 0" }}
                                                            className={`inline-block px-4 py-2 rounded text-xs italic 
                                                                ${data.order_status === "PROSES" ? "bg-red-100 text-red-900" : ""}
                                                                ${data.order_status === "PROGRES" ? "bg-yellow-100 text-yellow-900" : ""}
                                                                ${data.order_status === "FINISHED" ? "bg-green-100 text-green-900" : ""}
                                                            `}
                                                            >
                                                            {data.order_status}
                                                        </p>
                                                )}
                                            </div>

                                            <div>
                                                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                                    {data.order.map((item, idx) => (
                                                        <div key={idx} className="container-item flex">
                                                            <img
                                                                src={`/image/${item.product.image}`} // sesuaikan path folder gambar kamu
                                                                style={{width: '100px', height: '100px'}}
                                                                className="object-cover"
                                                                alt={item.product.name}
                                                            />
                                                            <div className="item-information">
                                                                <div className="item-title">
                                                                    <p>{item.product.name}</p>
                                                                </div>
                                                                <div className="spase-bettwen font-17 text-gray-500">
                                                                    <p>Rp {(item.product.price).toLocaleString("id-ID")}</p>
                                                                    <p>x{item.quantity}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    <div>
                                                        <div>
                                                            <div className="flex justify-between items-center" style={{ padding: '15px 0' }}>
                                                                <p>{data.order.length} item</p>
                                                                
                                                                {(data.status_transaction === "PAID" && data.order_status === 'PROCESS') ? (
                                                                <p>Pesanan Anda Sedang Kami Proses</p>
                                                                ) : data.order_status === "PROGRESS" ? (
                                                                <p>Pesanan Sedang Diproses</p>
                                                                ) : data.order_status === "FINISHED" ? (
                                                                <p>Pesanan Selesai</p>
                                                                ) : (
                                                                <p>Jumlah Harus Dibayar: Rp{data.amount_price.toLocaleString("id-ID")}</p>
                                                                )}
                                                            </div>
                                                        </div>


                                                        {data.status_transaction !== 'PAID' && (
                                                            <div className="spase-bettwen">
                                                                <p>Bayar sebelum {FormatISODate(data.expires_at)}</p>
                                                                <button
                                                                    onClick={() => {
                                                                        if (data.payment_method_type === "EWALLET") {
                                                                            {localStorage.setItem("pendingTransaction", data.id)}
                                                                            window.location.href = data.payment_reference; // atau URL redirect yang sesuai
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
                                                                    className="text-white transition-colors button-on-going"
                                                                    style={{backgroundColor: 'red'}}
                                                                >
                                                                    Bayar Sekarang
                                                                </button>
                                                            </div>
                                                        )}

                                                        {data.status_transaction === 'FINISHED' && (
                                                            <div style={{display: 'flex', justifyContent: 'end'}}>
                                                                <button className="bg-blue-600 text-white transition-colors button-on-going">
                                                                    Diterima
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <EmptyHistory gambar={historyIcon} title={"Belum Ada Transaksi"} desc={"Kamu belum memiliki transaksi yang sedang berlangsung. Mulai belanja dan lihat aktivitasmu di sini!"}/>
                            )
                        )}
                    </div>

                </div>
                <BottomNavbar/>
            </div>
        </div>
    )
} 