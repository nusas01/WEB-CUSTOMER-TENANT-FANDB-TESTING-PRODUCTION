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
    getPaymentMethodsInternalSlice,
    getAllCreateTransactionInternalSlice,
    getCategoryInternalSlice,
    getCategoryAndProductInternalSlice,
    getLabaRugiInternalSlice,
    getGeneralJournalByEventAllInternalSlice,
    getGeneralJournalByEventPerDayInternalSlice,
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

const {setLoadingGetPaymentMethodsCustomer, fetchSuccessGetPaymentMethodsCustomer, fetchErrorGetPaymentMethodsCustomer} = getPaymentMethodsCustomerSlice.actions;
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
            dispatch(fetchSuccessTransactionCashInternal(response.data || []))
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
            dispatch(fetchSuccessTransactionNonCashInternal(response?.data || []))
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
            dispatch(checkTransactionNonCashError(error.response?.data?.error))
        } finally {
            dispatch(setLoadingCheckTransactionNonCash(false))
        }
    }
}


const {fetchSuccessGetAllCreateTransactionInternal, fetchErrorGetAllCreateTransactionInternal, setLoadingFetchGetAllCreateTransactionInternal} = getAllCreateTransactionInternalSlice.actions
export const fetchGetAllCreateTransactionInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingFetchGetAllCreateTransactionInternal(true))
        try {
            const response = await axios.get(`${process.env.REACT_APP_GET_CREATE_TRANSACTION_INTERNAL_URL}`, { 
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                  }
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


const {setLoadingGetPaymentMethodsInternal, fetchSuccessGetPaymentMethodsInternal, fetchErrorGetPaymentMethodsInternal} = getPaymentMethodsInternalSlice.actions;
export const fetchPaymentMethodsInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingGetPaymentMethodsInternal(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_PAYMENT_METHODS_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log(response)
        dispatch(fetchSuccessGetPaymentMethodsInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        const message = {
          error: error.response?.data?.error || "Unknown error",
        }
        dispatch(fetchErrorGetPaymentMethodsInternal(message))
      } finally {
        dispatch(setLoadingGetPaymentMethodsInternal(false))
      }
    }
}


const { fetchSuccessCategoryInternal, fetchErrorCategoryInternal, setLoadingCategoryInternal } = getCategoryInternalSlice.actions
export const fetchCategoryInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingCategoryInternal(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_CATEGORY_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log("kenapa ini tidaj di ajalankan: ", response)
        dispatch(fetchSuccessCategoryInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        dispatch(fetchErrorCategoryInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingCategoryInternal(false))
      }
    }
}


const {fetchSuccessCategoryAndProductInternal, fetchErrorCategoryAndProductInternal, setLoadingCategoryAndProductInternal} = getCategoryAndProductInternalSlice.actions
export const fetchCategoryAndProductInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingCategoryAndProductInternal(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_CATEGORY_AND_PRODUCT_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log("kenapa ini tidaj di ajalankan: ", response)
        const message = {
            amountCategory: response?.data?.result?.jumlah_category,
            amountProduct: response?.data?.result?.jumlah_product,
            data: response?.data?.result?.data
        }
        dispatch(fetchSuccessCategoryAndProductInternal(message))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        dispatch(fetchErrorCategoryAndProductInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingCategoryAndProductInternal(false))
      }
    }
}

const {setLoadingLabaRugiInternal, fetchSuccessLabaRugiInternal,  fetchErrorLabaRugiInternal} = getLabaRugiInternalSlice.actions 
export const fetchLabaRugiInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingLabaRugiInternal(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_DEFAULT_LABA_RUGI_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log("kenapa ini tidaj di ajalankan: ", response)
        dispatch(fetchSuccessLabaRugiInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        dispatch(fetchErrorLabaRugiInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingLabaRugiInternal(false))
      }
    }
}

const {fetchSuccessGeneralJournalByEventAllInternal, fetchErrorGeneralJournalByEventAllInternal, setLoadingGeneralJournalByEventAllInternal} = getGeneralJournalByEventAllInternalSlice.actions 
export const fetchGeneralJournalByEventAllInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingGeneralJournalByEventAllInternal(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_GENERAL_JOURNAL_BY_EVENT_ALL_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log("kenapa ini tidaj di ajalankan: ", response)
        dispatch(fetchSuccessGeneralJournalByEventAllInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        dispatch(fetchErrorGeneralJournalByEventAllInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingGeneralJournalByEventAllInternal(false))
      }
    }
}

const {fetchSuccessGeneralJournalByEventPerDayInternal, fetchErrorGeneralJournalByEventPerDayInternal, setLoadingGeneralJournalByEventPerDayInternal} = getGeneralJournalByEventPerDayInternalSlice.actions 
export const fetchGeneralJournalByEventPerDayInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingGeneralJournalByEventPerDayInternal(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_GENERAL_JOURNAL_BY_EVENT_PER_DAY}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log("kenapa ini tidaj di ajalankan: ", response)
        dispatch(fetchSuccessGeneralJournalByEventPerDayInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        dispatch(fetchErrorGeneralJournalByEventPerDayInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingGeneralJournalByEventPerDayInternal(false))
      }
    }
}

const {fetchSuccessGeneralJournalVoidInternal, fetchErrorGeneralJournalVoidInternal, setLoadingGeneralJournalVoidInternal} = getGeneralJournalVoidInternalSlice.actions 
export const fetchGeneralJournalVoidInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingGeneralJournalVoidInternal(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_PUT_GENERAL_JOURNAL_VOID}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log("kenapa ini tidaj di ajalankan: ", response)
        dispatch(fetchSuccessGeneralJournalVoidInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        dispatch(fetchErrorGeneralJournalVoidInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingGeneralJournalVoidInternal(false))
      }
    }
}

const {fetchSuccessGeneralJournalDrafInternal, fetchErrorGeneralJournalDrafInternal, setLoadingGeneralJournalDrafInternal} = getGeneralJournalDrafInternalSlice.actions
export const fetchGeneralJournalDrafInternal = () => {
    return async (dispatch) => {
        dispatch(setLoadingGeneralJournalDrafInternal(true))
      try {
        const response = await axios.get(`${process.env.REACT_APP_GET_PUT_GENERAL_JOURNAL_DRAF}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        console.log("kenapa ini tidaj di ajalankan: ", response)
        dispatch(fetchSuccessGeneralJournalDrafInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        dispatch(fetchErrorGeneralJournalDrafInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingGeneralJournalDrafInternal(false))
      }
    }
}