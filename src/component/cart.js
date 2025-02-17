import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { deleteItem, updateItem } from "../reducers/cartSlice";
import { useNavigate } from "react-router-dom";
import { UseResponsiveClass } from "../helper/presentationalLayer";
import BottomNavbar from "./bottomNavbar";
import PaymentMethod from "./paymentMethod";
import { ModelInputNumberEwallet } from "./modelInputNumber";
import EmptyComponent from "./empty";
import cartImage from "../image/cart.png"

function Cart({ closeCart }) {
  const [notesId, setNotesId] = useState('');
  const cartItems = useSelector((state) => state.cart.items);
  const subTotal = useSelector((state) => state.cart.subTotal); 
  const [idmodelNotifDelete, setIdModelNotifDelete] = useState('');
  const containerClass = UseResponsiveClass();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState();
  const [numberEwallet, setNumberEwallet] = useState();
  const [isModelInputNumberEwallet, setIsModelInputNumberEwallet] = useState(false);
  
  useEffect(() => {
    if (['DANA', 'ShopeePay', 'OVO', 'LinkAja'].includes(paymentMethod)) {
      setIsModelInputNumberEwallet(true);
    } else {
      setIsModelInputNumberEwallet(false);
    }
  }, [paymentMethod]); 

  const handleDeleteItem = (name) => {
        dispatch(deleteItem(name));
        setIdModelNotifDelete('');
    };


    const handleQuantityChange = (quantity, name, harga) => {
        if (quantity === 0 || isNaN(quantity)) {
            quantity = '';
        }
        const amountPrice = quantity * harga;
        const item = {name, amountPrice, quantity}
        dispatch(updateItem(item))
    }

  const handleUpdateIncerement = (name, harga, quantity) => {
    quantity = Number(quantity) + 1;
    const amountPrice = quantity * harga;
    const item = {name, amountPrice, quantity};
    dispatch(updateItem(item));
  }

  const handleUpdateDecrement = (name, harga, quantity) => {
    quantity = Number(quantity) - 1;
    if (quantity === 0) {
        setIdModelNotifDelete(name);
        quantity = 1;
    }
    const amountPrice = quantity * harga;
    const item = {name, amountPrice, quantity}
    dispatch(updateItem(item))
  }

  const handleUpdateNotes = (notes, name) => {
    const item  = {name, notes}
    dispatch(updateItem(item))
  }

  const handleShowNotes = (id) => {
    if (notesId === id) {
        setNotesId('');
    } else {
        setNotesId(id); 
    }
  };


 

  console.log(cartItems);
  console.log(notesId);
  console.log(paymentMethod);

  return (
    <div class="container-main-cart"  style={{position: 'relative'}}>

        {/* section header of cart */}
        <div class="p-6 border-b" >
                <h2 class="text-3xl font-bold text-gray-800">Keranjang Anda</h2>
                <p class="text-gray-500 text-sm mt-1">keranjang anda disimpan sementara</p>
        </div>

        {/* section item cart */}
        <div class="item-container-cart">
            {cartItems.length > 0 ? cartItems.map((item, index) => (
                <div class="flex gap-4 items-center"> 
                    <img 
                        src={require("../image/foto1.jpg")}
                        className="w-20 h-20 mr-20 rounded-xl object-cover"
                        alt={item.name}
                    />
                    <div class="flex-1">
                        <h3 class="font-semibold text-gray-800 mbc-10">{item.name}</h3>
                        <p class="text-gray-600 mbc-10">Rp {(item.harga).toLocaleString("id-ID")}</p>
                        <svg className="notes-icon" onClick={() => handleShowNotes(item.name)} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-text" viewBox="0 0 16 16" style={{cursor: 'pointer'}}>
                        <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
                        <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/>
                        </svg>
                        { notesId === item.name && (
                            <textarea
                            value={item.notes} 
                            onChange={(e) => handleUpdateNotes(e.target.value, item.name)}
                            className="border-0  cart-notes"
                            placeholder="Optional...."
                            />
                        )}
                        <div class="flex items-center gap-3 mt-2">
                            <div class="flex items-center bg-gray-100 rounded-lg">
                                <button class="w-10 h-8 hover:bg-gray-200" onClick={() => handleUpdateDecrement(item.name, item.harga, item.quantity)}>-</button>
                                <input 
                                    class="px-4 wq-10 bg-gray-100 text-center border-0 text-lg font-medium focus:ring-0" 
                                    value={item.quantity} 
                                    onChange={(e) => handleQuantityChange(Number(e.target.value), item.name, item.harga)}
                                />
                                <button class="w-10 h-8 hover:bg-gray-200" onClick={() => handleUpdateIncerement(item.name, item.harga, item.quantity)}>+</button>
                            </div>
                            <button class="text-red-500 text-sm font-medium" onClick={() => setIdModelNotifDelete(item.name)}>Remove</button>
                        </div>
                    </div>
                </div>
            )) : (
                <div>
                    <EmptyComponent
                    gambar={cartImage}
                    title={"Keranjang Anda Kosong!"}
                    desc={"Tambahkan item ke dalam cart sebelum anda peroses check out."}
                    />
                </div>
            )}
        </div>

        {/* model input number phone ewallet */}
        {isModelInputNumberEwallet && (
            <ModelInputNumberEwallet
            paymentMethode={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            closeModel={setIsModelInputNumberEwallet}
            />
        )}

        {/* model make sure about delete item */}
        { idmodelNotifDelete !== '' && (
            <div className="bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50" 
            style={ containerClass === "container-main-cart" ? { position: 'absolute', width: '100%', height: '100%', top: 0, zIndex: '100'} 
                : {position: 'fixed', width: '100%', height: '100%', top: 0, zIndex: '100'}}>
                <div style={{backgroundColor: '#fff', borderRadius: '2px', padding: '25px 0 20px 0'}}>
                    <p style={{padding: '0 10px', marginBottom: '25px'}}>Anda Yakin menghapus produk ini?</p>
                    <div style={{display: 'flex', justifyContent: 'center', paddingTop: '5px'}}>
                        <button onClick={() => handleDeleteItem(idmodelNotifDelete)} style={{marginRight: '30px', backgroundColor: '#00a650', color: '#fff', padding: '10px 30px', borderRadius: '2px'}}>Ya</button>
                        <button onClick={() => setIdModelNotifDelete('')} style={{ color: '#b8babe', border: '1px solid #b8babe', padding: '10px 20px', }}>Tidak</button>
                    </div>
                </div>
            </div>
        )}

        {/* section subtotal  */}
        <div class="section-sub-total p-6" style={{paddingTop: 0, paddingBottom: 0}}>
            <span class="font-semibold text-gray-800 text-medium">Subtotal</span>
            <span class="font-semibold text-gray-800 text-medium">Rp {(subTotal).toLocaleString("id-ID")}</span>
        </div>
        

        {/* section payment method */}
        <div class="border-t">
            <div onClick={() => setIsPaymentMethod(prev => !prev)} className="flex p-6 " style={{margin: 'auto', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <svg style={{marginRight: '10px'}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                    <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
                    </svg>
                    <span style={{backgroundColor: '#fff'}}>Metode Pembayaran {paymentMethod !== undefined ? `- ${paymentMethod}` : ""}</span>
                </div>
                <div className={isPaymentMethod ? "greater-than-open" : "greater-than"}/> 
            </div>
            { isPaymentMethod && (
                <PaymentMethod 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                />
            )}
        </div>

        {/* section rincian pembayaran  */}
        <div className="border-t p-6">
            <div className="header-summery-payment">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="orange" class="bi bi-journal-text" viewBox="0 0 16 16">
                <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5"/>
                <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
                <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
                </svg>
                <span>Rincian Pembayaran</span>
            </div>
            <div className="body-summer-payment">
                <div className="field-body-summery-payment text-summery">
                    <span>Subtotal untuk Produk</span>
                    <span>Rp {(subTotal).toLocaleString("id-ID")}</span>
                </div>
                <div className="field-body-summery-payment text-summery">
                    <span>Biaya Pajak</span>
                    <span>Rp {(subTotal).toLocaleString("id-ID")}</span>
                </div>
                <div className="field-body-summery-payment text-summery">
                    <span>Biaya Layanan</span>
                    <span>Rp {(subTotal).toLocaleString("id-ID")}</span>
                </div>
                <div className="field-body-summery-payment font-semibold text-gray-800" style={{fontSize: '20px', marginTop: '15px'}}>
                    <span>Total Pembayaran</span>
                    <span>Rp {(subTotal).toLocaleString("id-ID")}</span>
                </div>
            </div>
        </div>

        <div class="p-6 border-t pb-cart">
            <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg" style={{padding: '10px'}}>
            Buy
            </button>
        </div>

        {/* bottom navbar buat mobile */}
            <BottomNavbar/>
    </div>
  );
}

export default Cart;
