import { useNavigate, useLocation } from "react-router-dom";
import "../style/activity.css"
import ImagePaymentMethod from "../helper/imagePaymentMethod";

export default function DetailActivity() {
    const location = useLocation();
    const navigate = useNavigate();
    const detailOrder = location.state?.detailOrder || {};

    const handleNavigate = () => {
        navigate("/activity", {state: "history"})
    }
    
    return (
        <div className="container-activity bg-light">
            <div className="bg-light spase-bettwen p-6">
                <svg onClick={() => handleNavigate()} style={{cursor: 'pointer'}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg>
            </div>
            <div className="header-order-information bg-light p-6">
                <h2>Order Information</h2>
                <p className="font-17"><span>ID:</span> {detailOrder.id}</p>
            </div>
            <div className="time-order-information bg-dark font-17">
                <p>{detailOrder.methodPembelian}</p>
                <p>{detailOrder.clock}</p>
                <p>{detailOrder.date}</p>
            </div>
            <div className="item-order-information bg-light p-6">
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    { detailOrder.items.map((item) => (
                        <div className="container-item flex">
                            <img src={require("../image/foto1.jpg")}/>
                            <div className="item-information">
                                <div className="item-title">
                                    <p>{item.name}</p>
                                </div>
                                <div className="item-desc">
                                    <p className="font-17 text-gray-500">{item.description}</p>
                                </div>
                                <div className="spase-bettwen font-17 text-gray-500">
                                    <p>Rp {(item.harga).toLocaleString("id-ID")}</p>
                                    <p>x2</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="order-summery">
                    <div className="spase-bettwen font-17">
                        <p>{`Subtotal (${detailOrder.items.length} item)`}</p>
                        <p>Rp {(detailOrder.amount).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="spase-bettwen font-17">
                        <p>Biaya Pajak</p>
                        <p>Rp 5.000</p>
                    </div>
                    <div className="spase-bettwen font-17">
                        <p>Biaya Layanan</p>
                        <p>Rp 2.000</p>
                    </div>
                    <div className="item-title spase-bettwen">
                        <p>Total</p>
                        <p>Rp {(detailOrder.amount).toLocaleString("id-ID")}</p>
                    </div>
                </div>
            </div>
            <div className="font-17 bg-dark spase-bettwen" style={{padding: '0 1rem'}}>
                { detailOrder.methodPembayaran === "QRCode" ?
                 ImagePaymentMethod(detailOrder.methodPembayaran, '50px', '50px') 
                 : ImagePaymentMethod(detailOrder.methodPembayaran)
                 }
                <p >{detailOrder.statusPembayaran}</p>
            </div>
            <div className="note-order-information bg-light p-6">
                <textarea class="font-17 text-gray-500" value={`Catatan : ${detailOrder.notes}`} readOnly/>
                <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg" style={{padding: '7.5px'}}>Re-Order</button>
            </div>
        </div>
    )
}