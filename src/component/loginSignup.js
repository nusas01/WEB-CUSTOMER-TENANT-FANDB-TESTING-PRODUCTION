// import { useForm } from "react-hook-form";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";
// import { BsMicrosoft } from "react-icons/bs";
import { useEffect, useState } from "react";
import "../style/loginSignup.css";
import { LogIn } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { signupCustomer, loginCustomer, loginGoogleCustomer, loginInternal } from "../actions/post";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  loginCustomerSlice, 
  signupCustomerSlice, 
  loginGoogleCustomerSlice,
  loginInternalSlice,
} from "../reducers/post";
import {SpinnerFixed} from "../helper/spinner";
import { OrderTypeInvalidAlert, Toast, ToastPortal } from "./alert";

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [spinner, setSpinner] = useState(false)
  const [signup, setSignup] = useState(false)
  const [repeatPassword, setRepeatPassword] = useState(false)
  const [showAlertError, setShowAlertError] = useState(false)
  const [toast, setToast] = useState(null)
  const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false);

  const isInternal = location.pathname.startsWith('/internal')

  const [formSignup, setFormSignup] = useState({
    email: '',
    username: '',
    password: '',
    repeatPassword: '',
  })

  const [formLogin, setFormLogin] = useState({
    email: '',
    password: '',
  })

  // handle toggle signup dan login 
  // ketika switch from signup maka clear all data before switch begitu juga sebaliknya
  const {resetSignupCustomer} = signupCustomerSlice.actions
  const {setLoginStateNullCustomer} =  loginCustomerSlice.actions
  const toggleSignup = () => setSignup((prev) => !prev)
  useEffect(() => {
    if (signup) {
      dispatch(resetSignupCustomer())
      setFormSignup({
          email: '',
          username: '',
          password: '',
          repeatPassword: '',
      })
    } else {
      dispatch(setLoginStateNullCustomer())
      setFormLogin({
        email: '',
        password: '',
    })
    }
  }, [signup])


  // handle signup dan handle perilakunya
  // ketika berhasil signup redirect ke enpoint verification register
  const { successSign, error, errorObject, loadingSign } = useSelector((state) => state.signupCustomerState)
  const [emailErrSign, setEmailErrSign] = useState(null)
  const [usernameErrSign, setUsernameErrSign] = useState(null)
  const [passwordErrSign, setPasswordErrSign] = useState(null)
  
  useEffect(() => {
    if (successSign) {
      navigate('/verification')
      dispatch(resetSignupCustomer())
      setFormSignup({
          email: '',
          username: '',
          password: '',
          repeatPassword: '',
      })
      setEmailErrSign(null)
      setUsernameErrSign(null)
      setPasswordErrSign(null)
    }
  }, [successSign])

  useEffect(() => {
    if (error) {
      setToast({
        type: 'error',
        message: error,
      })
    }
  }, [error])

  useEffect(() => {
    setSpinner(loadingSign)
  }, [loadingSign])

  useEffect(() => {

    const errors = errorObject?.ErrorField || [];

    const emailError = errors.find(err => err.Email)?.Email || null;
    const usernameError = errors.find(err => err.Username)?.Username || null;
    const passwordError = errors.find(err => err.Password)?.Password || null;

    setFormSignup(prev => ({
      ...prev,
      repeatPassword: ''
    }))
    
    setEmailErrSign(emailError);
    setUsernameErrSign(usernameError);
    setPasswordErrSign(passwordError);
  }, [errorObject])


  // handle login dan perilakunya 
  // ketika berhasil login redirect ke enpoint root
  const { messageLoginSuccess, loadingLogin, statusCodeSuccess, errorLogin, errPass, errUsername } = useSelector((state) => state.loginCustomerState) || {}
  useEffect(() => {
    setSpinner(loadingLogin)
  }, [loadingLogin])  

  useEffect(() => {
    if (messageLoginSuccess) {
      dispatch(setLoginStateNullCustomer())
      setFormLogin({
        email: '',
        password: '',
      })
      navigate('/')
    }
  }, [messageLoginSuccess])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (signup) {
      setFormSignup((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setFormLogin((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }


  // handle response login internal 
  const { setLoginStateNullInternal } = loginInternalSlice.actions
  const { messageLoginSuccessInternal, loadingLoginInternal, statusCodeSuccessInternal, errorLoginInternal, errPassInternal, errEmailInternal } = useSelector((state) => state.loginInternalState) || {}
  useEffect(() => {
    setSpinner(loadingLoginInternal)
  }, [loadingLoginInternal])  

  useEffect(() => {
    if (messageLoginSuccessInternal) {
      dispatch(setLoginStateNullInternal())
      setFormLogin({
        email: '',
        password: '',
      })
      navigate('/internal/admin/transaction')
    }
  }, [messageLoginSuccessInternal])


  // handle submit login and signup
  const handleSubmit = (e) => {
    e.preventDefault()

    if (signup) {
      // validasi simple
      setRepeatPassword(false)
      if (formSignup?.password !== formSignup?.repeatPassword) {
        setRepeatPassword(true)
        return
      }
      dispatch(
        signupCustomer({
          email: formSignup.email,
          username: formSignup.username,
          password: formSignup.password,
        })
      )
    } else {
      if (isInternal) {
        dispatch(loginInternal(formLogin))
      } else {
        dispatch(loginCustomer(formLogin))
      }
    }
  }



  // handle receive data from verification code 
  const data = location.state?.data

  // useEffect(() => {
  //   if (data) {
  //     setShowAlertVerificationSuccess(true);

  //     const timer = setTimeout(() => {
  //       setShowAlertVerificationSuccess(false);
  //     }, 2000);

  //     return () => clearTimeout(timer);
  //   }
  // }, [data]);

  useEffect(() => {
    if (data) {
        setToast({
            type: 'success',
            message: 'Verifikasi berhasil! Silakan login.',
        })

        // Clear state after showing toast
        navigate(location.pathname, { replace: true });
    }
  }, [data])



  // handle login dan signup google
  const {resetLoginGoogleCustomer} = loginGoogleCustomerSlice.actions
  const {errorLoginGoogleCustomer, loadingLoginGoogleCustomer} = useSelector((state) => state.loginGoogleCustomerState)

  useEffect(() => {
    setSpinner(loadingLoginGoogleCustomer)
  }, [loadingLoginGoogleCustomer])
  
  
  const handleLoginAndSignupGoogle = () => {
    dispatch(setLoginStateNullCustomer())
    dispatch(resetSignupCustomer())

    setFormLogin({
        email: '',
        password: '',
      })
      
      setFormSignup({
        email: '',
        username: '',
        password: '',
        repeatPassword: '',
      })
      
      dispatch(loginGoogleCustomer())
  }
    
  useEffect(() => {
        if (errorLoginGoogleCustomer || errorLoginInternal || errorLogin) {
            setToast({
                type: 'error',
                message: errorLoginGoogleCustomer || errorLoginInternal || errorLogin,
            })
        }
    }, [errorLoginGoogleCustomer, errorLoginInternal, errorLogin])


  // handle alert error invalid order type jika user bukan scan dari table atau kasir
  const {tableId, orderTakeAway} = useSelector((state) => state.persisted.orderType)
  useEffect(() => {
    if (!isInternal) {
      if (tableId === null && orderTakeAway === false) {
          setOrderTypeInvalid(true)
          return
      }
    }
  }, [tableId, orderTakeAway]) 



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Determine current password value
  const passwordValue = signup ? formSignup?.password : formLogin?.password;

  // Determine if field has error
  const hasError = !signup
    ? (isInternal ? !!errPassInternal : !!errPass)
    : !!passwordErrSign;

  // Get error message
  const errorMessage = !signup
    ? (isInternal ? errPassInternal : errPass)
    : passwordErrSign;


  const handleToForgotPassword = () => {
    if (isInternal) {
      navigate("/internal/forgot/password")
    } else {
      navigate("/forgot/password")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center sm:p-4">
      {/* Toast Container */}
      {toast && (
        <ToastPortal> 
          <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-50'>
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => {
                setToast(null)
                dispatch(resetSignupCustomer())
                dispatch(resetLoginGoogleCustomer())
                dispatch(setLoginStateNullCustomer())
                dispatch(setLoginStateNullInternal())
              }} 
              duration={3000}
            />
          </div>
        </ToastPortal>
      )}

      {/* Order Type Invalid Alert */}
      {orderTypeInvalid && (
        <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
      )}

      {/* Main Card Container */}
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-16">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {signup ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {signup ? 'Create your account' : 'Sign in to your account'}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={signup ? formSignup.email : formLogin.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    (!signup
                      ? (isInternal ? (errEmailInternal ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500') : (errUsername ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'))
                      : (emailErrSign ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'))
                  }`}
                  required
                />
              </div>
              {(!signup ? (isInternal ? errEmailInternal : errUsername) : emailErrSign) && (
                <p className="text-red-500 text-sm">
                  {!signup ? (isInternal ? errEmailInternal : errUsername) : emailErrSign}
                </p>
              )}
            </div>

            {/* Username Field (Signup only) */}
            {signup && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formSignup.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      usernameErrSign ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                    }`}
                    required
                  />
                </div>
                {usernameErrSign && (
                  <p className="text-red-500 text-sm">{usernameErrSign}</p>
                )}
              </div>
            )}

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  value={signup ? formSignup?.password : formLogin?.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    (!signup
                      ? (isInternal ? (errPassInternal ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-900 focus:border-gray-900') : (errPass ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'))
                      : (passwordErrSign ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'))
                  }`}
                  required
                />
              </div>
              {(!signup ? (isInternal ? errPassInternal : errPass) : passwordErrSign) && (
                <p className="text-red-500 text-sm">
                  {!signup ? (isInternal ? errPassInternal : errPass) : passwordErrSign}
                </p>
              )}
            </div>

            {/* Repeat Password Field (Signup only) */}
            {signup && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="repeatPassword"
                    value={formSignup.repeatPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      repeatPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                    }`}
                    required
                  />
                </div>
                {repeatPassword && (
                  <p className="text-red-500 text-sm">
                    Password dan repeat password tidak sama
                  </p>
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password (Login only) */}
            {!signup && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <button type="button" 
                  onClick={() => handleToForgotPassword()}
                  className={`font-medium ${
                    isInternal ? 'text-gray-900 hover:text-gray-700' : 'text-green-600 hover:text-green-500'
                  }`}>
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`w-full flex justify-center items-center py-3 px-4 rounded-xl text-white font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                isInternal 
                  ? 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-900 shadow-lg' 
                  : 'bg-green-500 hover:bg-green-600 focus:ring-green-500 shadow-lg'
              }`}
            >
              {signup ? (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Account
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {signup ? (
                <>
                  Already have an account?{' '}
                  <button onClick={toggleSignup} className="font-semibold text-green-600 hover:text-green-500 transition-colors duration-200">
                    Login
                  </button>
                </>
              ) : (
                <>
                  {location.pathname !== '/internal/access' && (
                    <>
                      Don't have an account?{' '}
                      <button onClick={toggleSignup} className="font-semibold text-green-600 hover:text-green-500 transition-colors duration-200">
                        Sign Up
                      </button>
                    </>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Social Login */}
          {location.pathname !== '/internal/access' && (
            <>
              <div className="mt-8 flex items-center">
                <hr className="flex-1 border-gray-300" />
                <span className="px-4 text-sm text-gray-500 bg-white">OR</span>
                <hr className="flex-1 border-gray-300" />
              </div>

              <div className="mt-6">
                <button 
                  onClick={() => handleLoginAndSignupGoogle()} 
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <img className="h-5 w-5 mr-3" src={require("../image/google.png")} alt="Google" />
                  Continue with Google
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Loading Spinner */}
      {spinner && (
        <SpinnerFixed colors={isInternal ? 'fill-gray-900' : 'fill-green-500'} />
      )}
    </div>
  );
}