import axios from "axios";
import { 
    getProductsCustomerSlice, 
    logoutCustomerSlice, 
    getDataCustomerSlice, 
    getTransactionOnGoingCustomerSlice, 
    getTransactionsHistoryCustomerSlice, 
    getPaymentMethodsCustomerSlice,
    loginCustomerSlice,
    loginStatusCustomerSlice,
    loginStatusInternalSlice
 } from "../reducers/get.js";
 import {groupByDate} from "../helper/groupData.js"

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
            const message = {
                message: error.response.message,
                status: error.response.status,
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
        dispatch(setTaxRate(response?.data.tax_rate))
      } catch (error) {
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
            dispatch(logoutErrorCustomer(error))
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
            } catch (error) {
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
            dispatch(setLoginStatusInternal(false))
            console.log(error)
        }
    }
}
