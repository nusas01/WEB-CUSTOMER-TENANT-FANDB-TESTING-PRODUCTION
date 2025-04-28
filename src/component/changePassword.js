import "../style/loginSignup.css"
import { useNavigate } from "react-router-dom"
import {changePasswordCustomer} from "../actions/patch"
import { useDispatch, useSelector } from "react-redux"
import Spinner from "../helper/spinner"
import { useState } from "react"
import { useEffect } from "react"
import {changePasswordCustomerSlice} from "../reducers/patch"


export default function ChangePassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [spinner, setSpinner] = useState(false)
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertError, setAlertError] = useState(false)
    const [lastPassword, setLastPassword] = useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [repeatPassword, setRepeatPassword] = useState(false)
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
            setData({
                last_password: "",
                new_password: "",
                repeatPassword: ""
            })
            dispatch(resetChangePasswordCustomer())
            setLastPassword(null)
            setNewPassword(null)
            setAlertSuccess(true)
            setTimeout(() => {
                setAlertSuccess(false)
            }, 3000)
        }
    }, [responseSucces])

    useEffect(() => { 
        if (errorCP) {
            setAlertError(true)
            setTimeout(() => {
                setAlertError(false)
            }, 3000)
        }
    }, [errorCP])

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

    useEffect(() => {
        console.log("reponseSucces", responseSucces)
        console.log("errorField", errorField)
        console.log("errorMessage", errorMessage)
        console.log("errorCP", errorCP)
    }, [responseSucces, errorField, errorMessage, errorCP])

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

    console.log(errorField?.Password)
    
    return (
        <div>   
            <div class="container-change-password">
                <div class="card-change-password">
                    {alertSuccess && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[400px] bg-green-500 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
                            Ganti Password Berhasil
                        </div>
                    )}

                    { alertError && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[400px] bg-red-500 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
                            terjadi error di server kami
                        </div>
                    )}
                    <div className="flex" style={{justifyContent: 'space-between'}}>
                        <h1 className="title-change-password">Ganti Password</h1>
                        <svg 
                        onClick={() => navigate("/profile")}   
                        style={{opacity: '0.3', cursor: 'pointer'}}
                        xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16" 
                        >
                        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                        </svg>
                    </div>
                    <form className="form" onSubmit={handleChangePassword}>
                        <div style={{position: 'relative'}} className="mb-10">
                            <input 
                                onChange={handleChange} 
                                value={data.last_password} 
                                name="last_password" type="text" 
                                placeholder="" 
                                className="input" 
                                required
                                style={{border: lastPassword && '1px solid red'}}
                            />
                            <label className="input-label" style={{color: lastPassword && 'red'}}>Current Password</label>
                            { lastPassword && <p className="text-start mt-1" style={{color: 'red', fontSize: '13px'}}>{lastPassword}</p>}
                        </div>
                        <div style={{position: 'relative'}} className="mb-10">
                            <input 
                                onChange={handleChange} 
                                value={data.new_password} 
                                name="new_password" 
                                type="Password" 
                                placeholder="" 
                                className="input" 
                                required
                                style={{border: newPassword && '1px solid red'}}
                            />
                            <label className="input-label" style={{color: newPassword && 'red'}}>Password</label>
                            { newPassword && <p className="text-start mt-1" style={{color: 'red', fontSize: '13px'}}>{newPassword}</p>}
                        </div>
                        <div className="mb-10" style={{position: 'relative', marginBottom: '1.5rem'}}>
                            <input 
                                onChange={handleChange} 
                                value={data.repeatPassword} 
                                name="repeatPassword" 
                                type="Password" 
                                placeholder="" 
                                className="input" 
                                required
                                style={{border: repeatPassword && '1px solid red'}}
                            />
                            <label className="input-label" style={{color: repeatPassword && 'red'}}>Repeat Password</label>
                            {repeatPassword && <p className="text-start mt-1" style={{color: 'red', fontSize: '13px'}}>Password tidak sama</p>}
                        </div>
                        <button className="button" type="submit">Continue</button>
                    </form>

                    {spinner && <Spinner />}
                </div>
            </div>
        </div>
    )
}