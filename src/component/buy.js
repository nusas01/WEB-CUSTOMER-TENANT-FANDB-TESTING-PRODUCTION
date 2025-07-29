import "../style/buy.css"
import { useNavigate, useLocation } from "react-router-dom"
import ImagePaymentMethod from "../helper/imagePaymentMethod"
import { FormatISODate } from "../helper/formatdate"
import { CountDown } from "../helper/countDown"
import {QRCodeCanvas } from 'qrcode.react'
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { OrderTypeInvalidAlert } from "./alert"

export default function Buy() {
    const navigate = useNavigate()
    const location = useLocation()
    const detailOrder = location.state?.detailOrder || {}
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)

    window.scrollTo(0, 0);
    
    const {tableId, orderTakeAway} = useSelector((state) => state.persisted.orderType)
    useEffect(() => {
        if (tableId === null && orderTakeAway === false) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway])

    return (
        <div className="min-h-screen bg-gray-50">
            {orderTypeInvalid && (
                <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
            )}
            
            {/* Header */}
            <div className="flex items-center gap-8 p-6 bg-white">
                <svg 
                    onClick={() => navigate("/activity")} 
                    className="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors"
                    xmlns="http://www.w3.org/2000/svg" 
                    width="30" 
                    height="30" 
                    fill="currentColor" 
                    viewBox="0 0 16 16"
                >
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
                <h1 className="text-lg font-medium text-gray-900">Pembayaran</h1>
            </div>
            
            {/* Total Payment */}
            <div className="bg-white border-b border-gray-200">
                <div className="flex justify-between items-center p-6">
                    <p className="text-gray-700">Total Pembayaran</p>
                    <p className="text-xl font-semibold text-gray-900">
                        Rp {detailOrder?.amount != null ? Number(detailOrder.amount).toLocaleString("id-ID") : "-"}
                    </p>
                </div>
            </div>
            
            {/* Payment Timer */}
            <div className="bg-white mb-5 border-b-[20px] border-gray-200">
                <div className="flex justify-between items-start p-6">
                    <p className="text-gray-700">Pembayaran Dalam</p>
                    <div className="text-right">
                        <p className="text-green-600 font-medium">
                            <CountDown expiry={detailOrder?.exp || detailOrder?.expires_at} transactionId={detailOrder.id}/>
                        </p>
                        {(detailOrder?.exp || detailOrder?.expires_at) ? (
                            <p className="text-sm text-gray-500 mt-1">
                                Jatuh tempo {FormatISODate(detailOrder.exp || detailOrder.expires_at)}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500 mt-1">Jatuh tempo -</p>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Payment Method Content */}
            {detailOrder.channel_code === "QRIS" ? (
                <div className="bg-white flex flex-col items-center justify-center text-center py-8">
                    <div className="mb-6">
                        {ImagePaymentMethod(detailOrder?.channel_code, "100px", "100px")}
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <QRCodeCanvas size={250} value={detailOrder?.unixNumber || detailOrder?.qr_code_url}/>
                    </div>
                </div>
            ) : detailOrder.channel_code === "CASH" ? (
                <div className="bg-white">
                    <div className="flex justify-center items-center p-6 text-xl font-semibold text-gray-900 border-b-[20px] border-gray-200">
                        <p>CASH</p>
                    </div>
                    
                    {/* Instructions Header */}
                    <div className="border-b border-gray-200">
                        <p className="p-6 font-medium text-gray-900">Petunjuk Pembayaran</p>
                    </div>
                    
                    {/* Instructions Steps */}
                    <div className="p-6 space-y-4">
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                            <p className="text-gray-700 leading-relaxed">
                                Silakan datang langsung ke kasir.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                            <p className="text-gray-700 leading-relaxed">
                                Beritahukan kepada kasir bahwa Anda ingin melakukan pembayaran secara <strong className="text-gray-900">tunai</strong> untuk pesanan Anda, lalu sebutkan <strong className="text-gray-900">username akun</strong> Anda untuk memudahkan pencarian data.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                            <p className="text-gray-700 leading-relaxed">
                                Serahkan uang sejumlah total tagihan kepada kasir. Setelah pembayaran dikonfirmasi, pesanan Anda akan segera diproses oleh sistem.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white">
                    {/* Payment Method Info */}
                    <div className="border-b-[20px] border-gray-200">
                        <div className="flex">
                            <div className="p-6 flex-shrink-0">
                                {ImagePaymentMethod(detailOrder?.channel_code)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="border-b border-gray-200">
                                    <p className="p-6 font-medium text-gray-900">{detailOrder?.channel_code}</p>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-600 mb-2">No.Rekening:</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-green-600 font-semibold text-xl font-mono">
                                            {detailOrder?.virtual_account_number || detailOrder?.unixNumber}
                                        </p>
                                        <button className="px-3 py-1 text-sm text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors">
                                            Salin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Transfer Instructions */}
                    <div>
                        <div className="border-b border-gray-200">
                            <p className="p-6 font-medium text-gray-900">Petunjuk Transfer mBanking</p>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                                <p className="text-gray-700 leading-relaxed">Pilih Menu Lain &gt; Transfer.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                                <p className="text-gray-700 leading-relaxed">Pilih Jenis rekening asal dan pilih Virtual Account Billing.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                                <p className="text-gray-700 leading-relaxed">
                                    Masukkan nomor virtual account: <span className="font-mono text-green-600 font-medium">{detailOrder.unixNumber}</span> dan pilih Benar.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">4</span>
                                <p className="text-gray-700 leading-relaxed">
                                    Jumlah transfer akan otomatis terisi sesuai dengan total pembayaran pesanan Anda. Pastikan jumlah yang tertera sesuai, lalu pilih Ya
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">5</span>
                                <p className="text-gray-700 leading-relaxed">
                                    Periksa informasi di layar. Pastikan Merchant adalah <span className="font-medium text-gray-900">NusasFood</span> dan detail pesanan sudah benar. Jika sudah sesuai, pilih Ya
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}