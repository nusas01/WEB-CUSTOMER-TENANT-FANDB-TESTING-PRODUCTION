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
                                <div key={actIndex} className="mb-8">
                                  <div className="flex items-center gap-3 mb-4">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="text-sm font-medium text-gray-500">
                                      {new Date(date).toDateString() === new Date().toDateString()
                                        ? "Today"
                                        : new Date(date).toLocaleDateString('en-ID', {
                                            weekday: 'short',
                                            day: 'numeric',
                                            month: 'short',
                                          })}
                                    </span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                  </div>
                              
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
                                      className="bg-white rounded-xl p-4  mb-3 shadow-sm hover:shadow-md transition-shadow
                                                 border border-gray-100 cursor-pointer grid grid-cols-3 gap-4"
                                    >
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-gray-800">{trx.order_type}</span>
                                        </div>
                                        <span className="text-sm text-gray-500 block">{trx.quantity} items</span>
                                      </div>
                              
                                      <div className="space-y-1 flex justify-center items-center">
                                        <span className="block font-semibold text-gray-900">
                                          {trx.amount_price.toLocaleString()} IDR
                                        </span>
                                      </div>
                              
                                      <div className="space-y-2 text-right">
                                        <span className={`inline-block px-2  py-1  rounded text-xs italic bg-green-100 text-green-800'}`}>
                                          {trx.order_status}
                                        </span>
                                        <span className="block text-sm text-gray-500">
                                          {new Date(trx.created_at).toLocaleTimeString('en-ID', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
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