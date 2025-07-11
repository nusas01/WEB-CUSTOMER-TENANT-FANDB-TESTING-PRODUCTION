
export default function ImagePaymentMethod(key, widthimg, heightimg) {
    const paymentImages = {
        BCA: <img src={require("../image/BCA.png")} style={{height: '50px', width: '55px'}}/>,
        BNI: <img src={require("../image/BNI.png")} style={{height: '50px', width: '50px'}}/>,
        BRI: <img src={require("../image/BRI.png")} style={{height: '25px', width: '55px', margin: '10px 0'}}/>,
        BJB: <img src={require("../image/BJB.png")} style={{height: '50px', width: '50px'}}/>,
        CIMB:<img src={require("../image/CIMB.png")} style={{height: '50px', width: '50px'}}/>,
        MANDIRI: <img src={require("../image/MANDIRI.png")} style={{height: '45px', width: '60px', margin: '5px 0'}}/>,
        PERMATA:  <img src={require("../image/PERMATA.png")} style={{height: '30px', width: '60px', margin: '10px 0'}}/>,
        DANA:  <img src={require("../image/DANA.png")} style={{height: '27.5px', width: '60px', margin: '10px 0'}}/>,
        LINKAJA:  <img src={require("../image/LINKAJA.png")} style={{height: '40px', width: '60px', margin: '5px 0'}}/>,
        OVO:  <img src={require("../image/OVO.jpg")} style={{height: '40px', width: '60px'}}/>,
        SHOPEEPAY :  <img src={require("../image/SHOOPEPAY.png")} style={{height: '50px', width: '75px'}}/>,
        QRIS:  <img src={require("../image/QRIS.png")} style={{height: heightimg, width: widthimg}}/>,
    }
    return paymentImages[key]
}
