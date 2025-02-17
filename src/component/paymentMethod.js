import "../style/add.css";
import qris from "../image/qris.png";
import bca from "../image/bca.png";
import bri from "../image/bri.png";
import mandiri from "../image/mandiri.png";
import bni from "../image/bni.png";
import cimb from "../image/cimb.png";
import dana from "../image/dana.png";
import shopeePay from "../image/shoope-pay.png";
import ovo from "../image/ovo.jpg";
import linkAja from "../image/link-aja.png";

export default function PaymentMethod({paymentMethod, setPaymentMethod}) {
    return (
        <div className="container-payment-method p-6">
            <div className="section-container-payment-method mb-20">
                <span>Virtual Account</span>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={bca} alt="BCA"/>
                        <p>BCA</p>
                    </div>
                    <label>
                        <input
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                        type="radio" 
                        name="paymentMethod" 
                        value="BCA"
                        checked={paymentMethod === "BCA"}
                        className="choice-payment-input"
                        />
                    </label>
                </div>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={bri} alt="BRI"/>
                        <span>BRI</span>
                    </div>
                    <label>
                        <input 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                        type="radio" 
                        name="paymentMethod"
                        value="BRI" 
                        checked={paymentMethod === "BRI"}
                        className="choice-payment-input-click"
                        />
                        <span className="choice-payment"></span>
                    </label>
                </div>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={bni} alt="BNI"/>
                        <span>BNI</span>
                    </div>
                    <label>
                        <input 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                        type="radio" 
                        name="paymentMethod" 
                        value="BNI"
                        checked={paymentMethod === "BNI"}
                        className="choice-payment-input"
                        />
                    </label>
                </div>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={mandiri} alt="Mandiri" />
                        <span>Mandiri</span>
                    </div>
                    <label>
                        <input 
                        onChange={(e) => setPaymentMethod(e.target.value)} 
                        type="radio" 
                        name="paymentMethod" 
                        value="Mandiri"
                        checked={paymentMethod === "Mandiri"}
                        className="choice-payment-input"
                        />
                        <span className="choice-payment"></span>
                    </label>
                </div>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={cimb} alt="CIMB"/>
                        <span>CIMB</span>
                    </div>
                    <label>
                        <input
                            onChange={(e) => setPaymentMethod(e.target.value)} 
                            type="radio" 
                            name="paymentMethod" 
                            value="CIMB"
                            checked={paymentMethod === "CIMB"}
                            className="choice-payment-input"
                            />
                        <span className="choice-payment"></span>
                    </label>
                </div>
            </div>
            <div className="section-container-payment-method mb-20">
                <span>Ewallet</span>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={dana} alt="DANA" style={{height: '20px'}}/>
                        <span>DANA</span>
                    </div>
                    <label>
                        <input
                            onChange={(e) => setPaymentMethod(e.target.value)} 
                            type="radio" 
                            name="paymentMethod" 
                            value="DANA"
                            checked={paymentMethod === "DANA"}
                            className="choice-payment-input"
                            />
                        <span className="choice-payment"></span>
                    </label>
                </div>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={shopeePay} alt="ShopeePay"/>
                        <span>ShopeePay</span>
                    </div>
                    <label>
                        <input
                            onChange={(e) => setPaymentMethod(e.target.value)} 
                            type="radio" 
                            name="paymentMethod" 
                            value="ShopeePay"
                            checked={paymentMethod === "ShopeePay"}
                            className="choice-payment-input"
                            />
                        <span className="choice-payment"></span>
                    </label>
                </div>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={ovo} alt="OVO" style={{borderRadius: '5px'}}/>
                        <span>OVO</span>
                    </div>
                    <label>
                        <input
                            onChange={(e) => setPaymentMethod(e.target.value)} 
                            type="radio" 
                            name="paymentMethod" 
                            value="OVO"
                            checked={paymentMethod === "OVO"}
                            className="choice-payment-input"
                            />
                        <span className="choice-payment"></span>
                    </label>
                </div>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={linkAja} alt="LinkAja" style={{borderRadius: '5px'}}/>
                        <span>LinkAja</span>
                    </div>
                    <label>
                        <input
                            onChange={(e) => setPaymentMethod(e.target.value)} 
                            type="radio" 
                            name="paymentMethod" 
                            value="LinkAja"
                            checked={paymentMethod === "LinkAja"}
                            className="choice-payment-input"
                            />
                        <span className="choice-payment"></span>
                    </label>
                </div>
            </div>
            <div className="section-container-payment-method">
                <span>QR Code</span>
                <div className="container-method">
                    <div className="flex items-center">
                        <img className="img-payment-method" src={qris} alt="QR Code"/>
                        <span>QR Code</span>
                    </div>
                    <label>
                        <input
                            onChange={(e) => setPaymentMethod(e.target.value)} 
                            type="radio" 
                            name="paymentMethod" 
                            value="QRCode"
                            checked={paymentMethod === "QRCode"}
                            className="choice-payment-input"
                            />
                        <span className="choice-payment"></span>
                    </label>
                </div>
            </div>
        </div>
    )
}