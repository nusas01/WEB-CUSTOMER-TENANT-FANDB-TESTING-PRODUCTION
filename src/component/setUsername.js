import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { setUsernameCustomer } from "../actions/patch" 
import {SpinnerFixed} from '../helper/spinner'
import { fetchGetDataCustomer } from '../actions/get'
import {setUsernameCustomerSlice} from '../reducers/patch'
import { OrderTypeInvalidAlert, Toast, ToastPortal } from './alert'

export default function SetUsername() {
    const dispatch = useDispatch()
    const [data, setData] = useState({username: ""})
    const [username, setUsername] = useState(null)
    const [spinner, setSpinner] = useState(false)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
    const [toast, setToast] = useState(null)

    const {resetSetUsernameCustomer} = setUsernameCustomerSlice.actions
    const {successSetUsername, errorFieldSetUsername, errorSetUsername, loadingSetUsername} = useSelector((state) => state.setUsernameCustomerState)

    useEffect(() => {
        setSpinner(loadingSetUsername)
    }, [loadingSetUsername])

    useEffect(() => {
        if (errorFieldSetUsername) {
            const errors = errorFieldSetUsername || [];
            const errorUsername = errors.find((error) => error.Username)?.Username || null
            setUsername(errorUsername)
        }
    }, [errorFieldSetUsername])

    useEffect(() => {
        if (errorSetUsername) {
            setToast({
                type: 'error',
                message: errorSetUsername,
            })
        }
    }, [errorSetUsername])

    useEffect(() => {
        if (successSetUsername) {
            setToast({
                type: 'success',
                message: successSetUsername,
            })

            setData({
                username: "",
            })
            setUsername(null)
            dispatch(fetchGetDataCustomer())
        }
    }, [successSetUsername])

    const handleSubmit = (e) => {
        e.preventDefault()
        setUsername(null)
        dispatch(setUsernameCustomer(data))
    }

    // alert invalid type order
    const {tableId, orderTakeAway} = useSelector((state) => state.persisted.orderType)
    useEffect(() => {
        if (tableId === null && orderTakeAway === false) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway])
    
    return (
        <div className="flex flex-col items-center justify-center fixed inset-0 bg-black/30 backdrop-blur-sm z-80">
            {orderTypeInvalid && (
                <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)} />
            )}

            <div className="animate-in fade-in-zoom-in duration-300 w-full max-w-md p-6">
                {toast && (
                <ToastPortal>
                    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[100]">
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => {
                            setToast(null)
                            dispatch(resetSetUsernameCustomer())
                        }}
                        duration={5000}
                    />
                    </div>
                </ToastPortal>
                )}

                <div className="bg-white rounded-2xl p-8 shadow-xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-800">Set Username</h1>
                    <p className="text-sm text-gray-500">
                    Perlu untuk menambahkan username yang akan digunakan sebagai nama setiap pemesanan
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="relative mb-10">
                    <input
                        type="text"
                        name="username"
                        placeholder=" "
                        value={data.username}
                        onChange={(e) => setData({ ...data, username: e.target.value })}
                        required
                        className={`peer w-full px-4 py-3 border rounded-lg bg-white text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                        username ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    <label
                        className={`absolute left-4 -top-2.5 bg-white px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm ${
                        username
                            ? 'text-red-500'
                            : 'text-gray-600 peer-focus:text-green-600'
                        }`}
                    >
                        Username
                    </label>
                    {username && (
                        <p className="text-red-500 text-sm mt-1 text-start">{username}</p>
                    )}
                    </div>

                    {/* Contoh Username */}
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Contoh username:</span>
                        <span className="font-medium text-[#00a650]">nusas100gr</span>
                    </div>
                    </div>

                    {/* Button */}
                    <button
                    type="submit"
                    className="w-full bg-[#00a650] hover:bg-[#00a660] text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-95"
                    >
                    Simpan Username
                    </button>
                </form>
                </div>

                {/* Spinner */}
                {spinner && <SpinnerFixed colors={'fill-green-500'} />}
            </div>
            </div>
    )
}