import axios from "axios"
 import { 
    changePasswordCustomerSlice,
    setPasswordCustomerSlice,
    setUsernameCustomerSlice,
    buyTransactionCashOnGoingInternalSlice,
 } from "../reducers/patch"
  import {
    statusExpiredTokenSlice
 } from "../reducers/expToken.js"


const {setStatusExpiredToken} = statusExpiredTokenSlice.actions


const { changePassSuccessCustomer, changePassErrorCustomer, setLoadingPassCustomer } = changePasswordCustomerSlice.actions;
export const changePasswordCustomer = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingPassCustomer(true))
    try {
        const response = await axios.patch(`${process.env.REACT_APP_CHANGE_PASSWORD_CUSTOMER_URL}`, data, config)
        dispatch(changePassSuccessCustomer(response?.data.success))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        const message = {
            errorField: error.response?.data.ErrorFields, 
            errorMessage: error.response?.data.message,
            error: error.response?.data.error,
        };
        dispatch(changePassErrorCustomer(message));
    } finally {
        dispatch(setLoadingPassCustomer(false))
    }
}


const { setPassSuccessCustomer, setPassErrorCustomer, setLoadingSetPassCustomer } = setPasswordCustomerSlice.actions;
export const setPasswordCustomer = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingSetPassCustomer(true))
    try {
        const response = await axios.patch(`${process.env.REACT_APP_SET_PASSWORD_CUSTOMER_URL}`, data, config)
        dispatch(setPassSuccessCustomer(response?.data.success))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        const message = {
            errorField: error.response?.data?.ErrorFields, 
            error: error.response?.data?.error,
        };
        dispatch(setPassErrorCustomer(message));
    } finally {
        dispatch(setLoadingSetPassCustomer(false))
    }
}


const {setLoadingSetUsernameCustomer, setUsernameSuccessCustomer, setUsernameErrorCustomer} = setUsernameCustomerSlice.actions
export const setUsernameCustomer = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingSetUsernameCustomer(true))
    try {
        const response = await axios.patch(`${process.env.REACT_APP_SET_USERNAME_CUSTOMER_URL}`, data, config)
        dispatch(setUsernameSuccessCustomer(response?.data.success))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        console.log(error.response)
        const message = {
            errorField: error.response?.data.ErrorFields, 
            error: error.response?.data.error,
        };
        dispatch(setUsernameErrorCustomer(message));
    } finally {
        dispatch(setLoadingSetUsernameCustomer(false))
    }
}

const { setSuccessBuyTransactionCashOnGoingInternal, setErrorBuyTransactionCashOnGoinInternal, setLoadingBuyTransactionCashOnGoingInternal } = buyTransactionCashOnGoingInternalSlice.actions;
export const buyTransactionCashOnGoingInternal = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingBuyTransactionCashOnGoingInternal(true))
    try {
        const response = await axios.patch(`${process.env.REACT_APP_BUY_TRANSACTION_CASH_ON_GOING_INTERNAL_URL}`, data, config)
        dispatch(setSuccessBuyTransactionCashOnGoingInternal(response?.data.success))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        console.log(error.response)
        const message = {
            errorField: error.response?.data.ErrorFields, 
            error: error.response?.data.error,
        };
        dispatch(setErrorBuyTransactionCashOnGoinInternal(message));
    } finally {
        dispatch(setLoadingBuyTransactionCashOnGoingInternal(false))
    }
}


