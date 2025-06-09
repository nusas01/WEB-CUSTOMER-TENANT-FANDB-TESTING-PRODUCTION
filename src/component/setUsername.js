import React from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { setUsernameCustomer } from "../actions/patch" 
import {SpinnerFixed} from '../helper/spinner'
import { fetchGetDataCustomer } from '../actions/get'
import {setUsernameCustomerSlice} from '../reducers/patch'
import { OrderTypeInvalidAlert } from './alert'

export default function SetUsername() {
    const dispatch = useDispatch()
    const [data, setData] = useState({username: ""})
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertError, setAlertError] = useState(false)
    const [username, setUsername] = useState(null)
    const [spinner, setSpinner] = useState(false)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)


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
            setAlertError(true)
            setTimeout(() => {
                setAlertError(false)
                dispatch(resetSetUsernameCustomer())
            }, 3000)
        }
    }, [errorSetUsername])

    useEffect(() => {
        if (successSetUsername) {
            setData({
                username: "",
            })
            setUsername(null)
            setAlertSuccess(true)
            dispatch(fetchGetDataCustomer())
            setTimeout(() => {
                setAlertSuccess(false)
                dispatch(resetSetUsernameCustomer())
            }, 2000)
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
            { orderTypeInvalid && (
                <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
            )}
            <div className="animate-in fade-in-zoom-in duration-300 w-full max-w-md p-6">
                {alertSuccess && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] bg-green-500/50 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
                        Set username Berhasil
                    </div>
                )}

                { alertError && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] bg-red-500/50 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
                        Terjadi error di server kami
                    </div>
                )}

                <div className="bg-white rounded-2xl p-8 shadow-xl space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold text-gray-800">Set Username</h1>
                        <p className="text-gray-500 text-sm">
                            Perlu untuk menambahkan username yang akan digunakan sebagai nama setiap pemesanan
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div style={{position: 'relative'}} className="mb-10">
                            <input 
                                type="text" 
                                placeholder="" 
                                className="input" 
                                name="username"
                                value={data.username}
                                onChange={(e) => setData({...data, username: e.target.value})}
                                style={{border: username && '1px solid red'}}
                                required
                            />
                            <label className="input-label" style={{color : username && 'red'}}>Username</label>
                            {
                                username && <p className="text-start mt-1" style={{color: 'red', fontSize: '13px'}}>{username}</p>
                            }
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Contoh username:</span>
                                <span className="font-medium text-[#00a650]">nusas100gr</span>
                            </div>
                        </div>

                        <button type='submit' className="w-full bg-[#00a650] hover:bg-[#00a660] text-white py-3 px-6 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-95">
                            Simpan Username
                        </button>
                    </form>
                </div>

                {spinner && <SpinnerFixed colors={'fill-green-500'}/>}
            </div>
        </div>
    )
}