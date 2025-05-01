import { useState, useEffect } from "react"
import "../style/activity.css"
import BottomNavbar from "./bottomNavbar"
import { useNavigate, useLocation } from "react-router-dom"
import EmptyComponent from "./empty"
import notaImage from "../image/nota.png"
import { FormatISODate } from "../helper/formatdate"
import {OrderTypeInvalidAlert} from "./alert"
import { useSelector } from "react-redux"

export default function Activity() {
    const location = useLocation()
    const buttonstatus = location.state || "on going"
    const [buttonActive, setButtonActive] = useState(buttonstatus);
    const navigate = useNavigate();
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
    const [activity, setActivity] = useState([
        {
            date: "Modey,14-02-2025",
            detail: [
                {
                    Id: 7971373683,
                    methodPembelian: "Dine In",
                    amount: 150000,
                    status: "One Proses",
                    methodPembayaran: 'BCA',
                    statusPembayaran: 'Gagal',
                    amountItem: 4,
                    clock: '4:55 PM',
                    notes: "banyakin sambelnya",
                    items: [
                        {
                            name: 'Sate Ayam merah maranggi',
                            harga: 45000,
                            image: 'sate-ayam.png',
                            description: 'Sate ayam dengan bumbu kacang.'
                          },
                          {
                            name: 'Nasi Goreng',
                            harga: 30000,
                            image: 'nasi-goreng.png',
                            description: 'Nasi goreng spesial dengan telur dan ayam.'
                          }
                    ]
                },
                {
                    Id: 79732324423,
                    methodPembelian: "Take Away",
                    amount: 50000,
                    status: "Fineshid",
                    methodPembayaran: 'QRCode',
                    statusPembayaran: 'Succesfully',
                    amountItem: 4,
                    clock: '5:55 PM',
                    notes: 'banyakin sayurnya dan micinnya dikit aja',
                    items: [
                        {
                            name: 'Sate Ayam merah maranggi',
                            harga: 45000,
                            image: 'sate-ayam.png',
                            description: 'Sate ayam dengan bumbu kacang.'
                          },
                          {
                            name: 'Nasi Goreng',
                            harga: 30000,
                            image: 'nasi-goreng.png',
                            description: 'Nasi goreng spesial dengan telur dan ayam.'
                          }
                    ]
                }
            ]
        },
    ])

    const [pendingTransactions, setPendingTransactions] = useState(
        [
            {
                Id: 7971373683,
                methodPembelian: "Dine In",
                amount: 150000,
                status: "Pending",
                methodPembayaran: 'BCA',
                statusPembayaran: 'Pending',
                amountItem: 4,
                clock: '4:55 PM',
                notes: "Banyakin sambelnya",
                expiryTime: "2025-09-24T14:04:00Z", // Waktu kadaluarsa pembayaran
                paymentDetails: {
                    type: "Bank Transfer",
                    data: "1234567890", // Nomor VA untuk transfer bank
                },
                items: [
                    {
                        name: 'Sate Ayam Merah Maranggi',
                        harga: 45000,
                        image: 'sate-ayam.png',
                        description: 'Sate ayam dengan bumbu kacang.'
                    },
                    {
                        name: 'Nasi Goreng',
                        harga: 30000,
                        image: 'nasi-goreng.png',
                        description: 'Nasi goreng spesial dengan telur dan ayam.'
                    }
                ]
            },
            {
                Id: 79732324423,
                methodPembelian: "Take Away",
                amount: 50000,
                status: "On Proces",
                methodPembayaran: 'DANA',
                statusPembayaran: 'successfully',
                amountItem: 4,
                clock: '5:55 PM',
                notes: 'Banyakin sayurnya dan micinnya dikit aja',
                expiryTime: "2023-11-05T18:45:00Z", // Waktu kadaluarsa pembayaran
                paymentDetails: {
                    type: "E-Wallet",
                    data: "https://dana.id/payment/redirect/79732324423" // Link redirect ke pembayaran
                },
                items: [
                    {
                        name: 'Sate Ayam Merah Maranggi',
                        harga: 45000,
                        image: 'sate-ayam.png',
                        description: 'Sate ayam dengan bumbu kacang.'
                    },
                    {
                        name: 'Nasi Goreng',
                        harga: 30000,
                        image: 'nasi-goreng.png',
                        description: 'Nasi goreng spesial dengan telur dan ayam.'
                    }
                ]
            },
            {
                Id: 7978912345,
                methodPembelian: "Dine In",
                amount: 100000,
                status: "On Progres",
                methodPembayaran: 'QRCode',
                statusPembayaran: 'successfully',
                amountItem: 2,
                clock: '6:30 PM',
                notes: 'Pedas level 3',
                expiryTime: "2024-06-15T08:30:00Z", // Waktu kadaluarsa pembayaran
                paymentDetails: {
                    type: "QRIS",
                    data: "00020101021226600017ID.CO.QRIS.WARUNG0105112345678952040000530398654061000005802ID5913Warung Makan6013Jakarta Selatan62100507ABCD12346304E0B6" // Data QRIS untuk pembayaran
                },
                items: [
                    {
                        name: 'Mie Ayam Special',
                        harga: 35000,
                        image: 'mie-ayam.png',
                        description: 'Mie ayam dengan topping ayam cincang dan pangsit.'
                    },
                    {
                        name: 'Es Teh Manis',
                        harga: 10000,
                        image: 'es-teh.png',
                        description: 'Teh manis dengan es batu segar.'
                    }
                ]
            },
            {
                Id: 7978912345,
                methodPembelian: "Dine In",
                amount: 100000,
                status: "Pending",
                methodPembayaran: 'QRCode',
                statusPembayaran: 'Pending',
                amountItem: 2,
                clock: '6:30 PM',
                notes: 'Pedas level 3',
                expiryTime: "2025-02-20T12:00:00Z", // Waktu kadaluarsa pembayaran
                paymentDetails: {
                    type: "QRIS",
                    data: "00020101021226600017ID.CO.QRIS.WARUNG0105112345678952040000530398654061000005802ID5913Warung Makan6013Jakarta Selatan62100507ABCD12346304E0B6" // Data QRIS untuk pembayaran
                },
                items: [
                    {
                        name: 'Mie Ayam Special',
                        harga: 35000,
                        image: 'mie-ayam.png',
                        description: 'Mie ayam dengan topping ayam cincang dan pangsit.'
                    },
                    {
                        name: 'Es Teh Manis',
                        harga: 10000,
                        image: 'es-teh.png',
                        description: 'Teh manis dengan es batu segar.'
                    }
                ]
            }
    ]);
    

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
                            onClick={() => setButtonActive("on going")}
                            className={buttonActive !== "on going" ? "button-activity" : "button-activity-active"}
                        >
                            <p className="cart-badge-profile">
                                2
                            </p>
                            On Going 
                        </button>
                        <button 
                            onClick={() => setButtonActive("history")}
                            className={buttonActive !== "history" ? "button-activity" : "button-activity-active"}
                        >
                            History
                        </button>
                    </div>
                    {/* detail activity */}
                    { buttonActive === 'history' && activity.length > 0 && activity.map((act) => (
                    <div>
                        <div className="date-activity">
                            <span>Today</span>
                            <span>{act.date}</span>
                        </div>
                        { act.detail.map((htr) => (
                            <div 
                            onClick={() => handleDetail({
                                date: act.date,
                                id: htr.Id,
                                methodPembelian: htr.methodPembelian,
                                amount: htr.amount,
                                status: htr.status,
                                methodPembayaran: htr.methodPembayaran,
                                statusPembayaran: htr.statusPembayaran,
                                amountItem: htr.amountItem,
                                clock: htr.clock,
                                notes: htr.notes,
                                items: htr.items,
                            })}
                            className="fill-container-body-activity"
                            >
                                <div className="object-fill-container-body-activity width-1">
                                    <span className="desc-activity">{htr.methodPembelian}</span>
                                    <span className="detail-desc">{htr.amountItem} items</span>
                                </div>
                                <div className="object-fill-container-body-activity width-2">
                                    <span className="desc-activity" style={{fontSize: '15px'}}>{(htr.amount).toLocaleString()} IDR</span>
                                    <span className="detail-desc">{htr.Id}</span>
                                </div>
                                <div className="object-fill-container-body-activity width-3">
                                    <spann className="desc-status">{htr.status}</spann>
                                    <span className="detail-desc">{htr.clock}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    ))}

                    {/* belom bayar section */}
                    <div>
                        { buttonActive === 'on going' && pendingTransactions.length > 0 && (
                            <div style={{display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '50px'}}>
                                {pendingTransactions.map((data) => (
                                    <div className="container-belum-bayar p-6 bg-light">
                                        <p style={{textAlign: 'end', margin: '5px 0'}}>
                                            {data.statusPembayaran === 'Pending' ? 'Belum Bayar' : data.status}
                                        </p>
                                        <div className=" ">
                                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                                { data.items.map((item) => (
                                                    <div className="container-item flex">
                                                        <img src={require("../image/foto1.jpg")} style={{width: '60px', height: '60px'}}/>
                                                        <div className="item-information">
                                                            <div className="item-title">
                                                                <p>{item.name}</p>
                                                            </div>
                                                            <div className="spase-bettwen font-17 text-gray-500">
                                                                <p>Rp {(item.harga).toLocaleString("id-ID")}</p>
                                                                <p>x2</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div>
                                                    <div className="spase-bettwen" style={{padding: '15px 0'}}>
                                                        <p>{data.amountItem} item</p>
                                                        <p>{data.status === 'Pending' ? `Jumlah Harus Dibayar : Rp${(data.amount).toLocaleString("id-ID")}` : `Rp${(data.amount).toLocaleString('id-ID')}`}</p>
                                                    </div>
                                                    <div className="spase-bettwen">
                                                        {data.status === 'Pending'  && (<p>Bayar sebelum {FormatISODate(data.expiryTime)}</p>)}
                                                        {data.status === 'Pending'  && (<button onClick={() => handlePembayaran({
                                                            amount: data.amount,
                                                            methodPembayaran: data.methodPembayaran,
                                                            exp: data.expiryTime,
                                                            unixNumber: data.paymentDetails.data,
                                                        })}
                                                        className="text-white transition-colors button-on-going" 
                                                        style={{backgroundColor: 'red'}}
                                                        >
                                                            Bayar Sekarang
                                                        </button>)}
                                                    </div>
                                                    {data.status === 'Finished' && (
                                                        <div style={{display: 'flex', justifyContent: 'end'}}>
                                                            <button className="bg-blue-600 text-white transition-colors button-on-going" style={{alignItems: 'end'}}>Diterima</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>    
                                ))}
                            </div>
                        )}
                    </div>

                    {/* section cart */}
                    { activity.length < 1 && buttonActive === 'history' && (
                        <div>
                            <EmptyComponent
                            gambar={notaImage}
                            title={"Mulai Belanja Sekarang!"}
                            desc={"Anda belum memiliki aktivitas belanja. Yuk, jelajahi menu dan lakukan pesanan pertama Anda."}
                            />
                        </div>
                    )}

                    { pendingTransactions.length < 1 && buttonActive === 'on going' && (
                        <div>
                            <EmptyComponent
                            gambar={notaImage}
                            title={"Mulai Belanja Sekarang!"}
                            desc={"Anda belum memiliki aktivitas belanja. Yuk, jelajahi menu dan lakukan pesanan pertama Anda."}
                            />
                        </div>
                    )}

                </div>
                <BottomNavbar/>
            </div>
        </div>
    )
} 