// import { useForm } from "react-hook-form";
// import { FcGoogle } from "react-icons/fc";
// import { FaApple } from "react-icons/fa";
// import { BsMicrosoft } from "react-icons/bs";
import { useEffect, useState } from "react";
import "../style/loginSignup.css";
import { useDispatch, useSelector } from "react-redux";
import { signupCustomer, loginCustomer, loginGoogleCustomer, loginInternal } from "../actions/post";
import { useLocation, useNavigate } from "react-router-dom";
import { loginCustomerSlice, signupCustomerSlice, loginGoogleCustomerSlice } from "../reducers/post";
import {SpinnerFixed} from "../helper/spinner";
import { OrderTypeInvalidAlert } from "./alert";

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [spinner, setSpinner] = useState(false)
  const [signup, setSignup] = useState(false)
  const [repeatPassword, setRepeatPassword] = useState(false)
  const [showAlertError, setShowAlertError] = useState(false)
  const [orderTypeInvalid, setOrderTypeInvalid] = useState(false)
  const location = useLocation()

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
      navigate('/')

      setFormLogin({
          email: '',
          password: '',
      })
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
  const { messageLoginSuccessInternal, loadingLoginInternal, statusCodeSuccessInternal, errorLoginInternal, errPassInternal, errEmailInternal } = useSelector((state) => state.loginInternalState) || {}
  useEffect(() => {
    setSpinner(loadingLoginInternal)
  }, [loadingLoginInternal])  

  useEffect(() => {
    if (messageLoginSuccessInternal) {
      navigate('/internal/admin/kasir/transaction')

      setFormLogin({
          email: '',
          password: '',
      })
    }
  }, [messageLoginSuccessInternal])


  // handle submit login and signup
  const handleSubmit = (e) => {
    e.preventDefault()

    if (signup) {
      // validasi simple
      setRepeatPassword(false)
      if (formSignup.password !== formSignup.repeatPassword) {
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
  const [showAlertVerification, setShowAlertVerificationSuccess] = useState(false)
  const data = location.state?.data

  useEffect(() => {
    if (data) {
      setShowAlertVerificationSuccess(true);

      const timer = setTimeout(() => {
        setShowAlertVerificationSuccess(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [data]);




  // handle login dan signup google
  const {resetLoginGoogleCustomer} = loginGoogleCustomerSlice.actions
  const {errorLoginGoogleCustomer, loadingLoginGoogleCustomer} = useSelector((state) => state.loginGoogleCustomerState)

  useEffect(() => {
    setSpinner(loadingLoginGoogleCustomer)
  }, [loadingLoginGoogleCustomer])

  useEffect(() => {
    if (errorLoginGoogleCustomer) {
      console.log(errorLoginGoogleCustomer)
      setShowAlertError(true)

      const timer = setTimeout(() => {
        dispatch(resetLoginGoogleCustomer())
        setShowAlertError(false)
      }, 200)

      return () => clearTimeout(timer)
    }
  }, [errorLoginGoogleCustomer])

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


  return (
    <div className="container">
      <div className="card">
        {showAlertVerification && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[400px] bg-green-500 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
            Verifikasi berhasil! Silakan login.
          </div>
        )}

        { showAlertError && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[400px] bg-red-500 text-white p-3 rounded-lg text-center shadow-lg animate-slideDown">
                terjadi error di server kami
            </div>
        )}
        
        { orderTypeInvalid && (
            <OrderTypeInvalidAlert onClose={() => setOrderTypeInvalid(false)}/>
        )}

        <h1 className="title">{signup ? 'Create an account' : 'Welcome back'}</h1>

        <form className="form" onSubmit={handleSubmit}>
           <div style={{ position: 'relative' }} className="mb-10">
            <input
              type="email"
              placeholder=""
              name="email"
              value={signup ? formSignup.email : formLogin.email}
              onChange={handleChange}
              className="input"
              required
              style={{
                borderColor: !signup
                  ? (isInternal ? (errEmailInternal ? 'red' : '') : (errUsername ? 'red' : ''))
                  : (emailErrSign ? 'red' : '')
              }}
            />

            <label
              className="input-label"
              style={{
                color: !signup
                  ? (isInternal ? (errEmailInternal ? 'red' : '') : (errUsername ? 'red' : ''))
                  : (emailErrSign ? 'red' : '')
              }}
            >
              Email Address
            </label>

            {!signup ? (
              <p className="text-start mt-1" style={{ color: 'red', fontSize: '13px' }}>
                {isInternal ? errEmailInternal : errUsername}
              </p>
            ) : (
              <p className="text-start mt-1" style={{ color: 'red', fontSize: '13px' }}>
                {emailErrSign}
              </p>
            )}
          </div>

          {signup && (
            <div style={{ position: 'relative' }} className="mb-10">
              <input
                type="text"
                placeholder=""
                name="username"
                value={formSignup.username}
                onChange={handleChange}
                className="input"
                style={ usernameErrSign ? {borderColor: 'red'} : {}}
                required
              />
              <label className="input-label" style={usernameErrSign && {color: 'red'}}>Username</label>
              <p className="text-start mt-1" style={{color: 'red', fontSize: '13px'}}>{usernameErrSign}</p>
            </div>
          )}

          <div style={{ position: 'relative' }} className="mb-10">
            <input
              type="password"
              placeholder=""
              name="password"
              value={signup ? formSignup.password : formLogin.password}
              onChange={handleChange}
              className="input"
              required
              style={{
                borderColor: !signup
                  ? (isInternal ? (errPassInternal ? 'red' : '') : (errPass ? 'red' : ''))
                  : (passwordErrSign ? 'red' : '')
              }}
            />
            
            <label
              className="input-label"
              style={{
                color: !signup
                  ? (isInternal ? (errPassInternal ? 'red' : '') : (errPass ? 'red' : ''))
                  : (passwordErrSign ? 'red' : '')
              }}
            >
              Password
            </label>

            {!signup ? (
              <p className="text-start" style={{ color: 'red', fontSize: '13px' }}>
                {isInternal ? errPassInternal : errPass}
              </p>
            ) : (
              <p className="text-start" style={{ color: 'red', fontSize: '13px' }}>
                {passwordErrSign}
              </p>
            )}
          </div>


          {signup && (
            <div style={{ position: 'relative' }} className="mb-10">
              <input
                type="password"
                placeholder=""
                name="repeatPassword"
                value={formSignup.repeatPassword}
                onChange={handleChange}
                className="input"
                required
               style={ repeatPassword ? {borderColor: 'red'} : {}}
              />
              <label className="input-label" style={repeatPassword ? { color: 'red' } : undefined}>Repeat Password</label>
              { repeatPassword && (
                <p className="text-start" style={{color: 'red', fontSize: '13px'}}>Password dan repeat password tidak sama</p>
              )}
            </div>
          )}

          <button type="submit" className="button">
            {signup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="text">
          {signup ? (
            <>
              Already have an account?{' '}
              <a onClick={toggleSignup} className="link">
                Login
              </a>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <a onClick={toggleSignup} className="link">
                Sign Up
              </a>
            </>
          )}
        </p>

        <div className="divider">
          <hr className="line" />
          <span className="or-text">OR</span>
          <hr className="line" />
        </div>

        <div className="social-buttons">
            <button onClick={() => handleLoginAndSignupGoogle()} className="social-button">
                <span className="icon"/><img className="icon-img" src={require("../image/google.png")}/> Continue with Google
            </button>
        </div>

        {/* spinner */}
          { spinner && (
            <SpinnerFixed/>
          )}
      </div>
    </div>
  );
}

