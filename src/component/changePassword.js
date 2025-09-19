import "../style/loginSignup.css"
import { useNavigate } from "react-router-dom"
import {changePasswordCustomer} from "../actions/patch"
import { useDispatch, useSelector } from "react-redux"
import { SpinnerFixed } from "../helper/spinner"
import { useState } from "react"
import { useEffect } from "react"
import {changePasswordCustomerSlice} from "../reducers/patch"
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

            const timer = setTimeout(() => {
                dispatch(resetChangePasswordCustomer())
            }, 3000) 

            return () => clearTimeout(timer) 
        }
    }, [responseSucces])


    useEffect(() => {
        if (errorCP) {
            setToast({
                type: 'error',
                message: errorCP,
            })

            const timer = setTimeout(() => {
                dispatch(resetChangePasswordCustomer())
            }, 3000) 

            return () => clearTimeout(timer) 
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

        if (data.new_password !== data.repeatPassword) {
            setRepeatPassword(true)
            return
        }
        setRepeatPassword(false)

        dispatch(changePasswordCustomer(data))
        dispatch(resetChangePasswordCustomer())
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

    const {tableId, orderTakeAway} = useSelector((state) => state.persisted.orderType)
    useEffect(() => {
        if (tableId === null && orderTakeAway === false) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway])
    
    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto">
                {/* Error Alert */}
                {toast && (
                    <ToastPortal> 
                        <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-100'>
                        <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast(null)} 
                        duration={3000}
                        />
                        </div>
                    </ToastPortal>
                )}

                {/* Order Type Invalid Alert */}
                {orderTypeInvalid && (
                    <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
                )}

                <div className="bg-white rounded-lg shadow-sm p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-xl font-semibold text-gray-900">Ganti Password</h1>
                        <svg 
                            onClick={() => navigate("/profile")}   
                            className="w-8 h-8 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="currentColor" 
                            viewBox="0 0 16 16" 
                        >
                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleChangePassword} className="space-y-6">
                        {/* Current Password Field */}
                        <div className="relative">
                            <input 
                                onChange={handleChange} 
                                value={data.last_password} 
                                name="last_password" 
                                type="password" 
                                placeholder=" " 
                                className={`peer w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                    lastPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            <label className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm ${
                                lastPassword ? 'text-red-500' : 'text-gray-600 peer-focus:text-green-600'
                            }`}>
                                Current Password
                            </label>
                            {lastPassword && (
                                <p className="text-red-500 text-sm mt-1">{lastPassword}</p>
                            )}
                        </div>

                        {/* New Password Field */}
                        <div className="relative">
                            <input 
                                onChange={handleChange} 
                                value={data.new_password} 
                                name="new_password" 
                                type="password" 
                                placeholder=" " 
                                className={`peer w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                    newPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            <label className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm ${
                                newPassword ? 'text-red-500' : 'text-gray-600 peer-focus:text-green-600'
                            }`}>
                                Password
                            </label>
                            {newPassword && (
                                <p className="text-red-500 text-sm mt-1">{newPassword}</p>
                            )}
                        </div>

                        {/* Repeat Password Field */}
                        <div className="relative mb-8">
                            <input 
                                onChange={handleChange} 
                                value={data.repeatPassword} 
                                name="repeatPassword" 
                                type="password" 
                                placeholder=" " 
                                className={`peer w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                    repeatPassword ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            />
                            <label className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm ${
                                repeatPassword ? 'text-red-500' : 'text-gray-600 peer-focus:text-green-600'
                            }`}>
                                Repeat Password
                            </label>
                            {repeatPassword && (
                                <p className="text-red-500 text-sm mt-1">Password tidak sama</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={spinner}
                        >
                            {spinner ? 'Processing...' : 'Continue'}
                        </button>
                    </form>
                </div>

                {/* Spinner Overlay */}
                {spinner && <SpinnerFixed colors={'fill-green-500'}/>}
            </div>
        </div>
    )
}