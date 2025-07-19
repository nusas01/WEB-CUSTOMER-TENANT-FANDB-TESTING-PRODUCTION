import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { deleteItem, updateItem, setFee, clearCart } from "../reducers/cartSlice"
import { useNavigate, useLocation } from "react-router-dom"
import { UseResponsiveClass } from "../helper/presentationalLayer"
import BottomNavbar from "./bottomNavbar"
import { ModelInputNumberEwallet } from "./modelInputNumber"
import {EmptyComponent} from "./empty"
import cartImage from "../image/cart.png"
import {
    fetchProductsCustomer, 
    fetchPaymentMethodsCustomer, 
    fetchTransactionOnGoingCustomer, 
} from "../actions/get"
import ImagePaymentMethod from "../helper/imagePaymentMethod"
import { UndoIcon } from "lucide-react"
import { orderTypeSlice } from "../reducers/reducers"
import { 
    OrderTypeInvalidAlert, 
    ErrorAlert, 
    ProductUnavailableModal, 
    InvalidAmountModal,
    CashPaymentUnavailableModal,
} from "./alert"
import {createTransactionCustomer} from "../actions/post"
import { SpinnerRelative, SpinnerFixed} from "../helper/spinner"
import {createTransactionCustomerSlice} from "../reducers/post"

function Cart({ closeCart }) {
    const [notesId, setNotesId] = useState('')
    const {subTotal, items} = useSelector((state) => state.persisted.cart)
    const [idmodelNotifDelete, setIdModelNotifDelete] = useState('')
    const containerClass = UseResponsiveClass()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location =  useLocation()
    const [isPaymentMethod, setIsPaymentMethod] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState()
    const [channelCode, setChannelCode] = useState()
    const [fee, setFee] = useState(0)
    const [feeTransaction, setFeeTransaction] = useState(0)
    const [taxTransaction, setTaxTransaction] = useState(0)
    const [totalTransaction, setTotalTransaction] = useState(0)
    const [numberEwallet, setNumberEwallet] = useState()
    const [isModelInputNumberEwallet, setIsModelInputNumberEwallet] = useState(false)
    const [spinner, setSpinner] = useState(true)
    const [spinnerTransaction, setSpinnerTrannsaction] = useState(false)
    const [eventNotes, setEventNotes] = useState(0)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
    const [alertError, setAlertError] = useState(false)
    const [invalidAmountPrice, setInvalidAmountPrice] = useState(false)
    const [paymentUnavailable, setPaymentUnavailable] = useState(false)

    const {dataPaymentMethodCustomer, taxRate, loadingPaymentMethodsCustomer, errorPaymentMethodsCustomer, paymentMethodCash} = useSelector((state) => state.persisted.paymentMethodsCustomer)
    const [dataTransaction, setDataTransaction] = useState({
        payment_method_id: null,
        payment_method: null,
        channel_code: null,
        amount_price: null,
        phone_number_ewallet: null,
        product: []
    })

    const handleCloseModel = () => {
        setIsModelInputNumberEwallet(false)
        setPaymentMethod(null)
        setChannelCode()
        setFee(0)
        setFeeTransaction(0)
        setTotalTransaction(subTotal + taxTransaction)
        setDataTransaction((prev) => ({
            ...prev,
            payment_method_id: null,
            payment_method: null,
            channel_code: null,
        }))
    }
    
    const handleChoicePaymentMethodModel = () => {
        if (items.length <= 0) {
            window.scrollTo({ top: 0, behavior: "smooth" })
            return
        }
        
        setIsPaymentMethod(prev => !prev)
    }


    const handleChoicePaymentMethodQR =({paymentMethod, channelCode, fee, id}) => {
        setDataTransaction((prev) => ({
            ...prev,
            payment_method_id: id,
            payment_method: paymentMethod,
            channel_code: channelCode,
        }))
        setPaymentMethod(paymentMethod)
        setChannelCode(channelCode)
        const feeRow = Math.floor(fee * (subTotal + taxTransaction))
        setFee(feeRow)
        setFeeTransaction(feeRow)
        setTotalTransaction(subTotal + taxTransaction + feeRow)
    }

    const handleChoicePaymentMethodEwallet = ({paymentMethod, channelCode, fee, id}) => {
        setDataTransaction((prev) => ({
            ...prev,
            payment_method_id: id,
            payment_method: paymentMethod,
            channel_code: channelCode,
        }))
        setIsModelInputNumberEwallet(true)
        setPaymentMethod(paymentMethod)
        setChannelCode(channelCode)
        const feeRow = Math.floor(fee * (subTotal + taxTransaction))
        setFee(feeRow)
        setFeeTransaction(feeRow)
        setTotalTransaction(subTotal + taxTransaction + feeRow)
    }

    const handleChoicePaymentMethodVA = ({paymentMethod, channelCode, fee, id}) => {
        setDataTransaction((prev) => ({
            ...prev,
            payment_method_id: id,
            payment_method: paymentMethod,
            channel_code: channelCode,
        }))
        setPaymentMethod(paymentMethod)
        setChannelCode(channelCode)
        setFee(fee)
        setFeeTransaction(fee)
        setTotalTransaction(subTotal + fee + taxTransaction)
    }

    useEffect(() => {
        const tax = Math.floor(taxRate * subTotal)
        var feeRate 
        if (paymentMethod === "EWALLET" || paymentMethod === "QR") {
            const rawFee = fee * (subTotal + tax)
            feeRate = Math.floor(rawFee)
            console.log("pencarian fee rate dari penjualan: ", fee * (subTotal +  tax))
        } else {
            feeRate = fee
        }
        console.log("berapa ini tax rate:", tax)
        setFeeTransaction(feeRate)
        setTaxTransaction(tax)
        setTotalTransaction(subTotal + tax + feeRate)

        const mappedProducts = items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            notes: item.notes,
        }))
    
        setDataTransaction((prev) => ({
            ...prev,
            product: mappedProducts,
        }))
    }, [subTotal])

    console.log("data fee dan sub total: ", fee, subTotal)

    useEffect(() => {
        const mappedProducts = items.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            notes: item.notes,
        }))
    
        setDataTransaction((prev) => ({
            ...prev,
            product: mappedProducts,
        }))
    }, [eventNotes])

    useEffect(() => {
        setDataTransaction((prev) => ({
            ...prev,
            amount_price: totalTransaction
        }))
    }, [totalTransaction])


    const handleDeleteItem = (id) => {
        dispatch(deleteItem(id))
        setIdModelNotifDelete('')
        if (items.length <= 1) {
            setIsModelInputNumberEwallet(false)
            setPaymentMethod(null)
            setChannelCode()
            setFee(0)
            setFeeTransaction(0)
            setIsPaymentMethod(false)
        }
    }


    const handleQuantityChange = (quantity, id, harga) => {
        if (quantity === 0 || isNaN(quantity)) {
            quantity = '';
        }
        const amountPrice = quantity * harga;
        const item = {id, amountPrice, quantity}
        dispatch(updateItem(item))
    }

    const handleUpdateIncerement = (id, harga, quantity) => {
        quantity = Number(quantity) + 1;
        const amountPrice = quantity * harga;
        const item = {id, amountPrice, quantity};
        dispatch(updateItem(item));
    }

    const handleUpdateDecrement = (id, harga, quantity) => {
        quantity = Number(quantity) - 1;
        if (quantity === 0) {
            setIdModelNotifDelete(id);
            quantity = 1;
        }
        const amountPrice = quantity * harga;
        const item = {id, amountPrice, quantity}
        dispatch(updateItem(item))
    }

    const handleUpdateNotes = (notes, id) => {
        const item  = {id, notes}
        dispatch(updateItem(item))
        setEventNotes(eventNotes + 1)
    }

    const handleShowNotes = (id) => {
        if (notesId === id) {
            setNotesId('');
        } else {
            setNotesId(id); 
        }
    };

    const handleInputPhoneNumberEwallet = (number) => {
        setDataTransaction((prev) => ({
            ...prev,
            phone_number_ewallet: number,
        }))
        setIsModelInputNumberEwallet(false)
    }

    const {tableId, orderTakeAway} = useSelector((state) => state.persisted.orderType)
    useEffect(() => {
        if (tableId === null && orderTakeAway === false) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway])


    // handle create transaction
    const [productUnavailable, setProductUnavailable] = useState(false)
    const {resetCreateTransactionCustomer} = createTransactionCustomerSlice.actions
    const {message, errorAmountPrice, error, loading, errorProductUnavailable, errorCashNonActive} = useSelector((state) => state.createTransactionCustomerState)
    const {loading: loadingOnGoingTransaction} = useSelector((state) => state.persisted.transactionOnGoingCustomer)

    useEffect(() => {
        if (errorCashNonActive) {
            setPaymentUnavailable(true)
        }
    }, [errorCashNonActive])

    useEffect(() => {
        if (errorProductUnavailable) {
            setProductUnavailable(true)
        }
    }, [errorProductUnavailable])

    useEffect(() => {
        if (errorAmountPrice) {
            setInvalidAmountPrice(true)
        }
    }, [errorAmountPrice])

    const handleResetData = () => {
        setIsPaymentMethod(false)
        dispatch(resetCreateTransactionCustomer())
        dispatch(clearCart())
        handleCloseModel()
    }

    const handleResetDataCashNonActive = () => {
        dispatch(resetCreateTransactionCustomer())
        setPaymentMethod(null)
        setChannelCode()
        setFee(0)
        setFeeTransaction(0)
         setDataTransaction((prev) => ({
            ...prev,
            payment_method_id: null,
            payment_method: null,
            channel_code: null,
        }))
    }

    useEffect(() => {
        if (message) {
            dispatch(clearCart());
            dispatch(resetCreateTransactionCustomer());
            dispatch(fetchTransactionOnGoingCustomer()).then(() => { // Gunakan promise
            if (paymentMethod !== "EWALLET") {
                navigate("/activity/pembayaran", { state: { detailOrder: message?.data } });
                return;
            }
        
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const redirectUrl = isMobile 
                ? message.data?.redirect_url_mobile 
                : message.data?.redirect_url_mobile;
        
            if (redirectUrl) {
                localStorage.setItem("pendingTransaction", message.data.id);
                window.location.href = redirectUrl; // Redirect setelah dispatch selesai
            }
            });
        }
    }, [message]);

    useEffect(() => {
        if (error) {
            if (error === "Invalid mobile number format") {
                setIsModelInputNumberEwallet(true)
                dispatch(resetCreateTransactionCustomer())
                return
            }

            setAlertError(true)

            const timeout = setTimeout(() => {
                setAlertError(false)
                dispatch(resetCreateTransactionCustomer())
            }, 3000)
            
            return () => clearTimeout(timeout)
        }
    }, [error])

    useEffect(() => {
        setSpinnerTrannsaction(loading)
    }, [loading])

    useEffect(() => {
        setSpinnerTrannsaction(loadingOnGoingTransaction)
    }, [loadingOnGoingTransaction])

    const { loggedIn } = useSelector((state) => state.persisted.loginStatusCustomer);
    
    const handleCreateTransaction = () => {
        if (!loggedIn) {
            return navigate("/access")
        }

        if (items.length <= 0) {
            window.scrollTo({ top: 0, behavior: "smooth" })
            return
        }
    
        if (dataTransaction.payment_method === null || channelCode === null) {
            setIsPaymentMethod(true)
            const paymentSection = document.getElementById('payment-method');
            if (paymentSection) {
                paymentSection.scrollIntoView({ 
                    behavior: "smooth",
                    block: "start" 
                });
            }
            return
        }

        if (tableId === null && orderTakeAway === false) {
            setOrderTypeInvalid(true)
            return
        }

        dispatch(createTransactionCustomer(dataTransaction))
    }


    // handle payment method 
    useEffect(() => {
        if (Object.keys(dataPaymentMethodCustomer).length === 0 || !dataPaymentMethodCustomer) {
            dispatch(fetchPaymentMethodsCustomer())
        }
    }, [])

    const groupedMethods = {
        VA: dataPaymentMethodCustomer?.filter((m) => m.type === "VA"),
        EWALLET: dataPaymentMethodCustomer?.filter((m) => m.type === "EWALLET"),
        QR: dataPaymentMethodCustomer?.filter((m) => m.type === "QR"),
    }

    console.log(dataPaymentMethodCustomer)

    console.log(groupedMethods)

    useEffect(() => {
        setSpinner(loadingPaymentMethodsCustomer)
    }, [loadingPaymentMethodsCustomer])


    console.log("data payment method: ", dataPaymentMethodCustomer)
    return (
    <div class="container-main-cart" style={{position: 'relative'}}>
        {/* payment cash non active */}
        { paymentUnavailable && (
            <CashPaymentUnavailableModal
            onClose={() => setPaymentUnavailable(false)}
            colorsType="customer"
            fetchData={fetchPaymentMethodsCustomer}
            resetChart={handleResetDataCashNonActive}
            />
        )}

        {/* product unavailable */}
        { productUnavailable && (
            <ProductUnavailableModal 
            onClose={() => setProductUnavailable(false)} 
            colorsType={"customer"} 
            fetchData={fetchProductsCustomer}
            resetData={handleResetData}
            />
        )}

        { invalidAmountPrice && (
            <InvalidAmountModal
            onClose={() => setInvalidAmountPrice(false)}
            colorsType="customer"
            fetchData={fetchPaymentMethodsCustomer}
            resetChart={handleResetData}
            />
        )}

        {/* section alert invalid order type */}
        { orderTypeInvalid && (
            <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>   
        )}

        {/* section header of cart */}
        <div class="p-6 border-b" >
                <h2 class="text-xl font-bold text-gray-800">Keranjang Anda</h2>
                <p class="text-gray-500 text-sm">keranjang anda disimpan sementara</p>
        </div>

        {/* spinner saat load transction */}
        { spinner && (
            <SpinnerRelative h="h-[80vh]"/>
        )}

        {/* spinner saat create transaction */}
        { spinnerTransaction && (
            <SpinnerFixed colors={'fill-green-500'}/>
        )}

        {/* alert error create transaction */}
        { alertError && (
            <div className="fixed">
                <ErrorAlert onClose={() => setAlertError(false)} message={error}/>
            </div>
        )}
       

        {/* section item cart */}
        { !spinner && (
            <div>
                <div className="item-container-cart p-6 bg-gray-50">
                    {items.length > 0 ? items.map((item, index) => (
                        <div key={index} className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 py-6 px-3">
                            <div className="flex gap-6 items-start"> 
                                <div className="min-w-[120px] relative">
                                    <img 
                                        src={`/image/${item.image}`}
                                        className="w-32 h-32 rounded-xl object-cover border border-gray-200"
                                        alt={item.name}
                                    />
                                    <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-sm font-medium px-2.5 py-1 rounded-full">
                                        {item.quantity}x
                                    </span>
                                </div>
                                
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                            <p className="text-lg  text-primary-600 mt-1">
                                                Rp {item.harga.toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setIdModelNotifDelete(item.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 -mt-2 -mr-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                            <button 
                                                className="w-5 h-10 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                                                onClick={() => handleUpdateDecrement(item.id, item.harga, item.quantity)}
                                                disabled={item.quantity === 1}
                                            >
                                                <span className="text-xl font-light">−</span>
                                            </button>
                                            <input 
                                                className="w-11 px-2 bg-transparent text-center text-lg font-medium border-0 focus:ring-0"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(Number(e.target.value), item.id, item.harga)}
                                            />
                                            <button 
                                                className="w-5 h-10 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
                                                onClick={() => handleUpdateIncerement(item.id, item.harga, item.quantity)}
                                            >
                                                <span className="text-xl font-light">+</span>
                                            </button>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleShowNotes(item.name)}
                                            className="flex items-center text-gray-500 hover:text-primary-600 transition-colors duration-200 group/note"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                            </svg>
                                            <span className="text-sm font-medium">Catatan</span>
                                        </button>
                                    </div>

                                    {notesId === item.name && (
                                        <textarea
                                            value={item.notes} 
                                            onChange={(e) => handleUpdateNotes(e.target.value, item.id)}
                                            className="w-full mt-3 p-3 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                            placeholder="Tulis catatan khusus..."
                                            rows="2"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <EmptyComponent
                            gambar={cartImage}
                            title={"Keranjang Anda Kosong!"}
                            desc={"Tambahkan item ke dalam keranjang sebelum proses checkout."}
                        />
                    )}
                </div>

                {/* model input number phone ewallet */}
                <div>
                    {isModelInputNumberEwallet && (
                        <ModelInputNumberEwallet
                        channelCode={channelCode}
                        handleCloseModel={handleCloseModel}
                        handleInputNumber={handleInputPhoneNumberEwallet}
                        />
                    )}
                </div>

                {/* model make sure about delete item */}
                { idmodelNotifDelete !== '' && (
                    <div className="bg-black bg-opacity-50 backdrop-blur-sm fixed flex items-center justify-center p-4 z-100" 
                    style={ containerClass === "container-main-cart" ? {width: '100%', height: '100%', top: 0, zIndex: '100'} 
                        : {width: '100%', height: '100%', top: 0, zIndex: '100'}}>
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
                    <div onClick={() => handleChoicePaymentMethodModel()} id="payment-method" className="flex p-6 " style={{margin: 'auto', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <svg style={{marginRight: '10px'}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-coin" viewBox="0 0 16 16">
                            <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518z"/>
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11m0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12"/>
                            </svg>
                            <span style={{backgroundColor: '#fff'}}>Metode Pembayaran {channelCode !== undefined ? `- ${channelCode}` : ""}</span>
                        </div>
                        <div className={isPaymentMethod ? "greater-than-open" : "greater-than"}/> 
                    </div>
                    { isPaymentMethod && (
                            <div className="container-payment-method p-6">
                            <div className="section-container-payment-method">
                            <div className="mb-20">
                                <span>Virtual Account</span>
                                {renderMethods({methods: groupedMethods.VA, channelCode, handleChoicePaymentMethod: handleChoicePaymentMethodVA})}
                            </div>
                            <div className="mb-20">
                                <span>Ewallet</span>
                                {renderMethods({ methods: groupedMethods.EWALLET, channelCode, handleChoicePaymentMethod: handleChoicePaymentMethodEwallet})}
                            </div>
                            { paymentMethodCash.status_payment && (
                                <div className="mb-20">
                                    <span>Cash</span>
                                    <div className="container-method">
                                            <div className="flex items-center bg-orange-500 text-white rounded px-2 py-1 font-semibold text-lg">
                                                CASH
                                            </div>
                                            <label>
                                            <input
                                                onChange={(e) => {
                                                    handleChoicePaymentMethodVA({
                                                        paymentMethod: 'CASH',
                                                        channelCode: 'CASH',
                                                        fee: 0,
                                                    })
                                                }}
                                                type="radio"
                                                name="paymentMethod"
                                                value="CASH"
                                                checked={channelCode === "CASH"}
                                                className="choice-payment-input"
                                            />
                                            <span className="choice-payment"></span>
                                            </label>
                                    </div>
                                </div>
                            )}
                            <div>
                                <span>QRIS</span>
                                {renderMethods({ methods: groupedMethods.QR, channelCode, handleChoicePaymentMethod: handleChoicePaymentMethodQR})}
                            </div>
                            </div>
                        </div>
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
                            <span>Rp {(taxTransaction).toLocaleString("id-ID")}</span>
                        </div>
                        <div className="field-body-summery-payment text-summery">
                            <span>Biaya Layanan</span>
                            <span>Rp {(feeTransaction).toLocaleString("id-ID")}</span>
                        </div>
                        <div className="field-body-summery-payment font-semibold text-gray-800" style={{fontSize: '20px', marginTop: '15px'}}>
                            <span>Total Pembayaran</span>
                            <span>Rp {(totalTransaction).toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                </div>

                <div class="p-6 border-t pb-cart">
                    <button onClick={() => handleCreateTransaction()} class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-lg" style={{padding: '10px'}}>
                    Buy 
                    </button>
                </div>
            </div>
        )}

        {/* bottom navbar buat mobile */}
            <BottomNavbar/>
    </div>
    );
}

const renderMethods = ({methods = [], channelCode, handleChoicePaymentMethod}) => {
    return methods.map((method) => (
      <div key={method.id} className="container-method">
        <div className="flex items-center">
          {ImagePaymentMethod(method.name)}
        </div>
        <label>
          <input
            onChange={(e) => {
              handleChoicePaymentMethod({
                paymentMethod: method.type,
                channelCode: method.name,
                fee: method.fee,
                id: method.id,
            })}}
            type="radio"
            name="paymentMethod"
            value={method.name}
            checked={channelCode === method.name}
            className="choice-payment-input"
          />
          <span className="choice-payment"></span>
        </label>
      </div>
    ));
  };

export default Cart;
