import { verificationSignupCustomer } from "../actions/post"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import {SpinnerFixed} from "../helper/spinner"
import { useNavigate } from "react-router-dom"
import { verificationSignupCustomerSlice } from "../reducers/post"
import { OrderTypeInvalidAlert, Toast, ToastPortal } from "./alert"

export default function Verification() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [spinner, setSpinner] = useState(false)
    const [codeInput, setCodeInput] = useState("")
    const [toast, setToast] = useState(null)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)

    const {resetSignupVerificationCustomer} = verificationSignupCustomerSlice.actions
    const {succes, message, error, ErrorField, loading} = useSelector((state) => state.verificationSignupCustomerState)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(verificationSignupCustomer({code: codeInput}))
    }
    
    useEffect(() => {
        if(succes) {
            navigate('/access', {
                state: {
                    data: succes
                }
            })
            dispatch(resetSignupVerificationCustomer()) 
        }
    }, [succes])

    useEffect(() => {
        setSpinner(loading)
    }, [loading])

    useEffect(() => {
        if (message) {
            setToast({
                type: "success",
                message: message,
            })

            const timer = setTimeout(() => {
                dispatch(resetSignupVerificationCustomer()) 
            }, 3000)


            return () => clearTimeout(timer)
        }
    }, [message])

    useEffect(() => {
        if (error) {
            setToast({
                type: 'error',
                message: error,
            })

            const timer = setTimeout(() => {
                dispatch(resetSignupVerificationCustomer()) 
            }, 3000) 

            return () => clearTimeout(timer) 
        }
    }, [error])

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
                {/* Toast Notification */}
                {toast && (
                <ToastPortal>
                    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100]">
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
                <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)} />
                )}

                {/* Card */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Verification</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Please enter the verification code sent to your email.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Input Field */}
                    <div className="relative">
                    <input
                        type="text"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value)}
                        placeholder="Enter code"
                        required
                        className={`w-full px-4 py-3 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        ErrorField ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {ErrorField && (
                        <p className="text-red-500 text-sm mt-1 text-start">
                        {ErrorField}
                        </p>
                    )}
                    </div>

                    {/* Submit Button */}
                    <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    Verify
                    </button>
                </form>
                </div>

                {/* Spinner */}
                {spinner && <SpinnerFixed colors={'fill-green-500'} />}
            </div>
            </div>
    )
}