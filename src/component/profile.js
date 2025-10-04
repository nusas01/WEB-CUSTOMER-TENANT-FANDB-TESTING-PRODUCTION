import { Navigate, useLocation } from "react-router-dom";
import "../style/profile.css";
import BottomNavbar from "./bottomNavbar";
import { useNavigate } from "react-router-dom";
import { loginCustomerSlice } from "../reducers/reducers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {SpinnerRelative} from "../helper/spinner";
import { OrderTypeInvalidAlert } from "./alert";
import {Mail, Settings, Shield, ChevronRight, Key, LogOut} from "lucide-react"
import { Toast, ToastPortal } from "./alert";
import { setOrderTypeContext, setIsClose } from "../reducers/reducers"
import { resetApp } from '../reducers/state';
import { 
    logoutCustomer, 
    fetchGetDataCustomer,
} from "../actions/get";
import { 
    logoutCustomerSlice,
    getProductsCustomerSlice,
    getDataCustomerSlice,
    getPaymentMethodsCustomerSlice,
    loginStatusCustomerSlice,
    getTransactionOnGoingCustomerSlice,
    getTransactionsHistoryCustomerSlice,
} from "../reducers/get";
import { setPasswordCustomerSlice } from "../reducers/patch";
import { clearCart } from "../reducers/cartSlice";
import { ModernStoreBrand } from "./model";


export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = 'Raihan Malay';
    const nameParts = name.trim().split(" ")
    const [spinner, setSpinner] = useState(false)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
    const [toast, setToast] = useState(null);

    const { successFetchProducts } = getProductsCustomerSlice.actions
    const { fetchSuccessGetDataCustomer } = getDataCustomerSlice.actions
    const { fetchSuccessGetPaymentMethodsCustomer } = getPaymentMethodsCustomerSlice.actions
    const { setLoginStatusCustomer } = loginStatusCustomerSlice.actions
    const { fetchSuccessGetTransactionOnGoingCustomer } = getTransactionOnGoingCustomerSlice.actions
    const { fetchSuccessGetTransactionHistoryCustomer } = getTransactionsHistoryCustomerSlice.actions
    
    // handle logout
    const {resetLogoutCustomer} = logoutCustomerSlice.actions
    const {message, loadingLogout} = useSelector((state) => state.logoutCustomerState) 
    const handleLogout = () => {
        dispatch(logoutCustomer())
    }

    useEffect(() => {
        if (message) {
            dispatch(resetLogoutCustomer())
            dispatch(successFetchProducts([]))
            dispatch(fetchSuccessGetDataCustomer({}))
            dispatch(fetchSuccessGetPaymentMethodsCustomer({payment_methods: []}))
            dispatch(setOrderTypeContext({orderTakeAway: null, tableId: null}))
            dispatch(setLoginStatusCustomer(null))
            dispatch(fetchSuccessGetTransactionOnGoingCustomer([]))
            dispatch(fetchSuccessGetTransactionHistoryCustomer(null))
            dispatch(clearCart())
            window.location.href = "/"
        }
    }, [message])

    useEffect (() => {
        setSpinner(loadingLogout)
    }, [loadingLogout])

    // data customer
    const { loggedIn } = useSelector((state) => state.persisted.loginStatusCustomer);
    const {data} = useSelector((state) => state.persisted.dataCustomer)
    useEffect(() => {
        if ((!data || Object.keys(data).length === 0) && loggedIn) {
            dispatch(fetchGetDataCustomer())
        }
    }, [])

    useEffect(() => {
        if (!loggedIn) {
            navigate("/access")
        }
    }, [])

    // alert invalid order type 
    const {tableId, orderTakeAway, isClose} = useSelector((state) => state.persisted.orderType)
    
    // get table id or order_tye_take_away = true from query
    const location = useLocation();
    if (orderTakeAway === null && tableId === null) {
        const q = new URLSearchParams(location.search);
        const orderTakeAways = q.get("order_type_take_away") === "true";
        const tableIds = q.get("table_id");

        dispatch(setOrderTypeContext({ orderTakeAway: orderTakeAways, tableId: tableIds }));
    }

    useEffect(() => {
        if (tableId === null && orderTakeAway === false && !isClose) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway, isClose])

    const getInitials = (username) => {
    if (!username) return "";
    return username
        .replace(/[^a-zA-Z]/g, "") // hapus angka & simbol
        .slice(0, 2)               // ambil 2 huruf awal
        .toUpperCase();
    };

    const initials = getInitials(data?.username);


    const {resetSetPassCustomer} = setPasswordCustomerSlice.actions
    const {successSetPass} = useSelector((state) => state.setPasswordCustomerState)
    
     useEffect(() => {
        if (successSetPass) {
            setToast({
                type: 'success',
                message: successSetPass,
            })
        }
    }, [successSetPass])

    return (
        <div>
            <div className="container-activity bg-light">
                {orderTypeInvalid && (
                    <ToastPortal>
                        <OrderTypeInvalidAlert onClose={() => {
                            setOrderTypeInvalid(false)
                            dispatch(setIsClose(true))
                        }}/>
                    </ToastPortal>
                )}

                { toast && (
                    <ToastPortal>
                        <div className="fixed top-4 right-4 z-100">
                            <Toast
                            message={toast.message}
                            type={toast.type}
                            onClose={() => {
                                setToast(null)
                                dispatch(resetSetPassCustomer())
                            }}
                            duration={5000}
                            />
                        </div>
                    </ToastPortal>
                )}

                <ModernStoreBrand 
                    storeName="Nusas Resto"
                    location="Serpong"
                    rating={5}
                    totalReviews={1000}
                    phone="6289524474969"
                />

                <div className="body-activity">
                    {!spinner ? (
                        <div className="container-activity bg-light pt-4">
                            {/* Header Profile Section */}
                            <div className="bg-white rounded-b-3xl shadow-lg border-b border-gray-100 px-10 py-4 mx-4 sm:mx-0">
                                <div className="flex items-center mx-auto w-full space-x-4">
                                    {/* Profile Circle */}
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                                            <span className="text-white text-2xl font-bold">
                                                {initials}
                                            </span>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-2xl font-bold text-gray-800 mb-1 truncate">
                                            {data?.username || ""}
                                        </h1>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            Nama digunakan saat pemesanan
                                        </p>
                                        <div className="flex items-center mt-2 space-x-2">
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            <span className="text-xs text-green-600 font-medium">Akun Aktif</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Menu Options */}
                            <div className="px-6 py-6 space-y-3 mx-4 sm:mx-0">
                                {/* Email Section */}
                                <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-gray-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-500 mb-1">Email Address</p>
                                            <p className="text-gray-800 font-medium truncate">{data.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Section */}
                                {!data.password ? (
                                    <div 
                                        onClick={() => navigate("/set-password")} 
                                        className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:border-green-200 cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-200 flex-shrink-0">
                                                    <Shield className="w-6 h-6 text-orange-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-800 font-semibold group-hover:text-green-700 transition-colors">
                                                        Set Password
                                                    </p>
                                                    <p className="text-sm text-gray-500">Amankan akun Anda</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-2" />
                                        </div>
                                    </div>
                                ) : (
                                    <div 
                                        onClick={() => navigate("/change-password")} 
                                        className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:border-green-200 cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1 min-w-0">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200 flex-shrink-0">
                                                    <Key className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-800 font-semibold group-hover:text-green-700 transition-colors">
                                                        Ganti Password
                                                    </p>
                                                    <p className="text-sm text-gray-500">Ubah kata sandi akun</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-2" />
                                        </div>
                                    </div>
                                )}

                                {/* Logout Section */}
                                <div 
                                    onClick={() => handleLogout()} 
                                    className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:border-red-200 cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-all duration-200 flex-shrink-0">
                                                <LogOut className="w-6 h-6 text-red-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-800 font-semibold group-hover:text-red-700 transition-colors">
                                                    Keluar
                                                </p>
                                                <p className="text-sm text-gray-500">Logout dari akun</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0 ml-2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <SpinnerRelative h="h-[90vh]"/>
                    )}
                </div>
                <BottomNavbar/>
            </div>
        </div>
    )
}
