import axios from "axios";
import { 
    getProductsCustomerSlice, 
    logoutCustomerSlice, 
    getDataCustomerSlice, 
    getTransactionOnGoingCustomerSlice, 
    getTransactionsHistoryCustomerSlice, 
    getPaymentMethodsCustomerSlice,
    loginStatusCustomerSlice,
    loginStatusInternalSlice,
    logoutInternalSlice,
    transactionCashOnGoingInternalSlice,
    transactionNonCashOnGoingInternalSlice,
    checkTransactionNonCashInternalSlice,
    transactionHistoryInternalSlice,
 } from "../reducers/get.js"
 import {
    statusExpiredTokenSlice
 } from "../reducers/expToken.js"
 import {groupByDate} from "../helper/groupData.js"

const {setStatusExpiredToken} = statusExpiredTokenSlice.actions

const {setLoadingProducts, successFetchProducts, errorFetchProducts} = getProductsCustomerSlice.actions;
export const fetchProductsCustomer = () => {
    return async (dispatch) => {
        dispatch(setLoadingProducts(true))
        try {
            const response = await axios.get(`${process.env.REACT_APP_PRODUCTS_CUSTOMER_URL}`, {
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                },
            })
            dispatch(successFetchProducts(response?.data))
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }
            const message = {
                message: error.response?.data?.message,
                status: error.response?.status,
            }
            dispatch(errorFetchProducts(message))
        } finally {
            dispatch(setLoadingProducts(false))
        }
    }
}

const {setLoadingGetDataCustomer, fetchSuccessGetDataCustomer, fetchErrorGetDataCustomer, resetGetDataCustomer} = getDataCustomerSlice.actions;
export const fetchGetDataCustomer = () => {
    return async (dispatch) => {
        dispatch(setLoadingGetDataCustomer(true))
        try {
            const response = await axios.get(`${process.env.REACT_APP_GET_DATA_CUSTOMER_URL}`, { 
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                },
            })
            dispatch(fetchSuccessGetDataCustomer(response?.data))
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }
            const message = {
                message: error.response.message,
                status: error.response.status,
            }
            dispatch(fetchErrorGetDataCustomer(message))
        } finally {
            dispatch(setLoadingGetDataCustomer(false))
        }
    }
}

const {setLoadingGetTransactionOnGoingCustomer, fetchSuccessGetTransactionOnGoingCustomer, fetchErrorGetTransactionOnGoingCustomer} = getTransactionOnGoingCustomerSlice.actions;
export const fetchTransactionOnGoingCustomer = () => {
    return async (dispatch) => {
        dispatch(setLoadingGetTransactionOnGoingCustomer(true))
        try {
            const response = await axios.get(`${process.env.REACT_APP_GET_TRANSACTION_ON_GOING_CUSTOMER_URL}?`, { 
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                  },
            })
            dispatch(fetchSuccessGetTransactionOnGoingCustomer(response.data))
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }
            const message = {
                error: error.response.message,
                statusCode: error.response.status,
            }
            dispatch(fetchErrorGetTransactionOnGoingCustomer(message))
        } finally {
            dispatch(setLoadingGetTransactionOnGoingCustomer(false))
        }
    }
}

const {setLoadingGetTransactionHistoryCustomer, fetchSuccessGetTransactionHistoryCustomer, fetchErrorGetTransactionHistoryCustomer} = getTransactionsHistoryCustomerSlice.actions;
export const fetchTransactionHistoryCustomer = (page) => {
    return async (dispatch, getState) => {
      dispatch(setLoadingGetTransactionHistoryCustomer(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_TRANSACTION_HISTORY_URL}?page=${page}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log(response)
        const rawData = response?.data?.data || [];
        const hasMore = response?.data.hasMore
        const grouped = groupByDate(rawData);
        const countProses = rawData.filter(trx => trx.order_status === "PROSES").length
  
        dispatch(fetchSuccessGetTransactionHistoryCustomer({ data: grouped, hasMore, page, lengthTransactionProses: countProses }))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
        }
        const message = {
          error: error.response?.data?.message || "Unknown error",
          statusCode: error.response?.status || 500,
        }
        dispatch(fetchErrorGetTransactionHistoryCustomer(message))
      } finally {
        dispatch(setLoadingGetTransactionHistoryCustomer(false))
      }
    }
}

const {setLoadingGetPaymentMethodsCustomer, setTaxRate, fetchSuccessGetPaymentMethodsCustomer, fetchErrorGetPaymentMethodsCustomer} = getPaymentMethodsCustomerSlice.actions;
export const fetchPaymentMethodsCustomer = () => {
    return async (dispatch) => {
        dispatch(setLoadingGetPaymentMethodsCustomer(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_PAYMENT_METHODS_CUSTOMER_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log(response)
        dispatch(fetchSuccessGetPaymentMethodsCustomer(response?.data))
        dispatch(setTaxRate(response?.data?.tax_rate))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        const message = {
          error: error.response?.data?.error || "Unknown error",
          statusCode: error.response?.status || 500,
        }
        dispatch(fetchErrorGetPaymentMethodsCustomer(message))
      } finally {
        dispatch(setLoadingGetPaymentMethodsCustomer(false))
      }
    }
}
  

const {setLoginStatusCustomer} = loginStatusCustomerSlice.actions
const {logoutSuccessCustomer, logoutErrorCustomer, setLoadingLogoutCustomer } = logoutCustomerSlice.actions
export const logoutCustomer = () => {
    return async (dispatch) => {
        dispatch(setLoadingLogoutCustomer(true))
        try{
            const response = await axios.get(`${process.env.REACT_APP_LOGOUT_CUSTOMER_URL}`, {
                withCredentials: true,
                headers: {
                    "API_KEY": process.env.REACT_APP_API_KEY,
                }
            })
            dispatch(logoutSuccessCustomer(response?.data.success))
            dispatch(setLoginStatusCustomer(false))
            dispatch(resetGetDataCustomer())
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }
            dispatch(logoutErrorCustomer(error.response))
        } finally {
            dispatch(setLoadingLogoutCustomer(true))
        }
    }
}

export const loginStatusCustomer = () => {
    return async (dispatch) => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_LOGIN_STATUS_CUSTOMER}`, {
                    withCredentials: true,
                    headers: {
                        "API_KEY": process.env.REACT_APP_API_KEY,
                    }
                })
                dispatch(setLoginStatusCustomer(response?.data.loggedIn))
                console.log("status login customer: ", response.data)
            } catch (error) {
                if (error.response?.data?.code === "TOKEN_EXPIRED") {
                    dispatch(setStatusExpiredToken(true))
                }
                dispatch(setLoginStatusCustomer(false))
                console.log(error)
            }
    }
}

const {setLoginStatusInternal} = loginStatusInternalSlice.actions
export const loginStatusInternal = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_LOGIN_STATUS_INTERNAL}`, {
                withCredentials: true,
                headers: {
                    "API_KEY": process.env.REACT_APP_API_KEY,
                }
            })
            dispatch(setLoginStatusInternal(response?.data.loggedIn))
        } catch (error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }
            dispatch(setLoginStatusInternal(false))
            console.log(error)
        }
    }
}

const {logoutSuccessInternal, logoutErrorInternal, setLoadingLogoutInternal} = logoutInternalSlice.actions
export const logoutInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingLogoutInternal(true))
        try{
            const response = await axios.get(`${process.env.REACT_APP_LOGOUT_INTERNAL_URL}`, {
                withCredentials: true,
                headers: {
                    "API_KEY": process.env.REACT_APP_API_KEY,
                }
            })
            console.log(response)
            dispatch(logoutSuccessInternal(response?.data.success))
            dispatch(setLoginStatusInternal(false))
            // reset data customer ketika sudah di buat endpoint
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }
            console.log(error)
            dispatch(logoutErrorInternal(error.response))
        } finally {
            dispatch(setLoadingLogoutInternal(false))
        }
    }
}

const {fetchSuccessTransactionCashInternal, fetchErrorTransactionCashInternal, setLoadingTransactionCashInternal} = transactionCashOnGoingInternalSlice.actions;
export const fetchTransactionCashOnGoingInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingTransactionCashInternal(true))
        try {
            const response = await axios.get(`${process.env.REACT_APP_GET_TRANSACTION_CASH_ON_GOING_INTERNAL_URL}`, { 
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                  },
            })
            dispatch(fetchSuccessTransactionCashInternal(response.data))
            console.log("apa yang terjadi ini ouyyyyyyyyyyyyhu: ", response)
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }
            console.log(error)
            const message = {
                error: error.response.message,
                statusCode: error.response.status,
            }
            dispatch(fetchErrorTransactionCashInternal(message))
        } finally {
            dispatch(setLoadingTransactionCashInternal(false))
        }
    }
}

const {fetchSuccessTransactionNonCashInternal, fetchErrorTransactionNonCashInternal, setLoadingTransactionNonCashInternal} = transactionNonCashOnGoingInternalSlice.actions;
export const fetchTransactionNonCashOnGoingInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingTransactionNonCashInternal(true))
        try {
            const response = await axios.get(`${process.env.REACT_APP_GET_TRANSACTION_NON_CASH_ON_GOING_INTERNAL_URL}`, { 
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                  },
            })
            dispatch(fetchSuccessTransactionNonCashInternal(response?.data))
            console.log("apa yang terjadi ini di transaction non cash: ", response)
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }
            console.log(error)
            const message = {
                error: error.response?.message,
                statusCode: error.response?.status,
            }
            dispatch(fetchErrorTransactionNonCashInternal(message))
        } finally {
            dispatch(setLoadingTransactionNonCashInternal(false))
        }
    }
}


const {setLoadingTransactionHistoryInternal, fetchErrorTransactionHistoryInternal, fetchSuccessTransactionHistoryInternal} = transactionHistoryInternalSlice.actions
export const fetchTransactionHistory = (data) => {
    return async (dispatch) => {
        dispatch(setLoadingTransactionHistoryInternal(true))
        try {
            const response = await axios.get(`${process.env.REACT_APP_GET_TRANSACTION_HISTORY_INTERNAL_URL}`, { 
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                  },
                params: data,
            })
            dispatch(fetchSuccessTransactionHistoryInternal(response.data))
            console.log("apa yang terjadi ini di history vhoufvhouf: ", response.data)
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }

            if (error === null) {
                return
            } else {
                const data = {
                    error: error.response?.data?.error || error.message || 'Unknown error',
                    statusCode: error.response?.status || 500
                }
                dispatch(fetchErrorTransactionHistoryInternal(data))
            }

        } finally {
            dispatch(setLoadingTransactionHistoryInternal(false))
        }
    }
}


const {checkTransactionNonCashSuccess, checkTransactionNonCashError, setLoadingCheckTransactionNonCash} = checkTransactionNonCashInternalSlice.actions
export const checkTransactionNonCashInternal = (data) => {
    return async (dispatch) => {
        dispatch(setLoadingCheckTransactionNonCash(true))
        try {
            const response = await axios.get(`${process.env.REACT_APP_GET_CHECK_TRANSACTION_INTERNAL_URL}`, { 
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                  },
                params: data,
            })
            dispatch(checkTransactionNonCashSuccess(response.data))
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }
            console.log(error)
            console.log("apa yang terjadi ini di transaction non cash: ", error.response)

            const message = {
                error: error.response.message,
                statusCode: error.response.status,
            }
            dispatch(checkTransactionNonCashError(message))
        } finally {
            dispatch(setLoadingCheckTransactionNonCash(false))
        }
    }
}


const {fetchSuccessGetAllCreateTransactionInternal, fetchErrorGetAllCreateTransactionInternal, setLoadingFetchGetAllCreateTransactionInternal} = transactionHistoryInternalSlice.actions
export const fetchGetAllCreateTransactionInternal = (data) => {
    return async (dispatch) => {
        dispatch(setLoadingFetchGetAllCreateTransactionInternal(true))
        try {
            const response = await axios.get(`${process.env.REACT_APP_GET_CREATE_TRANSACTION_INTERNAL_URL}`, { 
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                  },
                params: data,
            })
            dispatch(fetchSuccessGetAllCreateTransactionInternal(response.data))
            console.log("apa yang terjadi ini di history vhoufvhouf: ", response.data)
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }

            if (error === null) {
                return
            } else {
                const data = {
                    error: error.response?.data?.error || error.message || 'Unknown error',
                    statusCode: error.response?.status || 500
                }
                dispatch(fetchErrorGetAllCreateTransactionInternal(data))
            }

        } finally {
            dispatch(setLoadingFetchGetAllCreateTransactionInternal(false))
        }
    }
}


