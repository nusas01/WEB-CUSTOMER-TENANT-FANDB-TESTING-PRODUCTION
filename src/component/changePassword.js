import "../style/loginSignup.css"
import { useNavigate } from "react-router-dom"
import {changePasswordCustomer} from "../actions/patch"
import { useDispatch, useSelector } from "react-redux"
import { SpinnerFixed } from "../helper/spinner"
import { useState } from "react"
import { useEffect } from "react"
import {changePasswordCustomerSlice} from "../reducers/patch"
import { Lock, EyeOff, Eye } from "lucide-react";
import { setIsClose } from "../reducers/reducers"
import { OrderTypeInvalidAlert, Toast, ToastPortal } from "./alert"


export default function ChangePassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [spinner, setSpinner] = useState(false)
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertError, setAlertError] = useState(false)
    const [toast, setToast] = useState(null)
    const [lastPassword, setLastPassword] = useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [repeatPassword, setRepeatPassword] = useState(false)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [data, setData] = useState({
        last_password: "",
        new_password: "",
        repeatPassword: ""
    })


    const handleChange = (e) => {
        const {name, value} = e.target
        setData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const {resetChangePasswordCustomer} = changePasswordCustomerSlice.actions
    const {responseSucces, errorField, errorMessage, errorCP, loading} = useSelector((state) => state.changePasswordCustomerState)

    useEffect(() => {
        if (responseSucces) {
            setToast({
                type: 'success',
                message: responseSucces,
            })

            setData({
                last_password: "",
                new_password: "",
                repeatPassword: ""
            })

            setLastPassword(null)
            setNewPassword(null)
        }
    }, [responseSucces])


    useEffect(() => {
        if (errorCP) {
            setToast({
                type: 'error',
                message: errorCP,
            })
        }
    }, [errorCP])

    // useEffect(() => { 
    //     if (errorCP) {
    //         setAlertError(true)
    //         setTimeout(() => {
    //             setAlertError(false)
    //         }, 3000)
    //     }
    // }, [errorCP])

    useEffect(() => {
        setSpinner(loading)
    }, [loading])

    useEffect(() => {
        const errorNewPassword = getErrorMessage("NewPassword")
        if (errorNewPassword) {
            setData((prev) => ({
                ...prev,
                repeatPassword: "",
            }))
            setNewPassword(errorNewPassword)
        }

        const passwordError = getErrorMessage("Password");
        if (passwordError) {
            setLastPassword(passwordError);
        }

        dispatch(resetChangePasswordCustomer())
    }, [errorField])

    const handleChangePassword = (e) => {
        e.preventDefault()
        setLastPassword(null)
        setNewPassword(null)

        if (data.new_password !== data.repeatPassword) {
            setRepeatPassword(true)
            return
        }
        setRepeatPassword(false)

        dispatch(changePasswordCustomer(data))
    }


    const getErrorMessage = (fieldName) => {
        if (!errorField) return null;
    
        // Jika object langsung
        if (typeof errorField === 'object' && !Array.isArray(errorField)) {
            return errorField[fieldName] || null;
        }
    
        // Jika array of object
        if (Array.isArray(errorField)) {
            const found = errorField.find((err) => err[fieldName]);
            return found ? found[fieldName] : null;
        }
    
        return null;
    }

    const {tableId, orderTakeAway, isClose} = useSelector((state) => state.persisted.orderType)
    useEffect(() => {
        if (tableId === null && orderTakeAway === false && !isClose) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway, isClose])

    return (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 md:p-4">
            <div className="md:max-w-md  w-full h-full mx-auto">
                {/* Error Alert */}
                {toast && (
                    <ToastPortal> 
                        <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-100'>
                        <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => {
                            setToast(null)
                            dispatch(resetChangePasswordCustomer())
                        }} 
                        duration={5000}
                        />
                        </div>
                    </ToastPortal>
                )}

                {/* Order Type Invalid Alert */}
                {orderTypeInvalid && (
                    <OrderTypeInvalidAlert onClose={() => { 
                        setOrderTypeInvalid(false)
                        dispatch(setIsClose(true))
                    }}/>
                )}

                <div className="bg-white backdrop-blur-sm rounded-2xl shadow-xl h-[100vh] shadow-slate-200/50 border border-slate-100 p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Ganti Password</h1>
                        <button 
                            onClick={() => navigate("/profile")}   
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-200 hover:scale-105"
                        >
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                            </svg>
                        </button>
                    </div>

                    {/* Password Requirements */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">Persyaratan Password:</h3>
                        <ul className="space-y-1 text-xs text-blue-700">
                            <li className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                Minimal 6 karakter, maksimal 50 karakter
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                Minimal 1 huruf besar (A-Z)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                Minimal 1 angka (0-9)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                Minimal 1 karakter khusus (!@#$%^&*)
                            </li>
                        </ul>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleChangePassword} className="space-y-7">
                        {/* Current Password Field */}
                        <div className="relative">
                            <div className="relative">
                                <div className="absolute flex items-center left-4 inset-y-0">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input 
                                    type={showCurrentPassword ? "text" : "password"}
                                    onChange={handleChange} 
                                    value={data.last_password} 
                                    name="last_password" 
                                    placeholder=" " 
                                    className={`peer w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/50 text-gray-900 placeholder-transparent transition-all duration-200 hover:bg-white/70 ${
                                        lastPassword 
                                        ? 'border-red-400 bg-red-50/50 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500' 
                                        : 'border-gray-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <label className={`absolute left-12 cursor-text select-none -top-3 bg-white px-2 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:font-medium peer-focus:bg-white
                                    ${lastPassword ? 'text-red-500' : 'text-gray-700 peer-focus:text-green-600'}`}
                                    onClick={() => document.querySelector('input[name="last_password"]')?.focus()}
                                >
                                    Current Password
                                </label>
                            </div>
                            {lastPassword && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                    </svg>
                                    {lastPassword}
                                </p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div className="relative">
                            <div className="relative">
                                <div className="absolute flex items-center left-4 inset-y-0">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input 
                                    onChange={handleChange} 
                                    value={data.new_password} 
                                    name="new_password" 
                                    type={showPassword ? "text" : "password"}
                                    placeholder=" " 
                                    className={`peer w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/50 text-gray-900 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:bg-white/70 ${
                                        newPassword 
                                        ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                                        : 'border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 hover:border-slate-300'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <label className={`absolute left-12 cursor-text select-none -top-3 bg-white px-2 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:font-medium peer-focus:bg-white
                                    ${newPassword ? 'text-red-500' : 'text-gray-700 peer-focus:text-green-600'}`}
                                    onClick={() => document.querySelector('input[name="new_password"]')?.focus()}
                                >
                                    Password Baru
                                </label>
                            </div>
                            {newPassword && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                    </svg>
                                    {newPassword}
                                </p>
                            )}
                        </div>

                        {/* Repeat Password Field */}
                        <div className="relative mb-8">
                            <div className="relative">
                                <div className="absolute flex items-center left-4 inset-y-0">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input 
                                    onChange={handleChange} 
                                    value={data.repeatPassword} 
                                    name="repeatPassword" 
                                    type={showRepeatPassword ? "text" : "password"}
                                    placeholder="" 
                                    className={`peer w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/50 text-gray-900 placeholder-transparent  transition-all duration-200 hover:bg-white/70 ${
                                        repeatPassword 
                                        ? 'border-red-400 bg-red-50/50 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500' 
                                        : 'focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500'
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showRepeatPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <label className={`absolute left-12 cursor-text select-none -top-3 bg-white px-2 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:font-medium peer-focus:bg-white
                                    ${repeatPassword ? 'text-red-500' : 'text-gray-700 peer-focus:text-green-600'}`}
                                    onClick={() => document.querySelector('input[name="repeatPassword"]')?.focus()}
                                >
                                    Ulangi Password
                                </label>
                            </div>
                            {repeatPassword && (
                                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                                    </svg>
                                    Password tidak sama
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button 
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-emerald-700 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98]"
                            type="submit"
                            disabled={spinner}
                        >
                            {spinner ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </div>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </form>
                </div>

                {/* Spinner Overlay */}
                {spinner && <SpinnerFixed colors={'fill-emerald-500'}/>}
            </div>
        </div>
    )
}