
export default function ImagePaymentMethod(key, widthimg, heightimg) {
    const paymentImages = {
        BCA: <img src={require("../image/bca.png")} style={{height: '50px', width: '55px'}}/>,
        BNI: <img src={require("../image/bni.png")} style={{height: '50px', width: '50px'}}/>,
        BRI: <img src={require("../image/bri2.png")} style={{height: '30px', width: '55px', margin: '10px 0'}}/>,
        CIMB:<img src={require("../image/cimb.png")} style={{height: '50px', width: '50px'}}/>,
        Mandiri: <img src={require("../image/mandiri.png")} style={{height: '45px', width: '60px', margin: '5px 0'}}/>,
        Permata:  <img src={require("../image/permata.png")} style={{height: '30px', width: '100px', margin: '10px 0'}}/>,
        DANA:  <img src={require("../image/dana.png")} style={{height: '27.5px', width: '70px', margin: '10px 0'}}/>,
        LinkAja:  <img src={require("../image/link-aja.png")} style={{height: '40px', width: '60px', margin: '5px 0'}}/>,
        OVO:  <img src={require("../image/ovo.jpg")} style={{height: '40px', width: '50px', margin: '5px 0'}}/>,
        ShopeePay:  <img src={require("../image/shopeePay.png")} style={{height: '50px', width: '75px'}}/>,
        QRCode:  <img src={require("../image/qris.png")} style={{height: heightimg, width: widthimg}}/>,
    }
    return paymentImages[key]
}