import { verificationSignupCustomer } from "../actions/post"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import Spinner from "../helper/spinner"
import { useNavigate } from "react-router-dom"
import { verificationSignupCustomerSlice } from "../reducers/post"

export default function Verification() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [spinner, setSpinner] = useState(false)
    const [erroCode, setErrorCode] = useState(null)
    const [codeInput, setCodeInput] = useState("")
    const [showAlert, setShowAlert] = useState(false)


    const {resetSignupVerificationCustomer} = verificationSignupCustomerSlice.actions
    const {succes, message, error, ErrorField, loading} = useSelector((state) => state.verificationSignupCustomerState)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(verificationSignupCustomer({code: codeInput}))
    }

    useEffect(() => {
        console.log(error)
        console.log(ErrorField)
        console.log(message)
    }, [succes, error, ErrorField, loading])

    useEffect(() => {
        if(succes) {
            navigate('/access', {
                state: {
                    data: 'Verification Berhasil, Silahkan login'
                }
            })
            dispatch(resetSignupVerificationCustomer()) 
        }
    }, [succes])

    useEffect(() => {
        setSpinner(loading)
    }, [loading])

    useEffect(() => {
        if (message || error) {
            setShowAlert(true)
    
            const timer = setTimeout(() => {
                setShowAlert(false)
                dispatch(resetSignupVerificationCustomer()) 
            }, 4000)
    
            return () => clearTimeout(timer)
        }
    }, [message, error])

    return (
        <div className="container">
            <div className="card">
                { showAlert && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[400px] bg-red-500 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
                        {message || "terjadi error di server kami"}
                    </div>
                )}
                <h2 className="text-xl font-semibold mb-4">Verification</h2>
                <p className="text-sm text-gray-600 mb-6">
                Please enter the verification code sent to your email.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">    
                        <input
                            type="text"
                            value={codeInput}
                            onChange={(e) => setCodeInput(e.target.value)}
                            placeholder="Enter code"
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
                            style={{borderColor: ErrorField && 'red'}}
                        />
                        { ErrorField && (
                            <p className="text-start" style={{color: 'red', fontSize: '13px'}}>{ErrorField}</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Verify
                    </button>
                </form>
            </div>

                { spinner && (
                    <Spinner/>
                )}
        </div>
    )
}