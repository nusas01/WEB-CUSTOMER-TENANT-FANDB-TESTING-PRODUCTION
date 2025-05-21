import { useEffect, useState } from "react"
import "../style/loginSignup.css"
import { useNavigate } from "react-router-dom"
import { Tuple } from "@reduxjs/toolkit"
import {setPasswordCustomer} from "../actions/patch"
import { useSelector, useDispatch } from "react-redux"
import {SpinnerFixed} from "../helper/spinner"
import {setPasswordCustomerSlice} from "../reducers/patch"
import {fetchGetDataCustomer} from "../actions/get"
import {OrderTypeInvalidAlert} from "./alert"

export default function SetPassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [password, setPassword] = useState(null)
    const [repeatPassword, setRepeatPassword] = useState(null)
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertError, setAlertError] = useState(false)
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
            setData({
                password: "",
                repeatPassword: "",
            })
            setPassword(null)
            setRepeatPassword(null)
            setAlertSuccess(true)
            dispatch(fetchGetDataCustomer())
            dispatch(resetSetPassCustomer())
            setTimeout(() => {
                setAlertSuccess(false)
            }, 2000)
        }
    }, [successSetPass])

    useEffect(() => {
        if (errorSetPass) {
            setAlertError(true)
            setTimeout(() => {
                setAlertError(false)
                dispatch(resetSetPassCustomer())
            }, 3500)
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
        <div>
            <div class="container-change-password">
                <div class="card-change-password">
                    {alertSuccess && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[400px] bg-green-500 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
                            Set Password Berhasil
                        </div>
                    )}

                    { alertError && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[400px] bg-red-500 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
                            terjadi error di server kami
                        </div>
                    )}

                    { orderTypeInvalid && (
                        <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
                    )}
                    
                    <div className="flex" style={{justifyContent: 'space-between'}}>
                        <h1 className="title-change-password">Set Password</h1>
                        <svg 
                        onClick={() => navigate("/profile")}   
                        style={{opacity: '0.3', cursor: 'pointer'}}
                        xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16" 
                        >
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                    </div>
                    <div>
                    <form className="form" onSubmit={handleSubmit}>
                        <div style={{position: 'relative'}} className="mb-10">
                            <input 
                                type="password" 
                                placeholder="" 
                                className="input" 
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                style={{border: password && '1px solid red'}}
                                required
                            />
                            <label className="input-label" style={{color: password && 'red'}}>Password</label>
                            { password && <p className="text-start mt-1" style={{color: 'red', fontSize: '13px'}}>{password}</p>}
                        </div>
                        <div style={{position: 'relative'}} className="mb-10">
                            <input 
                                type="password" 
                                placeholder="" 
                                className="input" 
                                name="repeatPassword"
                                value={data.repeatPassword}
                                onChange={handleChange}
                                style={{border: repeatPassword && '1px solid red'}}
                                required
                            />
                            <label className="input-label" style={{color : repeatPassword && 'red'}}>Repeat Password</label>
                            {
                                repeatPassword && <p className="text-start mt-1" style={{color: 'red', fontSize: '13px'}}>Password tidak sama</p>
                            }
                        </div>
                        <button className="button" type="submit">Continue</button>
                    </form>
                    </div>

                    {spinner && <SpinnerFixed />}
                </div>
            </div>
        </div>
    )
}