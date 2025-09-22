import Sidebar from "../component/sidebar"
import { useEffect, useRef, useState, useCallback } from "react"
import {Plus, Search, Eye, X, CheckCircle, Menu, Settings, RefreshCw, FileText, Maximize, Minimize, Monitor} from "lucide-react"
import {
    fetchPaymentMethodsInternal, 
    fetchProductsCustomer,
    fetchGetAllCreateTransactionInternal,
    checkTransactionNonCashInternal,
} from "../actions/get"
import {
    createTransactionInternal
} from "../actions/post"
import {
    createTransactionInternalSlice
} from "../reducers/post"
import {
    cartCashierSlice
} from "../reducers/cartSlice"
import {
    getAllCreateTransactionInternalSlice,
    checkTransactionNonCashInternalSlice,
} from "../reducers/get"
import {  navbarInternalSlice, headerHiddenInternalSlice } from "../reducers/reducers.js"
import { useDispatch, useSelector } from "react-redux"
import {SpinnerRelative, SpinnerFixed} from "../helper/spinner"
import { id } from "date-fns/locale"
import { AddProductToCart } from "../component/add"
import { Trash2 } from 'lucide-react'; // Pastikan Anda mengimpor ikon yang diperlukan
import  { addItemCashier, deleteItemCashier, updateItemCashier, clearCartCashier } from "../reducers/cartSlice"
import { Tuple } from "@reduxjs/toolkit"
import { validateEmail } from "../helper/validate"
import {
    Toast,
    ToastPortal,
    ConfirmationModal, 
    ProductUnavailableModal, 
    PaymentSuccessNonCashCashier, 
    SuccessAlertPaymentCash,
    InvalidAmountModal,
    CashPaymentUnavailableModal,
} from "../component/alert"
import {QRCodeCanvas} from 'qrcode.react'
import { format } from 'date-fns'
import ImagePaymentMethod from '../helper/imagePaymentMethod'
import { CountDownRemoveData } from '../helper/countDown'
import { paymentSuccessTransactionCashierSlice } from '../reducers/notif'
import { useNavigate } from "react-router-dom"
import { useFullscreen, useElementHeight } from "../helper/helper.js"

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};


export default function Cashier() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [activeMenu, setActiveMenu] = useState("Cashier")
    const cartRef = useRef(null)

    // handle hidden header
    const {isHidden} = useSelector((state) => state.headerHiddenInternalState)

    // maxsimaz minimaz layar
    const contentRef = useRef(null);
    const { isFullScreen, toggleFullScreen } = useFullscreen(contentRef);

    // handle sidebar and elemant header yang responsice
    const { ref: headerRef, height: headerHeight } = useElementHeight();
    const { setIsOpen } = navbarInternalSlice.actions
    const { isOpen, isMobileDeviceType } = useSelector((state) => state.persisted.navbarInternal)

    return (
        <div className="flex relative">
            {/* Sidebar - Fixed width */}
            {(!isFullScreen && (!isMobileDeviceType || (isOpen && isMobileDeviceType))) && (
              <div className="w-1/10 z-50 min-w-[290px]">
                  <Sidebar 
                  activeMenu={activeMenu}
                  />
              </div>
            )}

            <div
                ref={contentRef}
                className={`flex-1 bg-gray-50 ${isFullScreen ? 'w-full h-screen overflow-y-auto' : ''}`}
            >
                {/* Header */}
                <div
                ref={headerRef}
                className={`fixed top-0 z-10 bg-white border-b border-gray-200 ${(isOpen && isMobileDeviceType) || (isHidden && !isMobileDeviceType) ? 'hidden' : ''}`}
                style={{
                    left: (isFullScreen || isMobileDeviceType) ? '0' : '288px',
                    width: isMobileDeviceType ? '100%' : (isFullScreen ? '100%' : 'calc(100% - 288px)'),
                    height: '64px'
                }}
                >
                    <div className="h-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
                        <div className="flex items-center justify-between h-full gap-2 sm:gap-4">
                            {/* Left - Logo & Info */}
                            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                <Monitor className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                                </div>
                                <div className="min-w-0 flex-1">
                                <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-800 truncate">
                                    Cashier
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 truncate hidden xs:block">
                                    Kelola transaksi pelanggan dan proses pembayaran dengan mudah
                                </p>
                                </div>
                            </div>
                            
                            {/* Right - Action Buttons */}
                            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
                                <button
                                onClick={() => toggleFullScreen()}
                                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-all hover:scale-105 touch-manipulation"
                                aria-label={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                                >
                                {isFullScreen ? (
                                    <Minimize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                                ) : (
                                    <Maximize className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                                )}
                                </button>
                                
                                <button
                                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors touch-manipulation"
                                onClick={() => navigate('/internal/admin/settings')}
                                aria-label="Settings"
                                >
                                <Settings className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                                </button>
                                
                                {isMobileDeviceType && !isFullScreen && (
                                <button
                                    onClick={() => dispatch(setIsOpen(true))}
                                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-md sm:rounded-lg transition-colors touch-manipulation"
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-5 h-5 sm:w-5 sm:h-5 text-gray-600" />
                                </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4" style={{marginTop: headerHeight}}>
                    <div className="p-4 bg-white w-full rounded-lg shadow-md">
                        <ComponentOrderCashier/>
                    </div>
                    
                    <div ref={cartRef} className="p-4 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl w-full font-semibold mb-4 text-gray-800">Create Transaction</h2>
                        <ComponentCartCashier 
                        cartRef={cartRef}
                        isFullScreen={isFullScreen}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
} 

const ComponentCartCashier = ({cartRef, isFullScreen}) => {
    const [notesState, setNotesState] = useState({});
    const [expandedNotes, setExpandedNotes] = useState({});
    const [eventNotes, setEventNotes] = useState(0)
    const dispatch = useDispatch()
    const dropdownRef = useRef(null)
    const [isModalOpenDetailResponse, setIsModalOpenDetailResponse] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState(null) 
    const [openModeladdProduct, setOpenModelAddProduct] = useState(false)
    const [spinnerRelative, setSpinnerRelative] = useState(false)
    const [spinnerFixed, setSpinnerFixed] = useState(false)
    const [openPaymentMethod, setOpenPaymentMethod] = useState(false)
    const [feeTransaction, setFeeTransaction] = useState(0)
    const [customerEmail, setCustomerEmail] = useState('')
    const [emailError, setEmailError] = useState()
    const [productUnavailable, setProductUnavailable] = useState(false)
    const [invalidAmountPrice, setInvalidAmountPrice] = useState(false)
    const [paymentUnavailable, setPaymentUnavailable] = useState(false)
    const [modelMoneyReceved, setModelMoneyReceved] = useState(false)
    const [toast, setToast] = useState(null)
    const [ dataCart, setDataCart ] = useState({
      payment_method: '',
      fee: 0, 
      tax: 0,
      channel_code: '',
      payment_method_id: null, // jika payment method tidak cash
      amount_price: 0,
      money_received: 0, // jika payment method cash 
    })

    // handle hidden header
    const {setHeaderHidden} = headerHiddenInternalSlice.actions 

    // handle get payment method 
    const {dataPaymentMethodInternal, taxRateInternal, loadingPaymentMethodsInternal, paymentMethodCash} = useSelector((state) => state.persisted.paymentMethodsInternal)
    useEffect(() => {
        if (dataPaymentMethodInternal.length === 0 || !dataPaymentMethodInternal) {
            dispatch(fetchPaymentMethodsInternal())
        }
    }, [dataPaymentMethodInternal])

    useEffect(() => {
        setSpinnerRelative(loadingPaymentMethodsInternal)
    }, [loadingPaymentMethodsInternal])

    useEffect(() => {
        if (validateEmail(customerEmail)) {
            setEmailError()
        }
    }, [customerEmail])


    // CLOSE ON OUTSIDE CLICK
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenPaymentMethod(false)
                setIsModalOpenDetailResponse(false)
                dispatch(setHeaderHidden(false))
                handleCloseNotifPaymentNonCashSuccess()
                closeModalDetailResponse()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])


     useEffect(() => {
        if (openPaymentMethod && cartRef?.current) {
            cartRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [openPaymentMethod])

    const {subTotal, items } = useSelector((state) => state.cartCashierState)


    const handleChoicePaymentMethod = ({id, paymentMethod, channelCode, fee}) => {
        setDataCart((prev) => ({
            ...prev, 
            payment_method_id: id,
            payment_method: paymentMethod,
            channel_code: channelCode,
        }))

        if (paymentMethod === "CASH") {
            setModelMoneyReceved(true)
            setDataCart((prev) => ({
                ...prev,
                amount_price: dataCart.amount_price - dataCart.fee,
                fee: 0
            }))
            setFeeTransaction(0)
        }

        
        if (paymentMethod === "QR") {
            setFeeTransaction(fee)
            const feeOne = fee * (subTotal + dataCart.tax) 
            setDataCart((prev) => ({
            ...prev, 
            fee: feeOne,
            amount_price: subTotal + feeTransaction
            }))
            return
        } 

        if (paymentMethod === "VA") {
            setDataCart((prev) => ({
            ...prev, 
            fee: fee,
            amount_price: subTotal + fee
            }))
            return
        }

    }

    useEffect(() => {
        const tax = Math.floor(taxRateInternal * subTotal);

        if (dataCart.payment_method === "QR") {
            const rawFee = feeTransaction * (subTotal + tax);
            const fee = Math.floor(rawFee); 
            const total = subTotal + tax + fee;

            setDataCart((prev) => ({
            ...prev,
            amount_price: total,
            fee: fee,
            tax: tax,
            }));
        } else {
            const total = subTotal + tax + dataCart.fee;

            setDataCart((prev) => ({
            ...prev,
            amount_price: total,
            tax: tax,
            }));
        }
    }, [subTotal, taxRateInternal, dataCart.payment_method, dataCart.fee]);



    const handleDeleteItem = (id) => {
        dispatch(deleteItemCashier(id))
        // setIdModelNotifDelete('')
        // if (items.length <= 1) {
        //     setIsModelInputNumberEwallet(false)
        //     setPaymentMethod(null)
        //     setChannelCode()
        //     setFee(0)
        //     setFeeTransaction(0)
        //     setIsPaymentMethod(false)
        // }
    }


    const handleQuantityChange = (quantity, id, harga) => {
        if (quantity === 0 || isNaN(quantity)) {
            quantity = '';
        }
        const amountPrice = quantity * harga;
        const item = {id, amountPrice, quantity}
        dispatch(updateItemCashier(item))
    }

    const handleUpdateIncerement = (id, harga, quantity) => {
        quantity = Number(quantity) + 1;
        const amountPrice = quantity * harga;
        const item = {id, amountPrice, quantity};
        dispatch(updateItemCashier(item));
    }

    const handleUpdateDecrement = (id, harga, quantity) => {
        quantity = Number(quantity) - 1;
        if (quantity === 0) {
            // setIdModelNotifDelete(id);
            quantity = 1;
        }
        const amountPrice = quantity * harga;
        const item = {id, amountPrice, quantity}
        dispatch(updateItemCashier(item))
    }

    const handleUpdateNotes = (notes, id) => {
        const item  = {id, notes}
        dispatch(updateItemCashier(item))
        setEventNotes(eventNotes + 1)
    }

    // Initialize notes state dari items
    useEffect(() => {
        const initialNotes = {};
        items.forEach(item => {
        initialNotes[item.id] = item.notes || '';
        });
        setNotesState(initialNotes);
    }, [items]);

    // Handle perubahan notes secara lokal
    const handleNotesChange = useCallback((productId, value) => {
        setNotesState(prev => ({
        ...prev,
        [productId]: value
        }));
    }, []);

    // Debounce untuk setiap product notes
    const debouncedNotes = useDebounce(notesState, 800);

    // Effect untuk update notes ke parent/store ketika debounced value berubah
    useEffect(() => {
        Object.entries(debouncedNotes).forEach(([productId, notes]) => {
        const currentItem = items.find(item => item.id === productId);
        
        // Hanya update jika notes berbeda dengan yang ada di store
        if (currentItem && currentItem.notes !== notes) {
            handleUpdateNotes(notes, productId);
        }
        });
    }, [debouncedNotes, items, handleUpdateNotes]);

    // Toggle expand notes
    const toggleNotesExpand = useCallback((productId) => {
        setExpandedNotes(prev => ({
        ...prev,
        [productId]: !prev[productId]
        }));
    }, []);

    const handleChangeMoneyReceved = (e) => {
        const raw = e.target.value.replace(/\./g, '')

        // Hanya izinkan angka saja
        if (!/^\d*$/.test(raw)) return

        const numericValue = parseInt(raw, 10) || 0

        setDataCart((prev) => ({
            ...prev,
            money_received: numericValue,
        }))
    }
    
    const { clearCartCashier } = cartCashierSlice.actions
    const {successCreateTransactionInternal, errorProductUnavailable, errorInvalidAmountPrice, errorCashNonActive, dataSuccessCreateTransactionInternal, errorCreateTransactionInternal, loadingCreateTransactionInternal } = useSelector((state) => state.createTransactionInternalState)
    const { resetCreateTransactionInternal } = createTransactionInternalSlice.actions
    useEffect(() => {
        setSpinnerFixed(loadingCreateTransactionInternal)
        dispatch(setHeaderHidden(loadingCreateTransactionInternal))
    }, [loadingCreateTransactionInternal])

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
        if (errorInvalidAmountPrice) {
            setInvalidAmountPrice(true)
        }
    }, [errorInvalidAmountPrice])

    useEffect(() => {
        if (errorCreateTransactionInternal) {
            setToast({
                type: 'error',
                message: errorCreateTransactionInternal,
            })
        }
    }, [errorCreateTransactionInternal])

    const handleClearCashier = () => {
        dispatch(clearCartCashier())
        setCustomerEmail('')
        setDataCart({
            payment_method: '',
            fee: 0,
            tax: 0,
            channel_code: '',
            payment_method_id: null,
            amount_price: 0,
            money_received: 0,
        })
        dispatch(resetCreateTransactionInternal())
    }

    const handleClearCashNonActive = () => {
        setDataCart((prev) => ({
            ...prev,
            payment_method: '',
            fee: 0,
            channel_code: '',
            payment_method_id: null,
        }))
        dispatch(resetCreateTransactionInternal())
    }

    useEffect(() => {
        if (successCreateTransactionInternal) {
            setSelectedTransaction(dataSuccessCreateTransactionInternal)
            setIsModalOpenDetailResponse(true)
            dispatch(setHeaderHidden(true))
            handleClearCashier()
        }
    }, [successCreateTransactionInternal])

    const handleCreateTransaction = () => {
        if (items.length === 0 || !items) {
            setOpenModelAddProduct(true)
            return
        }
        
        if (dataCart.payment_method === "") {
            setOpenPaymentMethod(true)
            return
        }

        if (customerEmail === '' || !validateEmail(customerEmail)) {
            setEmailError('Format email tidak valid.')
            return
        }

        if (dataCart.payment_method === "CASH" && dataCart.money_received < dataCart.amount_price) {
            return 
        }

        const dataOrders = items.map(product => {
            return {
                product_id: product.id,
                quantity: product.quantity,
                notes: product.notes || "", 
                name: product.name,
            };
        });

        const data = {
            payment_method: dataCart.payment_method,
            channel_code: dataCart.channel_code,
            payment_method_id: dataCart.payment_method_id, 
            amount_price: dataCart.amount_price,
            money_received: dataCart.money_received,
            email: customerEmail,
            products: dataOrders
        }        

        dispatch(createTransactionInternal(data))
    }

    const closeModalDetailResponse = () => {
        setIsModalOpenDetailResponse(false)
        dispatch(setHeaderHidden(false))
        setSelectedTransaction(null)
        dispatch(resetCreateTransactionInternal())
    }


    // handle notif transaction non cash berhasil dibayarkan
    // dan secara otomatis menghapus data 
    const [modelNotifPaymentNonCashSuccess, setModelNotifPaymentNonCashSuccess] = useState(false)
    const {removePaymentSuccessTransactionCashier} = paymentSuccessTransactionCashierSlice.actions
    const {dataTransactionCashierSuccess} = useSelector((state) => state.paymentSuccessTransactionCashierState)

    useEffect(() => {
        if (dataTransactionCashierSuccess) {
            setModelNotifPaymentNonCashSuccess(true)
        }
    }, [dataTransactionCashierSuccess])

    const handleCloseNotifPaymentNonCashSuccess = () => {
        setModelNotifPaymentNonCashSuccess(false)
        dispatch(removePaymentSuccessTransactionCashier())
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">

                {/* payment cash non active */}
                {  paymentUnavailable && (
                    <div className="fixed">
                        <CashPaymentUnavailableModal
                        onClose={() => setPaymentUnavailable(false)}
                        colorsType="internal"
                        fetchData={fetchPaymentMethodsInternal}
                        resetChart={handleClearCashNonActive}
                        />
                    </div>
                )}

                {/* product unavailable */}
                { productUnavailable && (
                    <div className="fixed">
                        <ProductUnavailableModal 
                        onClose={() => setProductUnavailable(false)} 
                        colorsType={"internal"}
                        fetchData={fetchProductsCustomer}
                        resetData={handleClearCashier}
                        />
                    </div>
                )}

                {/* invalid amount price */}
                { invalidAmountPrice && (
                    <div className="fixed">
                        <InvalidAmountModal 
                        onClose={() => setInvalidAmountPrice(false)} 
                        colorsType={"internal"}
                        fetchData={fetchPaymentMethodsInternal}
                        resetChart={handleClearCashier} 
                        />
                    </div>
                )}

                {modelNotifPaymentNonCashSuccess && (
                    <div className="fixed">
                        <PaymentSuccessNonCashCashier 
                        data={dataTransactionCashierSuccess} 
                        onClose={handleCloseNotifPaymentNonCashSuccess} 
                        message="Transaksi berhasil!" 
                        subMessage={"Pembayaran berhasil! customer berhasil membayar."}
                        ref={dropdownRef}
                        />
                    </div>
                )}
                
                {/* model setalah create transaction dengan method tidak cash */}
                <div className={`${isModalOpenDetailResponse ? 'fixed' : 'hidden'}`}>
                    <PaymentDetailsModal
                        isOpen={isModalOpenDetailResponse}
                        transaction={selectedTransaction}
                        onClose={closeModalDetailResponse}
                        modalRef={dropdownRef}
                    />
                </div>

                {/* spinner */}
                { spinnerFixed && (
                    <SpinnerFixed colors={'fill-gray-900'}/>
                )}

                {/* alertError */}
                {toast && (
                    <ToastPortal> 
                        <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-100'>
                        <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => { 
                            setToast(null)
                            dispatch(resetCreateTransactionInternal())
                        }} 
                        duration={5000}
                        />
                        </div>
                    </ToastPortal>
                )}
        
                <div className="flex w-full justify-between">
                    {/* add product */}
                    <div
                        onClick={() => setOpenModelAddProduct(true)}
                        className="rounded-lg px-5 py-1 flex items-center justify-center space-x-2 cursor-pointer bg-gray-800 hover:bg-gray-900 text-white transition-colors duration-200"
                    >
                        <Plus size={20} />
                        <p className="text-base">Product</p>
                    </div>

                    {/* Payment Method Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center justify-between w-full md:w-56 px-8 py-1 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                            onClick={() => setOpenPaymentMethod((prev) => !prev)}
                        >
                            <span>{dataCart.channel_code === '' ? 'Choose Payment Method' : dataCart.channel_code}</span>
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {openPaymentMethod && (
                            <div className="absolute right-0 z-10 w-full md:w-64 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    {!spinnerRelative && (
                                        <>
                                            {dataPaymentMethodInternal
                                            .filter(method => method.type !== "EWALLET") 
                                            .map((method) => {
                                                const isSelected = method.name === dataCart.channel_code;
                                                return (
                                                    <button
                                                        key={method.id}
                                                        className={`flex items-center w-full px-4 py-2 text-sm text-left ${isSelected ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700'} hover:bg-gray-100 transition-colors duration-150`}
                                                        onClick={() =>
                                                            handleChoicePaymentMethod({
                                                                id: method.id,
                                                                paymentMethod: method.type,
                                                                channelCode: method.name,
                                                                fee: method.fee
                                                            })
                                                        }
                                                    >
                                                        <div className="flex items-center justify-center w-8 h-8 mr-3 bg-gray-200 rounded-full">
                                                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                                        </div>
                                                        {method.name}
                                                        {isSelected && (
                                                            <svg className="w-4 h-4 ml-auto text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                            
                                            { paymentMethodCash.status_payment && (
                                                <button
                                                    onClick={() => handleChoicePaymentMethod({ paymentMethod: "CASH", channelCode: "CASH", fee: 0 })}
                                                    className={`flex items-center w-full px-4 py-2 text-sm text-left ${dataCart.channel_code === 'CASH' ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-700'} hover:bg-gray-100 transition-colors duration-150`}
                                                >
                                                    <div className="flex items-center justify-center w-8 h-8 mr-3 bg-gray-200 rounded-full">
                                                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                                    </div>
                                                    CASH
                                                    {dataCart.channel_code === 'CASH' && (
                                                        <svg className="w-4 h-4 ml-auto text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {spinnerRelative && <SpinnerRelative />}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto mt-5 rounded-lg border border-gray-200">
                <table className="min-w-full text-left divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                    <tr>
                        {["Image", "Product", "Quantity", "Price", "Amount", "Notes"].map((header) => (
                        <th key={header} className="py-3 px-4 font-medium text-sm text-gray-600 whitespace-nowrap">
                            {header}
                        </th>
                        ))}
                        <th className="py-3 px-4 font-medium text-sm text-gray-600"></th> {/* For delete icon */}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {items.length > 0 ? (
                        items.map((t, index) => (
                        <tr key={index} className="text-black hover:bg-gray-50 transition-colors duration-150">
                            <td className="py-3 px-4">
                            <div className="w-[62px] h-auto aspect-[4/3]">
                                <img 
                                src={`https://nusas-bucket.oss-ap-southeast-5.aliyuncs.com/${t.image}`} 
                                alt={t.name} 
                                className="w-full h-full object-cover rounded-md" 
                                />
                            </div>
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-800">{t.name}</td>
                            <td className="py-3 px-4 align-middle">
                            <div className="flex items-center gap-2">
                                <button
                                className="w-6 h-6 border border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-sm"
                                onClick={() => handleUpdateDecrement(t.id, t.harga, t.quantity)}
                                disabled={t.quantity === 1}
                                aria-label="Decrease quantity"
                                >
                                <span className="text-sm font-semibold">−</span>
                                </button>

                                <input
                                type="number"
                                className="w-8 h-6 text-center text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={t.quantity}
                                onChange={(e) => handleQuantityChange(Number(e.target.value), t.id, t.harga)}
                                min="1"
                                aria-label="Product quantity"
                                />

                                <button
                                className="w-6 h-6 border border-gray-400 hover:bg-gray-100 flex items-center justify-center rounded-sm"
                                onClick={() => handleUpdateIncerement(t.id, t.harga, t.quantity)}
                                aria-label="Increase quantity"
                                >
                                <span className="text-sm font-semibold">+</span>
                                </button>
                            </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-700">
                            Rp {t.harga.toLocaleString("id-ID")}
                            </td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-800">
                            Rp {t.amountPrice.toLocaleString("id-ID")}
                            </td>
                            <td className="py-3 px-4">
                            <div className="relative">
                                {/* Notes Input */}
                                <div className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <textarea
                                    value={notesState[t.id] || ''}
                                    onChange={(e) => handleNotesChange(t.id, e.target.value)}
                                    placeholder="Tambah catatan..."
                                    className="w-full min-w-[120px] h-8 px-2 py-1 text-xs border border-gray-300 rounded-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    style={{ 
                                        height: expandedNotes[t.id] ? 'auto' : '32px',
                                        minHeight: '32px'
                                    }}
                                    onFocus={() => setExpandedNotes(prev => ({ ...prev, [t.id]: true }))}
                                    rows={expandedNotes[t.id] ? 3 : 1}
                                    />
                                    
                                    {/* Notes indicator */}
                                    {(notesState[t.id] || '').trim() && (
                                    <div className="absolute -top-1 -right-1">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                    )}
                                </div>
                                
                                {/* Toggle button untuk expand/collapse notes */}
                                {(notesState[t.id] || '').trim() && (
                                    <button
                                    onClick={() => toggleNotesExpand(t.id)}
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label={expandedNotes[t.id] ? "Collapse notes" : "Expand notes"}
                                    >
                                    <FileText size={14} />
                                    </button>
                                )}
                                </div>

                                {/* Preview notes ketika collapsed dan ada text */}
                                {!expandedNotes[t.id] && (notesState[t.id] || '').trim() && (notesState[t.id] || '').length > 15 && (
                                <div className="mt-1">
                                    <p className="text-xs text-gray-500 truncate max-w-[120px]" title={notesState[t.id]}>
                                    {(notesState[t.id] || '').substring(0, 15)}...
                                    </p>
                                </div>
                                )}
                            </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                            <button
                                onClick={() => handleDeleteItem(t.id)}
                                className="text-red-500 hover:text-red-700 transition-colors duration-150"
                                aria-label="Delete item"
                            >
                                <Trash2 size={18} />
                            </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="7" className="px-6 py-12 text-center bg-white">
                            <div className="flex flex-col items-center justify-center">
                            <div className="mb-5 text-gray-300">
                                <i className="fas fa-shopping-bag text-6xl"></i>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">Keranjang Belanja Kosong</h3>
                            <p className="text-gray-500 max-w-md mb-6 text-sm">
                                Tambahkan produk ke keranjang Anda untuk memulai belanja.
                            </p>
                            <div
                                onClick={() => setOpenModelAddProduct(true)}
                                className="rounded-lg px-5 flex items-center space-x-2 py-2 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors duration-200"
                            >
                                <p className="text-base">Lihat Product</p>
                            </div>
                            </div>
                        </td>
                        </tr>
                    )}
                    </tbody>
                    <tfoot>
                    <tr className="border-t border-gray-300">
                        <td colSpan="5" className="py-3 px-4 font-medium text-gray-700 text-base">Subtotal</td>
                        <td className="font-medium text-gray-800 text-base">Rp {subTotal.toLocaleString("id-ID")}</td>
                        <td></td> {/* Empty cell for alignment */}
                    </tr>
                    </tfoot>
                </table>
                </div>

            <div className="flex flex-col md:flex-row justify-between mt-5">
                <p className="text-lg font-medium mb-2 md:mb-0 md:mr-4">Fulfillment Cost</p>
                <div className="bg-blue-50 w-[50%] md:min-w-[45vh] rounded-lg px-5 py-3 border border-blue-200">
                    <div className="flex text-gray-700 text-sm md:text-base justify-between mb-1">
                        <p>Subtotal</p>
                        <p>Rp {subTotal.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex text-gray-700 text-sm md:text-base justify-between mb-1">
                        <p>Payment Fee</p>
                        <p>Rp {dataCart.fee.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex text-gray-700 text-sm md:text-base justify-between mb-3">
                        <p>Pajak</p>
                        <p>Rp {dataCart.tax.toLocaleString("id-ID")}</p>
                    </div>
                    <div className="flex text-lg font-bold text-gray-900 justify-between border-t pt-2 border-gray-300">
                        <p>Total</p>
                        <p>Rp {dataCart.amount_price.toLocaleString("id-ID")}</p>
                    </div>
                </div>
            </div>

            {/* New Email Input Section */}
            <div className="mt-6 bg-gray-50 p-4 border border-gray-200 rounded-md shadow-sm">
                <label htmlFor="customer-email" className="block mb-2 text-sm font-medium text-gray-700">
                    Email Pelanggan (Opsional)
                </label>
                <input
                    id="customer-email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="misal@contoh.com"
                    value={customerEmail} 
                    onChange={(e) => setCustomerEmail(e.target.value)}
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
            </div>

            {/*handle kembalian*/}
            {dataCart.channel_code === 'CASH' && ( // Only show if payment method is CASH
                <div className="mt-6 bg-gray-50 p-4 border border-gray-200 rounded-md shadow-sm">
                    <label htmlFor="money-received" className="block mb-2 text-sm font-medium text-gray-700">
                        Masukkan uang diterima:
                    </label>
                    <input
                        id="money-received"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={dataCart.money_received.toLocaleString("id-ID")}
                        onChange={handleChangeMoneyReceved}
                        placeholder="Masukkan jumlah uang"
                    />

                    <div className="mt-1 text-sm">
                        {dataCart.money_received < dataCart.amount_price ? (
                            <span className="text-red-500">
                                Uang tidak cukup. Kurang sebesar Rp{' '}
                                {(dataCart.amount_price - dataCart.money_received).toLocaleString('id-ID')}
                            </span>
                        ) : (
                            <span className="text-green-500">
                                Kembalian: Rp{' '}
                                {(dataCart.money_received - dataCart.amount_price).toLocaleString('id-ID')}
                            </span>
                        )}
                    </div>
                </div>
            )}

            <div className="flex justify-center mt-6">
                <button onClick={() => handleCreateTransaction()} className="w-full md:w-auto rounded-lg px-8 py-1 cursor-pointer bg-gray-800 hover:bg-gray-900 text-white font-semibold text-lg transition-colors duration-200">
                    <p>Buy</p>
                </button>
            </div>

            {/* add product modal */}
            <div className={`${isFullScreen ? 'h-screen overflow-y-auto' : ''}`}>
                {openModeladdProduct && <ProductCashier onClose={() => setOpenModelAddProduct(false)} />}
            </div>
        </div>
    )
}

const ProductCashier = ({onClose}) => {
    const dispatch = useDispatch()
    const [productData, setProductData] = useState()
    const [showModelAddProduct, setShowModelAddProduct] = useState(false);


    const { datas } = useSelector((state) => state.persisted.productsCustomer)
      useEffect(() => {
        if (datas.length === 0 || !datas) {
          dispatch(fetchProductsCustomer())
        }
      }, [])

    const handleOutsideClick = (event) => {
        if (event.target.id === "modal-background") {
            onClose()
        }
    }

     const handleShowModalAddProduct = (show, product) => {
        setProductData(product)
        setShowModelAddProduct(show)
    }
    
    const handleRefreshProducts = () => {
        dispatch(fetchProductsCustomer())
    }

    const { items } = useSelector((state) => state.cartCashierState)

    return (
        <>
            {!showModelAddProduct ? (
                <div 
                    id="modal-background"
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-20"
                    onClick={handleOutsideClick} 
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-screen overflow-y-auto">
                        
                        {/* Input Search */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative w-[50%] flex items-center">
                                <Search className="absolute left-3 text-gray-600" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                                />
                            </div>
                            <button 
                            onClick={() => handleRefreshProducts()}
                            className="bg-gradient-to-r from-gray-800 to-gray-700 text-white px-6 py-2 rounded-xl hover:shadow-sm transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Refresh</span>
                            </button>
                        </div>


                        {/* Produk */}
                        <div>
                            {datas.length > 0 && datas.map((item) => (
                                <div id={item.category_name} className="mb-8" key={item.category_name}>  
                                    <p className="text-2xl font-bold text-gray-700 mb-4">{item.category_name}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                        {item.products.map((prd, idx) => {
                                            const cartItem = items.find((cart) => cart.id === prd.product_id);
                                            const isAvailable = prd.available;

                                            return (
                                                <div 
                                                    key={idx} 
                                                    className={`relative border rounded-lg p-4 shadow-sm bg-white transition-all duration-200 ${
                                                        isAvailable 
                                                            ? 'border-gray-300 hover:border-gray-400 hover:shadow-md cursor-pointer' 
                                                            : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                                    }`}
                                                    onClick={() => {
                                                        if (isAvailable) {
                                                            handleShowModalAddProduct(true, {
                                                                id: prd.product_id,
                                                                name: prd.name,
                                                                harga: prd.price,
                                                                image: prd.image,
                                                            });
                                                        }
                                                    }}
                                                >
                                                    {/* UNAVAILABLE OVERLAY */}
                                                    {!isAvailable && (
                                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] rounded-lg z-20 flex items-center justify-center">
                                                            <div className="text-center">
                                                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </div>
                                                                <p className="text-sm font-medium text-gray-700">Tidak Tersedia</p>
                                                                <p className="text-xs text-gray-500 mt-1">Sementara habis</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* BADGE */}
                                                    {cartItem && isAvailable && (
                                                        <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full z-10">
                                                            {cartItem.quantity}x
                                                        </span>
                                                    )}

                                                    {/* GAMBAR */}
                                                    <img
                                                        className={`h-32 mx-auto w-40 object-cover rounded-md mb-3 transition-all duration-200 ${
                                                            !isAvailable ? 'grayscale brightness-75' : ''
                                                        }`}
                                                        src={`https://nusas-bucket.oss-ap-southeast-5.aliyuncs.com/${prd.image}`}
                                                        alt={prd.name}
                                                    />

                                                    {/* INFO PRODUK */}
                                                    <div className="text-center">
                                                        <p className={`text-md font-semibold line-clamp-2 ${
                                                            isAvailable ? 'text-gray-800' : 'text-gray-500'
                                                        }`}>
                                                            {prd.name}
                                                        </p>
                                                        <p className={`text-sm ${
                                                            isAvailable ? 'text-gray-700' : 'text-gray-400'
                                                        }`}>
                                                            Rp {prd.price.toLocaleString("id-ID")}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <AddProductToCart 
                    onClose={() => setShowModelAddProduct(false)} 
                    id={productData.id}
                    name={productData.name} 
                    harga={productData.harga} 
                    image={productData.image} 
                    description={productData.description} 
                    type={"INTERNAL"}
                    // taxRate={} di sisi customer saja yang handle taxrate di state
                />
            )}
        </>
    )
}

const ComponentOrderCashier = () => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)
    const [loadingFixed, setLoadingFixed] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState(null) // To store transaction for modal
    const modelRef = useRef()

    const {removeGetAllCreateTransactionById} = getAllCreateTransactionInternalSlice.actions
    const {dataGetAllCreateTransactionInternal, errorGetAllCreateTransactionInternal, loadingGetAllCreateTransactionInternal} = useSelector((state) => state.persisted.getAllCreateTransactionInternal)

    useEffect(() => {
        if (!dataGetAllCreateTransactionInternal || dataGetAllCreateTransactionInternal?.length === 0) {
            dispatch(fetchGetAllCreateTransactionInternal())
        }
    }, [])

    useEffect(() => {
        setLoading(loadingGetAllCreateTransactionInternal)
    }, [loadingGetAllCreateTransactionInternal])


    // Handle opening the modal
    const handleViewPaymentDetails = (transaction) => {
        setSelectedTransaction(transaction)
        setIsModalOpen(true)
    }

    // Handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false)
        setSelectedTransaction(null)
    }

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modelRef.current && !modelRef.current.contains(event.target)) {
                closeModal()
            }
        };

       
        document.removeEventListener('mousedown', handleClickOutside);
       

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])



    // handle check status transaction non cash 
    const { resetCheckTransactionNonCash } = checkTransactionNonCashInternalSlice.actions
    const {checkTransactionNonCashId, statusCheckTransactionNonCash, errorCheckTransactionNonCash, loadingCheckTransactionNonCash} = useSelector((state) => state.checkTransactionNonCashInternalState)
    const [allertSuccessCheckTransactionNonCash, setAllertSuccessCheckTransactionNonCash] = useState(false)
    const [allertPendingCheckTransactionNonCash, setAllertPendingCheckTransactionNonCash] = useState(false)
    const [allertErrorCheckTransactionNonCash, setAllertErrorCheckTransactionNonCash] = useState(false)

    const handleCheckStatusPayment = (transactionId) => {
        const data = {
            transaction_id: transactionId,
        }
        dispatch(checkTransactionNonCashInternal(data))
    }

    useEffect(() => {
        if (errorCheckTransactionNonCash) {
            setAllertErrorCheckTransactionNonCash(true)
        }
    }, [errorCheckTransactionNonCash])

    useEffect(() => {
        if (checkTransactionNonCashId && statusCheckTransactionNonCash === "PAID") {
            dispatch(removeGetAllCreateTransactionById(checkTransactionNonCashId))
            // setAllertSuccessCheckTransactionNonCash(true)
            dispatch(resetCheckTransactionNonCash())
        } else if (checkTransactionNonCashId && statusCheckTransactionNonCash === "PENDING") {
            setAllertPendingCheckTransactionNonCash(true)
        }
    }, [checkTransactionNonCashId, statusCheckTransactionNonCash])

    // useEffect(() => {
    //     if (allertSuccessCheckTransactionNonCash) {
    //         dispatch(resetCheckTransactionNonCash())
    //         setAllertSuccessCheckTransactionNonCash(false)
    //     }
    // }, [allertSuccessCheckTransactionNonCash])

    useEffect(() => {
        setLoadingFixed(loadingCheckTransactionNonCash)
    }, [loadingCheckTransactionNonCash])

    const handleCloseModelConfirmation = () => {
        dispatch(resetCheckTransactionNonCash())
        setAllertPendingCheckTransactionNonCash(false)
        setAllertSuccessCheckTransactionNonCash(false)
        setAllertErrorCheckTransactionNonCash(false)
    }

    return (
        <div className="h-[40vh] w-full">
            {/* { allertSuccessCheckTransactionNonCash && (
                <div ref={modelRef}>
                    <ConfirmationModal 
                        onClose={handleCloseModelConfirmation} 
                        title={"Success!"}  
                        message={"Verifikasi pembayaran non-tunai berhasil"}
                        type={"success"}
                    />
                </div>
            )} */}

             { allertPendingCheckTransactionNonCash && (
                <div ref={modelRef}>
                    <ConfirmationModal 
                        onClose={handleCloseModelConfirmation} 
                        title={"Pending!"}  
                        message={"Status pembayaran non-tunai masih pending. Silakan periksa kembali dalam beberapa saat."}
                        type={"pending"}
                    />
                </div>
            )}       

            { allertErrorCheckTransactionNonCash && (
                <div ref={modelRef}>
                    <ConfirmationModal 
                        onClose={handleCloseModelConfirmation} 
                        title={"Error!"}  
                        message={"there was an error on our server, we are fixing it."}
                        type={"error"}
                    />
                </div>
            )}     

            { loadingFixed && (
                <SpinnerFixed colors={'fill-gray-800'}/>
            )}

            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <SpinnerRelative />
                </div>
            ) : (
                <>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Daftar Transaksi</h2>
                    <div className="overflow-y-auto h-[33vh] relative">
                        <table className="min-w-full text-left divide-y divide-gray-200">
                            <thead className="bg-gray-100 sticky top-0 z-10">
                                <tr>
                                    <th className="py-3 px-4 font-medium text-sm text-gray-600 whitespace-nowrap">Status</th>
                                    <th className="py-3 px-4 font-medium text-sm text-gray-600 whitespace-nowrap">Date</th>
                                    <th className="py-3 px-4 font-medium text-sm text-gray-600 whitespace-nowrap">Channel</th>
                                    <th className="py-3 px-4 font-medium text-sm text-gray-600 whitespace-nowrap">Amount</th>
                                    <th className="py-3 px-4 font-medium text-sm text-gray-600 whitespace-nowrap">Order By</th>
                                    <th className="py-3 px-4 font-medium text-sm text-gray-600 whitespace-nowrap">Check</th>
                                    <th className="py-3 px-4 font-medium text-sm text-gray-600 whitespace-nowrap">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {dataGetAllCreateTransactionInternal?.length > 0 || dataGetAllCreateTransactionInternal ? (
                                    dataGetAllCreateTransactionInternal.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="hidden">
                                                <CountDownRemoveData 
                                                    expiry={transaction.expires_at} 
                                                    transactionId={transaction.transaction_id} 
                                                    remove={removeGetAllCreateTransactionById}
                                                />
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full
                                                    'bg-red-100 text-red-800'}`}>
                                                    {transaction.status_transaction}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">
                                                {format(new Date(transaction.date), 'dd MMM yyyy, HH:mm', { locale: id })}
                                            </td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{transaction.channel_code}</td>
                                            <td className="py-3 px-4 text-sm text-gray-800">Rp {transaction.amount_price.toLocaleString("id-ID")}</td>
                                            <td className="py-3 px-4 text-sm text-gray-700">{transaction.email || '-'}</td>
                                            <td className="py-3 px-4 text-start">
                                                <button
                                                    onClick={() => handleCheckStatusPayment(transaction.transaction_id)}
                                                    className="inline-flex items-center px-3 py-1 bg-red-800 text-white text-sm font-medium rounded-md hover:bg-red-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    aria-label="Check Status Payment"
                                                >
                                                    Check
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-start">
                                                {transaction.channel_code !== 'CASH' && transaction.payment_reference ? (
                                                        <button
                                                            onClick={() => handleViewPaymentDetails(transaction)}
                                                            className="inline-flex items-center px-3 py-1 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                                            aria-label="Lihat Referensi Pembayaran"
                                                        >
                                                            <Eye size={16} className="mr-2" />
                                                            Lihat Referensi
                                                        </button>
                                                ) : (
                                                    <span className="text-gray-500 text-sm">-</span> // For CASH or no reference
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8">
                                            <div class="flex justify-center w-full">
                                                <div class="card bg-white p-8">
                                                    <div class="flex flex-col mt-2 items-center text-center">
                                                        <div class="icon-circle w-20 h-10 rounded-full flex items-center justify-center my-2">
                                                            <svg className="w-12 h-12 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                                            </svg>
                                                        </div>
                                                        
                                                        <h2 class="text-xl font-semibold text-gray-800 mb-2">Belum Ada Transaksi</h2>
                                                    
                                                        <p class="text-gray-500 mb-2 max-w-md">
                                                            Transaksi yang berhasil atau sedang diproses akan muncul di sini. Mulai transaksi baru di kasir untuk melihat daftar.
                                                        </p>
                                                        
                                                        <a href="#" class="text-sm text-gray-800 font-medium hover:underline">
                                                            Lihat panduan transaksi
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Payment Reference Modal */}
                    <div className={`${isModalOpen ? 'fixed' : 'hidden'}`}>
                        <PaymentDetailsModal
                            isOpen={isModalOpen}
                            transaction={selectedTransaction}
                            onClose={closeModal}
                            modalRef={modelRef}
                        />
                    </div>
                </>
            ) }
        </div>
    )
}


const PaymentDetailsModal = ({ isOpen, transaction, onClose, modalRef }) => {
    if (!isOpen || !transaction) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 md:p-8 relative transform transition-all duration-300 scale-100 opacity-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                    aria-label="Tutup modal"
                >
                    <X size={24} />
                </button>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Detail Pembayaran</h3>

                <div className="space-y-4 text-center">
                    <p className="text-lg font-semibold text-gray-700">Metode: {transaction.channel_code}</p>
                    <p className="text-gray-600">
                        ID Transaksi: <span className="font-medium">{transaction.transaction_id}</span>
                    </p>

                    {transaction.channel_code === 'CASH' ? (
                        <div className="p-6 border border-green-300 rounded-lg bg-green-50 shadow-inner flex flex-col items-center">
                            <CheckCircle size={48} className="text-green-500 mb-2" />
                            <p className="text-lg font-bold text-green-700">Pembayaran Berhasil!</p>
                            <p className="text-sm text-green-600 mt-1">
                                Terima kasih! Transaksi telah selesai secara tunai.
                            </p>
                            <p className="mt-4 text-base font-semibold text-gray-700">
                                Total: Rp {transaction.amount_price.toLocaleString("id-ID")}
                            </p>
                        </div>
                    ) : transaction.channel_code === 'QRIS' && transaction.payment_reference ? (
                        <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-sm text-gray-700 mb-3">Scan QR Code ini untuk pembayaran:</p>
                            <QRCodeCanvas
                                value={transaction.payment_reference}
                                size={200}
                                level="H"
                                includeMargin={false}
                                className="rounded-md"
                            />
                            <p className="mt-3 text-sm text-gray-500">
                                Jumlah: Rp {transaction.amount_price.toLocaleString("id-ID")}
                            </p>
                        </div>
                    ) : (
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <p className="text-sm text-gray-700 font-medium mb-2">Referensi Pembayaran:</p>
                            <p className="text-xl font-bold text-gray-800 break-words">
                                {transaction.payment_reference || 'N/A'}
                            </p>
                            {transaction.channel_code !== 'CASH' && (
                                <p className="mt-2 text-xs text-gray-500">
                                    Harap gunakan referensi ini untuk menyelesaikan pembayaran.
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-center">
                        {transaction.channel_code !== 'CASH' && ImagePaymentMethod(transaction.channel_code)}
                    </div>
                </div>

                <div className="mt-2 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};


