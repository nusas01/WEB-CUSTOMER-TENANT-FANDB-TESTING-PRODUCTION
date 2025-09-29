import { useEffect, useState } from "react"
import "../style/loginSignup.css"
import { useNavigate } from "react-router-dom"
import {setPasswordCustomer} from "../actions/patch"
import { useSelector, useDispatch } from "react-redux"
import {setPasswordCustomerSlice} from "../reducers/patch"
import { Eye, Lock, EyeOff, ArrowLeft, Shield } from "lucide-react"
import { fetchGetDataCustomer } from "../actions/get"

export default function SetPassword() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [password, setPassword] = useState(null)
    const [repeatPassword, setRepeatPassword] = useState(null)
    const [toast, setToast] = useState({})
    const [spinner, setSpinner] = useState(false)
    const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)

    const [data, setData] = useState({
        password: "",
        repeatPassword: ""
    })

    // data customer
    const { loggedIn } = useSelector((state) => state.persisted.loginStatusCustomer);
    const {dataCustomer} = useSelector((state) => state.persisted.dataCustomer)
    useEffect(() => {
        if ((!data || Object.keys(data).length === 0) && loggedIn) {
            dispatch(fetchGetDataCustomer())
        }
    }, [])

    useEffect(() => {
        if (!dataCustomer?.password) {
            navigate('/profile')
        }
    }, [])

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
            navigate("/profile")
            setShowPassword(false)
            setShowRepeatPassword(false)
            dispatch(fetchGetDataCustomer())
        }
    }, [successSetPass])

    useEffect(() => {
        if (errorSetPass) {
            setToast({
                type: 'error',
                message: errorSetPass,
            })
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

    const {tableId, orderTakeAway, isClose} = useSelector((state) => state.persisted.orderType)
    useEffect(() => {
        if (tableId === null && orderTakeAway === false && !isClose) {
            setOrderTypeInvalid(true)
            return
        }
    }, [tableId, orderTakeAway, isClose])

    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-lg mx-auto">
                {/* Card Container */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 h-[100vh] sm:my-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate('/profile')}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Set Password</h1>
                        </div>
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
                    <div className="space-y-8">
                        {/* Password */}
                        <div className="relative">
                            <div className="relative">
                                <div className="absolute flex items-center left-4 inset-y-0">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder=" "
                                    className={`peer w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/50 text-gray-900 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:bg-white/70 ${
                                    password ? "border-red-400 bg-red-50/50" : "border-gray-200"
                                    }`}
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <label
                                    onClick={() => document.querySelector('input[name="password"]')?.focus()}
                                    className={`absolute left-12 cursor-text select-none -top-3 bg-white px-2 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:font-medium peer-focus:bg-white ${
                                    password
                                        ? "text-red-500"
                                        : "text-gray-700 peer-focus:text-green-600"
                                    }`}
                                >
                                    Password
                                </label>
                            </div>
                            {password && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                                    <p className="text-red-500 text-sm font-medium">{password}</p>
                                </div>
                            )}
                        </div>

                        {/* Repeat Password */}
                        <div className="relative">
                            <div className="relative">
                                <div className="absolute flex items-center left-4 inset-y-0">
                                    <Lock className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type={showRepeatPassword ? "text" : "password"}
                                    placeholder=" "
                                    className={`peer w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white/50 text-gray-900 placeholder-transparent focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 hover:bg-white/70 ${
                                    repeatPassword ? "border-red-400 bg-red-50/50" : "border-gray-200"
                                    }`}
                                    name="repeatPassword"
                                    value={data.repeatPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                                    className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showRepeatPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <label
                                    onClick={() => document.querySelector('input[name="repeatPassword"]')?.focus()}
                                    className={`absolute left-12 cursor-text select-none -top-3 bg-white px-2 text-sm font-medium transition-all duration-200 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent peer-focus:-top-3 peer-focus:text-sm peer-focus:font-medium peer-focus:bg-white ${
                                    repeatPassword
                                        ? "text-red-500"
                                        : "text-gray-700 peer-focus:text-green-600"
                                    }`}
                                >
                                    Repeat Password
                                </label>
                            </div>
                            {repeatPassword && (
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                                    <p className="text-red-500 text-sm font-medium">Password tidak sama</p>
                                </div>
                            )}
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                            type="submit"
                        >
                            Continue
                        </button>
                    </div>

                    {/* Spinner simulation */}
                    {spinner && (
                        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}