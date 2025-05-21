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
        <div className="container-activity bg-light">
            { orderTypeInvalid && (
                <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
            )}
            <div className="flex p-6" style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
                <svg onClick={() => navigate("/activity")} style={{cursor: 'pointer'}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
                <p className="text-lg">Pembayaran</p>
            </div>
            <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.2)'}}>
                    <div className="spase-bettwen p-6">
                        <p>Total Pembayaran</p>
                        <p className="text-xl">Rp {detailOrder?.amount != null ? Number(detailOrder.amount).toLocaleString("id-ID") : "-"}</p>
                    </div>
                </div>
                <div style={{borderBottom: '20px solid rgba(0, 0, 0, 0.2)'}}>
                    <div className="spase-bettwen p-6">
                        <p>Pembayaran Dalam</p>
                        <div className="container-expire-buy">
                            <p class="font-green"><CountDown expiry={detailOrder?.exp || detailOrder?.expires_at} transactionId={detailOrder.id}/></p>
                            {(detailOrder?.exp || detailOrder?.expires_at) ? (
                                <p>Jatuh tempo {FormatISODate(detailOrder.exp || detailOrder.expires_at)}</p>
                                ) : (
                                <p>Jatuh tempo -</p>
                            )}
                        </div>
                    </div>
                </div>
                { detailOrder.channel_code === "QRIS" ? (
                    <div className="justify-center items-center" style={{display: 'flex', flexDirection: 'column', textAlign: 'center'}}>
                        <div>
                            {ImagePaymentMethod(detailOrder?.channel_code, "100px", "100px")}
                        </div>
                        <div>
                            <QRCodeCanvas size={250} value={detailOrder?.unixNumber || detailOrder?.qr_code_url}/>
                        </div>
                    </div>
                ) : detailOrder.channel_code === "CASH" ? (
                    <div>
                        <div className="p-6 text-xl flex justify-center items-center" style={{borderBottom: '20px solid rgba(0, 0, 0, 0.2)'}}>
                            <p>CASH</p>
                        </div>
                        <div>
                            <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.2)'}}>
                                <p className="p-6">Petunjuk Pembayaran</p>
                            </div>
                            <div className="p-6" style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                                <div className="step-desc">
                                    <span>1.</span>
                                    <p>
                                        Silakan datang langsung ke kasir.
                                    </p>
                                </div>
                                <div className="step-desc">
                                    <span>2.</span>
                                    <p>
                                        Beritahukan kepada kasir bahwa Anda ingin melakukan pembayaran secara <strong>tunai</strong> untuk pesanan Anda, lalu sebutkan <strong>username akun</strong> Anda untuk memudahkan pencarian data.
                                    </p>
                                </div>
                                <div className="step-desc">
                                    <span>3.</span>
                                    <p>
                                        Serahkan uang sejumlah total tagihan kepada kasir. Setelah pembayaran dikonfirmasi, pesanan Anda akan segera diproses oleh sistem.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div style={{borderBottom: '20px solid rgba(0, 0, 0, 0.2)'}}>
                            <div className="flex">
                                <div className="p-6">
                                    {ImagePaymentMethod(detailOrder?.channel_code)}
                                </div>
                                <div className="m-buy">
                                    <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.2)'}}>
                                        <p className="p-6">{detailOrder?.channel_code}</p>
                                    </div>
                                    <div className="p-6">
                                        <p className="mbc-10">No.Rekening:</p>
                                        <div className="spase-bettwen">
                                            <p className="font-green" style={{fontSize: '22px'}}>{detailOrder?.virtual_account_number || detailOrder?.unixNumber}</p>
                                            <p className="copy">Salin</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{borderBottom: '1px solid rgba(0, 0, 0, 0.2)'}}>
                                <p className="p-6">Petunjuk Transfer mBanking</p>
                            </div>
                            <div className="p-6" style={{display: 'flex', flexDirection: 'column', gap: '2.5px', justifyContent: 'center'}}>
                                <div className="step-desc">
                                    <span>1.</span>
                                    <p>{` Pilih Menu Lain > Transfer.`}</p>
                                </div>
                                <div className="step-desc">
                                    <span>2. </span>
                                    <p>Pilih Jenis rekening asal dan pilih Virtual Account Billing.</p>
                                </div>
                                <div className="step-desc">
                                    <span>3. </span>
                                    <p>{`Masukkan nomor virtual account: ${detailOrder.unixNumber} dan pilih Benar.`}</p>
                                </div>
                                <div className="step-desc">
                                    <span>4. </span>
                                    <p>Jumlah transfer akan otomatis terisi sesuai dengan total pembayaran pesanan Anda. Pastikan jumlah yang tertera sesuai, lalu pilih Ya</p>
                                </div>
                                <div className="step-desc">
                                    <span>5. </span>
                                    <p>Periksa informasi di layar. Pastikan Merchant adalah NusasFood dan detail pesanan sudah benar. Jika sudah sesuai, pilih Ya</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}