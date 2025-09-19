import { useEffect, useState } from "react"
import "../style/loginSignup.css"
import { useNavigate } from "react-router-dom"
import { Tuple } from "@reduxjs/toolkit"
import {setPasswordCustomer} from "../actions/patch"
import { useSelector, useDispatch } from "react-redux"
import {SpinnerFixed} from "../helper/spinner"
import {setPasswordCustomerSlice} from "../reducers/patch"
import {fetchGetDataCustomer} from "../actions/get"
import {OrderTypeInvalidAlert, Toast, ToastPortal} from "./alert"

export default function SetPassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [password, setPassword] = useState(null)
    const [repeatPassword, setRepeatPassword] = useState(null)
    const [toast, setToast] = useState({})
    const [spinner, setSpinner] = useState(false)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
    const [data, setData] = useState({
        password: "",
        repeatPassword: ""
    })

    const {resetSetPassCustomer} = setPasswordCustomerSlice.actions
    const { successSetPass, errorFieldSetPass, errorSetPass, loadingSetPass } = useSelector((state) => state.setPasswordCustomerState)

    useEffect(() => {
       setSpinner(loadingSetPass)        
    }, [loadingSetPass])

    useEffect(() => {
        if (successSetPass) {
            setToast({
                type: 'success',
                message: successSetPass,
            })
            
            setData({
                password: "",
                repeatPassword: "",
            })
            setPassword(null)
            setRepeatPassword(null)

            const timer = setTimeout(() => {
              dispatch(fetchGetDataCustomer())
              dispatch(resetSetPassCustomer())
            }, 3000) 

            return () => clearTimeout(timer) 
        }
    }, [successSetPass])

    useEffect(() => {
        if (errorSetPass) {
            setToast({
                type: 'error',
                message: errorSetPass,
            })

            const timer = setTimeout(() => {
              dispatch(resetSetPassCustomer())
            }, 3000) 

            return () => clearTimeout(timer) 
        }
    }, [errorSetPass])


    useEffect(() => {
        if (errorFieldSetPass) {
            const errors = errorFieldSetPass || [];

            const errorPassword = errors.find((error) => error.Password)?.Password || null
            
            setData({
                ...data, 
                repeatPassword: "",
            })

            setPassword(errorPassword)
            setRepeatPassword(null)
            dispatch(resetSetPassCustomer())
        }
    }, [errorFieldSetPass])
    
    const handleChange = (e) => {
        const { name, value } = e.target
        setData({
            ...data,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (data.password !== data.repeatPassword) {
            setRepeatPassword(true)
            return
        }

        setPassword(null)
        dispatch(setPasswordCustomer(data))
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
                {/* Toast */}
                {toast && (
                <ToastPortal>
                    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-100">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                        duration={3000}
                    />
                    </div>
                </ToastPortal>
                )}

                {/* Alert */}
                {orderTypeInvalid && (
                <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)} />
                )}

                {/* Card Container */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-xl font-semibold text-gray-900">Set Password</h1>
                    <svg
                    onClick={() => navigate("/profile")}
                    className="w-8 h-8 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    >
                    <path
                        fillRule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                    />
                    </svg>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Password */}
                    <div className="relative">
                    <input
                        type="password"
                        placeholder=" "
                        className={`peer w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        password ? "border-red-500" : "border-gray-300"
                        }`}
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        required
                    />
                    <label
                        className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm ${
                        password
                            ? "text-red-500"
                            : "text-gray-600 peer-focus:text-green-600"
                        }`}
                    >
                        Password
                    </label>
                    {password && (
                        <p className="text-red-500 text-sm mt-1">{password}</p>
                    )}
                    </div>

                    {/* Repeat Password */}
                    <div className="relative">
                    <input
                        type="password"
                        placeholder=" "
                        className={`peer w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        repeatPassword ? "border-red-500" : "border-gray-300"
                        }`}
                        name="repeatPassword"
                        value={data.repeatPassword}
                        onChange={handleChange}
                        required
                    />
                    <label
                        className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm ${
                        repeatPassword
                            ? "text-red-500"
                            : "text-gray-600 peer-focus:text-green-600"
                        }`}
                    >
                        Repeat Password
                    </label>
                    {repeatPassword && (
                        <p className="text-red-500 text-sm mt-1">Password tidak sama</p>
                    )}
                    </div>

                    {/* Button */}
                    <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    >
                    Continue
                    </button>
                </form>

                {/* Spinner */}
                {spinner && <SpinnerFixed colors={"fill-green-500"} />}
                </div>
            </div>
            </div>
    )
}