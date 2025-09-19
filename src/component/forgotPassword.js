import React, { useEffect, useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {forgotPasswordSlice} from '../reducers/post'
import {forgotPassword} from '../actions/post'
import {
  Toast, 
  ToastPortal
} from './alert'
import { useDispatch, useSelector } from 'react-redux';

const ForgotPasswordComponent = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null)
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    setError('');

    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    dispatch(forgotPassword({email: email}))
  };

  const {resetForgotPassword} = forgotPasswordSlice.actions
  const {succesForgotPassword, errorForgotPassword, errorFieldForgotPassword, loadingForgotPassword} = useSelector((state) => state.forgotPasswordState)

  useEffect(() => {
    if (succesForgotPassword) {
      setToast({
        type: 'success',
        message: succesForgotPassword
      })
      setIsSubmitted(true)
      dispatch(resetForgotPassword())
    }
  }, [succesForgotPassword])

  useEffect(() => {
    if (errorForgotPassword) {
      setToast({
        type: 'error',
        message: errorForgotPassword
      })
    }
  }, [errorForgotPassword])

  useEffect(() => {
    dispatch(resetForgotPassword())
  }, [])

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-6 sm:px-6 lg:px-8">

        <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-8 shadow-lg sm:rounded-2xl border border-gray-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Check your email
              </h2>
              
              <p className="text-gray-600 mb-2">
                We've sent a password reset link to
              </p>
              
              <p className="text-green-600 font-semibold mb-8">
                {email}
              </p>
              
              <p className="text-sm text-gray-500 mb-8">
                Didn't receive the email? Check your spam folder or contact support if you continue to have problems.
              </p>
              
              <button
                onClick={() => navigate('/login')}
                className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-12 px-6 sm:px-6 lg:px-8">

      {toast && (
          <ToastPortal> 
              <div className='fixed top-8 left-1/2 transform -translate-x-1/2 z-100'>
              <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => { 
                setToast(null)
                dispatch(resetForgotPassword())
              }} 
              duration={3000}
              />
              </div>
          </ToastPortal>
      )}

      <div className="mt-20 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Forgot password?
          </h2>
          <p className="text-gray-600">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white py-6 px-8 shadow-lg sm:rounded-2xl border border-gray-100">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full pl-10 pr-4 py-3.5 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    ( error || errorFieldForgotPassword?.email) ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                />
              </div>
              {(error || errorFieldForgotPassword?.email) && (
                <div className="mt-2 flex items-center text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0" />
                  {error || errorFieldForgotPassword?.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loadingForgotPassword}
              onClick={() => handleSubmit()}
              className="w-full flex justify-center items-center px-4 py-3.5 border border-transparent rounded-lg text-base font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loadingForgotPassword ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                'Send reset link'
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-green-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;