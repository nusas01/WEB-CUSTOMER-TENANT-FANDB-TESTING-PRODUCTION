import { Navigate } from "react-router-dom";
import "../style/profile.css";
import BottomNavbar from "./bottomNavbar";
import { useNavigate } from "react-router-dom";
import { logoutCustomer, fetchGetDataCustomer } from "../actions/get";
import { loginCustomerSlice } from "../reducers/reducers";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {SpinnerRelative} from "../helper/spinner";
import { OrderTypeInvalidAlert } from "./alert";
import {Mail, Settings, Shield, ChevronRight, Key, LogOut} from "lucide-react"

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const name = 'Raihan Malay';
    const nameParts = name.trim().split(" ")
    const [spinner, setSpinner] = useState(false)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
  

    // Take the first letter from the first two words (first name and last name)
    const initials = nameParts.length > 1 
      ? nameParts[0].charAt(0).toUpperCase() + nameParts[1].charAt(0).toUpperCase()
      : nameParts[0].charAt(0).toUpperCase();


    // handle logout
    const {message, loadingLogout} = useSelector((state) => state.logoutCustomerState) 
    const handleLogout =  async () => {
        await dispatch(logoutCustomer())
        window.location.href = "/"
    }
    useEffect (() => {
        setSpinner(loadingLogout)
    }, [loadingLogout])


    // data customer
    const {data, loading} = useSelector((state) => state.persisted.dataCustomer)
    console.log("data customer:", data)
    useEffect(() => {
        if (!data || Object.keys(data).length === 0) {
          dispatch(fetchGetDataCustomer())
        }
      }, [data]);
    useEffect(() => {
        setSpinner(loading)
    }, [loading])


    // alert invalid order type 
    const {tableId, orderTakeAway} = useSelector((state) => state.persisted.orderType)
    useEffect(() => {
        if (tableId === null && orderTakeAway === false) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway])
    
    return (
        <div className="min-h-screen bg-white pb-20">
            {orderTypeInvalid && (
                <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
            )}

            {!spinner ? (
                <div className="max-w-md mx-auto">
                {/* Header Profile Section */}
                <div className="bg-white rounded-b-3xl shadow-lg border-b border-gray-100 px-6 py-8">
                    <div className="flex items-center space-x-4">
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
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                        James Grey
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
                <div className="px-6 py-6 space-y-3">
                    {/* Email Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Email Address</p>
                        <p className="text-gray-800 font-medium">{data.email}</p>
                        </div>
                    </div>
                    </div>

                    {/* Password Section */}
                    {!data.password ? (
                    <div 
                        onClick={() => navigate("/setpassword")} 
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:border-green-200 cursor-pointer group"
                    >
                        <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-200">
                            <Shield className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                            <p className="text-gray-800 font-semibold group-hover:text-green-700 transition-colors">
                                Set Password
                            </p>
                            <p className="text-sm text-gray-500">Amankan akun Anda</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                    </div>
                    ) : (
                    <div 
                        onClick={() => navigate("/changepassword")} 
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:border-green-200 cursor-pointer group"
                    >
                        <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                            <Key className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                            <p className="text-gray-800 font-semibold group-hover:text-green-700 transition-colors">
                                Ganti Password
                            </p>
                            <p className="text-sm text-gray-500">Ubah kata sandi akun</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                    </div>
                    )}

                    {/* Logout Section */}
                    <div 
                    onClick={() => handleLogout()} 
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 transition-all duration-200 hover:shadow-md hover:border-red-200 cursor-pointer group"
                    >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center group-hover:from-red-200 group-hover:to-red-300 transition-all duration-200">
                            <LogOut className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <p className="text-gray-800 font-semibold group-hover:text-red-700 transition-colors">
                            Keluar
                            </p>
                            <p className="text-sm text-gray-500">Logout dari akun</p>
                        </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                    </div>
                    </div>
                </div>
            </div>
        ) : (
            <SpinnerRelative h="h-[90vh]"/>
        )}
        
        {/* Bottom Navigation */}
        <div className="max-w-[30rem] w-full relative mx-auto">
            <BottomNavbar />
        </div>
    </div>
    )
}
