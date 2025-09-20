import axiosInstance from "./axiosInstance.js";
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
    getGeneralJournalVoidInternalSlice,
    getGeneralJournalDrafInternalSlice,
    getAssetsStoreInternalSlice,
    getOrdersInternalSlice,
    getOrdersFinishedInternalSlice,
    getTablesInternalSlice,
    getNeracaInternalSlice,
    getDataEmployeeInternalSlice,
    searchOrderInternalSlice,
    getSearchTransactionInternalSlice,getDetailTransactionsHistoryCustomerSlice,
    getEmployeesSlice,
 } from "../reducers/get.js"
 import {
    statusExpiredTokenSlice,
    statusExpiredInternalTokenSlice,
    statusExpiredUserTokenSlice,
    statusServiceMaintenanceSlice,
 } from "../reducers/expToken.js"
 import {groupByDate} from "../helper/groupData.js"
import { data } from "react-router-dom";
import { customerCollectFingerprintAsync } from "../helper/fp.js";

const {setStatusExpiredToken} = statusExpiredTokenSlice.actions
const {setStatusExpiredInternalToken} = statusExpiredInternalTokenSlice.actions
const {setStatusExpiredUserToken} = statusExpiredUserTokenSlice.actions
const {setStatusServiceMaintenance} = statusServiceMaintenanceSlice.actions

export const fetchNonceCustomer = async () => {
  try {
    const response = await  axiosInstance.get(
      `${process.env.REACT_APP_NONCE_CUSTOMER_URL}`,
      {
        headers: {
          'API_KEY': process.env.REACT_APP_API_KEY
        },
        withCredentials: true,
      }
    );

    return { data: response?.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || "Unexpected error" };
  }
};


const {setLoadingProducts, successFetchProducts, errorFetchProducts} = getProductsCustomerSlice.actions;
export const fetchProductsCustomer = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 
        dispatch(setLoadingProducts(true))
        try {
          const nonce_data = await customerCollectFingerprintAsync()

          const params = {
            nonce: nonce_data.nonce,
            value: nonce_data.value,
            iv: nonce_data.iv,
          }

          const response = await axiosInstance.get(`${process.env.REACT_APP_PRODUCTS_CUSTOMER_URL}`, {
              withCredentials: true,
              headers: {
                  'API_KEY': process.env.REACT_APP_API_KEY
              },
              params: params,
          })
          dispatch(successFetchProducts(response?.data))
        } catch(error) {
          if (error.response?.data?.code === "TOKEN_EXPIRED") {
              dispatch(setStatusExpiredToken(true))
          }

          if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
            dispatch(setStatusExpiredInternalToken(true));
          }

          if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
          }

          if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
          }

          const message = {
              message: error.response?.data?.error,
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
    return async (dispatch, getState) => {
        const { statusExpiredToken } = getState().statusExpiredTokenState;
        if (statusExpiredToken) return; 
        
        dispatch(setLoadingGetDataCustomer(true))
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_GET_DATA_CUSTOMER_URL}`, { 
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

            if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
              dispatch(setStatusExpiredInternalToken(true));
            }

            if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
              dispatch(setStatusExpiredUserToken(true));
            }

            if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
              dispatch(setStatusServiceMaintenance(true));
            }

            const message = {
                message: error.response?.data?.error,
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
    return async (dispatch, getState) => {
        const { statusExpiredToken } = getState().statusExpiredTokenState;
        if (statusExpiredToken) return; 
        
        dispatch(setLoadingGetTransactionOnGoingCustomer(true))
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_GET_TRANSACTION_ON_GOING_CUSTOMER_URL}?`, { 
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

            if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
              dispatch(setStatusExpiredInternalToken(true));
            }

            if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
              dispatch(setStatusExpiredUserToken(true));
            }

            if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
              dispatch(setStatusServiceMaintenance(true));
            }

            const message = {
                error: error.response?.data?.error,
                statusCode: error.response.status,
            }
            dispatch(fetchErrorGetTransactionOnGoingCustomer(message))
        } finally {
            dispatch(setLoadingGetTransactionOnGoingCustomer(false))
        }
    }
}

const {setLoadingGetTransactionHistoryCustomer, fetchSuccessGetTransactionHistoryCustomer, fetchErrorGetTransactionHistoryCustomer} = getTransactionsHistoryCustomerSlice.actions;
export const fetchTransactionHistoryCustomer = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingGetTransactionHistoryCustomer(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_TRANSACTION_HISTORY_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        const grouped = groupByDate(response?.data || []);
  
        dispatch(fetchSuccessGetTransactionHistoryCustomer(grouped))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }
        const message = {
          error: error.response?.data?.error,
          statusCode: error.response?.status || 500,
        }
        dispatch(fetchErrorGetTransactionHistoryCustomer(message))
      } finally {
        dispatch(setLoadingGetTransactionHistoryCustomer(false))
      }
    }
}

const {fetchSuccessDetailTransactionHistoryCustomer, fetchErrorDetailTransactionHistoryCustomer, setLoadingDetailTransactionHistoryCustomer} = getDetailTransactionsHistoryCustomerSlice.actions;
export const fetchDetailTransactionHistoryCustomer = (id) => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingDetailTransactionHistoryCustomer(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_DETAIL_TRANSACTION_HISTORY_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
          params: {
            id: id,
          },
        })
        dispatch(fetchSuccessDetailTransactionHistoryCustomer(response?.data || null))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        const message = {
          error: error.response?.data?.error,
          statusCode: error.response?.status,
        }
        dispatch(fetchErrorDetailTransactionHistoryCustomer(message))
      } finally {
        dispatch(setLoadingDetailTransactionHistoryCustomer(false))
      }
    }
}

const {fetchSuccessSearchTransactionInternal, fetchErrorSearchTransactionInternal, setLoadingSearchTransactionInternal} = getSearchTransactionInternalSlice.actions
export const fetchSearchTransactionInternal = (id_transaction) => {
  return async (dispatch, getState) => {
    const { statusExpiredToken } = getState().statusExpiredTokenState;
    if (statusExpiredToken) return;

    dispatch(setLoadingSearchTransactionInternal(true))
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_SEARCH_TRANSACTION_INTERNAL_URL}`, {
        withCredentials: true, 
        headers: {
          'API_KEY': process.env.REACT_APP_API_KEY
        },
        params: {
          id_transaction: id_transaction,
        }
      })
      dispatch(fetchSuccessSearchTransactionInternal(response.data))
    } catch(error) {
      if (error.response?.data?.code === "TOKEN_EXPIRED") {
          dispatch(setStatusExpiredToken(true))
      }

      if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
        dispatch(setStatusExpiredInternalToken(true));
      }

      if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
        dispatch(setStatusExpiredUserToken(true));
      }

      if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
        dispatch(setStatusServiceMaintenance(true));
      }
      
      dispatch(fetchErrorSearchTransactionInternal(error.response?.data?.error))
    } finally {
      dispatch(setLoadingSearchTransactionInternal(false))
    }
  }
}

const {setLoadingGetPaymentMethodsCustomer, fetchSuccessGetPaymentMethodsCustomer, fetchErrorGetPaymentMethodsCustomer} = getPaymentMethodsCustomerSlice.actions;
export const fetchPaymentMethodsCustomer = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingGetPaymentMethodsCustomer(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_PAYMENT_METHODS_CUSTOMER_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        dispatch(fetchSuccessGetPaymentMethodsCustomer(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        const message = {
          error: error.response?.data?.error,
          statusCode: error.response?.status,
        }
        dispatch(fetchErrorGetPaymentMethodsCustomer(message))
      } finally {
        dispatch(setLoadingGetPaymentMethodsCustomer(false))
      }
    }
}
  

const {setLoginStatusCustomer, setLoadingLoginStatusCustomer} = loginStatusCustomerSlice.actions
const {logoutSuccessCustomer, logoutErrorCustomer, setLoadingLogoutCustomer } = logoutCustomerSlice.actions
export const logoutCustomer = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 
    
      dispatch(setLoadingLogoutCustomer(true))
      try{
          const response = await axiosInstance.get(`${process.env.REACT_APP_LOGOUT_CUSTOMER_URL}`, {
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

          if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
            dispatch(setStatusExpiredInternalToken(true));
          }

          if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
          }

          if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
          }
          
          dispatch(logoutErrorCustomer(error.response?.data?.error))
      } finally {
          dispatch(setLoadingLogoutCustomer(true))
      }
    }
}

export const loginStatusCustomer = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingLoginStatusCustomer(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_LOGIN_STATUS_CUSTOMER}`, {
            withCredentials: true,
            headers: {
                "API_KEY": process.env.REACT_APP_API_KEY,
            }
        })
        dispatch(setLoginStatusCustomer(response?.data.loggedIn))
      } catch (error) {
          if (error.response?.data?.code === "TOKEN_EXPIRED") {
              dispatch(setStatusExpiredToken(true))
          }

          if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
            dispatch(setStatusExpiredInternalToken(true));
          }

          if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
          }

          if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
          }

          dispatch(setLoginStatusCustomer(false))
      } finally {
        dispatch(setLoadingLoginStatusCustomer(false))
      }
    }
}

export const fetchNonceInternal = async () => {
  try {
    const response = await  axiosInstance.get(
      `${process.env.REACT_APP_NONCE_INTERNAL_URL}`,
      {
        headers: {
          'API_KEY': process.env.REACT_APP_API_KEY
        },
        withCredentials: true,
      }
    );

    return { data: response?.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data?.error || "Unexpected error" };
  }
};

const {setLoginStatusInternal} = loginStatusInternalSlice.actions
export const loginStatusInternal = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      try {
          const response = await axiosInstance.get(`${process.env.REACT_APP_LOGIN_STATUS_INTERNAL}`, {
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

          if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
            dispatch(setStatusExpiredInternalToken(true));
          }

          if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
          }

          if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
          }

          dispatch(setLoginStatusInternal(false))
      }
    }
}

const {logoutSuccessInternal, logoutErrorInternal, setLoadingLogoutInternal} = logoutInternalSlice.actions
export const logoutInternal = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingLogoutInternal(true))
      try{
          const response = await axiosInstance.get(`${process.env.REACT_APP_LOGOUT_INTERNAL_URL}`, {
              withCredentials: true,
              headers: {
                  "API_KEY": process.env.REACT_APP_API_KEY,
              }
          })
          dispatch(logoutSuccessInternal(response?.data.success))
          dispatch(setLoginStatusInternal(false))
      } catch(error) {
          if (error.response?.data?.code === "TOKEN_EXPIRED") {
              dispatch(setStatusExpiredToken(true))
          }

          if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
            dispatch(setStatusExpiredInternalToken(true));
          }

          if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
          }

          if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
          }
          
          dispatch(logoutErrorInternal(error.response?.data?.error))
      } finally {
          dispatch(setLoadingLogoutInternal(false))
      }
    }
}

const {fetchSuccessTransactionCashInternal, fetchErrorTransactionCashInternal, setLoadingTransactionCashInternal} = transactionCashOnGoingInternalSlice.actions;
export const fetchTransactionCashOnGoingInternal = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingTransactionCashInternal(true))
      try {
          const response = await axiosInstance.get(`${process.env.REACT_APP_GET_TRANSACTION_CASH_ON_GOING_INTERNAL_URL}`, { 
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

          if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
            dispatch(setStatusExpiredInternalToken(true));
          }

          if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
          }

          if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
          }

          const message = {
              error: error.response.data?.error,
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
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingTransactionNonCashInternal(true))
      try {
          const response = await axiosInstance.get(`${process.env.REACT_APP_GET_TRANSACTION_NON_CASH_ON_GOING_INTERNAL_URL}`, { 
              withCredentials: true,
              headers: {
                  'API_KEY': process.env.REACT_APP_API_KEY
                },
          })
          dispatch(fetchSuccessTransactionNonCashInternal(response?.data || []))
      } catch(error) {
          if (error.response?.data?.code === "TOKEN_EXPIRED") {
              dispatch(setStatusExpiredToken(true))
          }

          if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
            dispatch(setStatusExpiredInternalToken(true));
          }

          if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
          }

          if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
          }
          
          const message = {
              error: error.response?.data?.error,
              statusCode: error.response?.status,
          }
          dispatch(fetchErrorTransactionNonCashInternal(message))
      } finally {
          dispatch(setLoadingTransactionNonCashInternal(false))
      }
    }
}


const {
    setLoadingTransactionHistoryInternal, 
    fetchErrorTransactionHistoryInternal, 
    fetchSuccessTransactionHistoryInternal,
    incrementPage,
} = transactionHistoryInternalSlice.actions
export const fetchTransactionHistory = (data, isLoadMore = false) => {
    return async (dispatch, getState) => {
        const { statusExpiredToken } = getState().statusExpiredTokenState;
        if (statusExpiredToken) return;
        
        const currentState = getState().persisted.transactionHistoryInternal;
        
        // Jika sedang loading dan ini bukan initial load, skip
        if (currentState.isLoadingMore && isLoadMore) {
            return;
        }

        dispatch(setLoadingTransactionHistoryInternal({loading: true, isLoadMore: isLoadMore}))
        try {
            const response = await axiosInstance.get(
                `${process.env.REACT_APP_GET_TRANSACTION_HISTORY_INTERNAL_URL}`, 
                {
                    withCredentials: true,
                    headers: {
                        'API_KEY': process.env.REACT_APP_API_KEY
                    },
                    params: {
                        ...data,
                        page: data.page || 1
                    },
                }
            )
            
            const responseData = {
                data: response.data?.data || [],
                hasMore: response.data?.hasMore || false,
                totalCount: response.data?.totalCount || 0,
                totalRevenue: response.data?.totalRevenue || 0,
                page: data.page || 1
            };
            
            dispatch(fetchSuccessTransactionHistoryInternal(responseData))
        } catch(error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }

            if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
              dispatch(setStatusExpiredInternalToken(true));
            }

            if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
              dispatch(setStatusExpiredUserToken(true));
            }

            if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
              dispatch(setStatusServiceMaintenance(true));
            }

            if (error === null) {
                return
            } else {
                const errorData = {
                    error: error.response?.data?.error,
                    statusCode: error.response?.status,
                }
                dispatch(fetchErrorTransactionHistoryInternal(errorData))
            }
        } 
    }
}


const {checkTransactionNonCashSuccess, checkTransactionNonCashError, setLoadingCheckTransactionNonCash} = checkTransactionNonCashInternalSlice.actions
export const checkTransactionNonCashInternal = (data) => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingCheckTransactionNonCash(true))
      try {
          const response = await axiosInstance.get(`${process.env.REACT_APP_GET_CHECK_TRANSACTION_INTERNAL_URL}`, { 
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

          if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
            dispatch(setStatusExpiredInternalToken(true));
          }

          if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
          }

          if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
          }

          dispatch(checkTransactionNonCashError(error.response?.data?.error))
      } finally {
          dispatch(setLoadingCheckTransactionNonCash(false))
      }
    }
}


const {fetchSuccessGetAllCreateTransactionInternal, fetchErrorGetAllCreateTransactionInternal, setLoadingFetchGetAllCreateTransactionInternal} = getAllCreateTransactionInternalSlice.actions
export const fetchGetAllCreateTransactionInternal = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingFetchGetAllCreateTransactionInternal(true))
      try {
          const response = await axiosInstance.get(`${process.env.REACT_APP_GET_CREATE_TRANSACTION_INTERNAL_URL}`, { 
              withCredentials: true,
              headers: {
                  'API_KEY': process.env.REACT_APP_API_KEY
                }
          })
          dispatch(fetchSuccessGetAllCreateTransactionInternal(response.data))
      } catch(error) {
          if (error.response?.data?.code === "TOKEN_EXPIRED") {
              dispatch(setStatusExpiredToken(true))
          }

          if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
            dispatch(setStatusExpiredInternalToken(true));
          }

          if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
          }

          if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
          }

          if (error === null) {
              return
          } else {
              const data = {
                  error: error.response?.data?.error,
                  statusCode: error.response?.status,
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
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingGetPaymentMethodsInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_PUT_PAYMENT_METHODS_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        dispatch(fetchSuccessGetPaymentMethodsInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        const message = {
          error: error.response?.data?.error,
        }
        dispatch(fetchErrorGetPaymentMethodsInternal(message))
      } finally {
        dispatch(setLoadingGetPaymentMethodsInternal(false))
      }
    }
}


const { fetchSuccessCategoryInternal, fetchErrorCategoryInternal, setLoadingCategoryInternal } = getCategoryInternalSlice.actions
export const fetchCategoryInternal = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingCategoryInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_DELETE_GET_CATEGORY_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        dispatch(fetchSuccessCategoryInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(fetchErrorCategoryInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingCategoryInternal(false))
      }
    }
}


const {fetchSuccessCategoryAndProductInternal, fetchErrorCategoryAndProductInternal, setLoadingCategoryAndProductInternal} = getCategoryAndProductInternalSlice.actions
export const fetchCategoryAndProductInternal = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingCategoryAndProductInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_CATEGORY_AND_PRODUCT_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
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

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(fetchErrorCategoryAndProductInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingCategoryAndProductInternal(false))
      }
    }
}

const {setLoadingLabaRugiInternal, fetchSuccessLabaRugiInternal,  fetchErrorLabaRugiInternal} = getLabaRugiInternalSlice.actions 
export const fetchLabaRugiInternal = (startDate, endDate) => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingLabaRugiInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_LABA_RUGI_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
          params: {
            start_date: startDate, 
            end_date: endDate,
          }
        })
        dispatch(fetchSuccessLabaRugiInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(fetchErrorLabaRugiInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingLabaRugiInternal(false))
      }
    }
}

const {fetchSuccessNeracaInternal, fetchErrorNeracaInternal, setLoadingNeracaInternal} = getNeracaInternalSlice.actions
export const fetchNeracaInternal = (startDate, endDate) => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingNeracaInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_NERACA_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
          params: {
            start_date: startDate, 
            end_date: endDate,
          }
        })
        dispatch(fetchSuccessNeracaInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(fetchErrorNeracaInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingNeracaInternal(false))
      }
    }
}

const {fetchSuccessGeneralJournalByEventAllInternal, fetchErrorGeneralJournalByEventAllInternal, setLoadingGeneralJournalByEventAllInternal} = getGeneralJournalByEventAllInternalSlice.actions 
export const fetchGeneralJournalByEventAllInternal = (startDate, endDate) => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingGeneralJournalByEventAllInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_GENERAL_JOURNAL_BY_EVENT_ALL_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
          params: {
            start_date: startDate,
            end_date: endDate
          }
        })
        dispatch(fetchSuccessGeneralJournalByEventAllInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(fetchErrorGeneralJournalByEventAllInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingGeneralJournalByEventAllInternal(false))
      }
    }
}

const {fetchSuccessGeneralJournalByEventPerDayInternal, fetchErrorGeneralJournalByEventPerDayInternal, setLoadingGeneralJournalByEventPerDayInternal} = getGeneralJournalByEventPerDayInternalSlice.actions
export const fetchGeneralJournalByEventPerDayInternal = (startDate, endDate, page = 1, isLoadMore = false) => {
    return async (dispatch, getState) => {
        const { statusExpiredToken } = getState().statusExpiredTokenState;
        if (statusExpiredToken) return;
        
        const currentState = getState().persisted.getGeneralJournalByEventPerDayInternal;
        
        // ✅ Fix: Pengecekan kondisi yang lebih baik
        if (currentState.isLoadMore && isLoadMore) {
            return
        }      
        if (currentState.loadingGeneralJournalByEventPerDayInternal && !isLoadMore) {
            return
        }
        
        dispatch(setLoadingGeneralJournalByEventPerDayInternal({loading: true, isLoadMore}))
        
        try {
            const response = await axiosInstance.get(`${process.env.REACT_APP_GET_GENERAL_JOURNAL_BY_EVENT_PER_DAY_INTERNAL_URL}`, {
                withCredentials: true,
                headers: {
                    'API_KEY': process.env.REACT_APP_API_KEY
                },
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    page: page,
                }
            })
          
            dispatch(fetchSuccessGeneralJournalByEventPerDayInternal({
                data: response?.data?.data || [],
                hasMore: response?.data?.has_next || false,
                totalEntry: response?.data?.total_groups || 0,
                totalKredit: response?.data?.total_kredit || 0,
                totalDebet: response?.data?.total_debit || 0,
                isLoadMore: isLoadMore,
                page: page // ✅ Fix: Kirim page ke reducer
            }))
        } catch (error) {
            if (error.response?.data?.code === "TOKEN_EXPIRED") {
                dispatch(setStatusExpiredToken(true))
            }

            if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
              dispatch(setStatusExpiredInternalToken(true));
            }

            if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
              dispatch(setStatusExpiredUserToken(true));
            }

            if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
              dispatch(setStatusServiceMaintenance(true));
            }

            dispatch(fetchErrorGeneralJournalByEventPerDayInternal(error.response?.data?.error))
        }
    }
}

const {fetchSuccessGeneralJournalVoidInternal, fetchErrorGeneralJournalVoidInternal, setLoadingGeneralJournalVoidInternal} = getGeneralJournalVoidInternalSlice.actions 
export const fetchGeneralJournalVoidInternal = (startDate, endDate, page = 1, isLoadMore = false) => {
  return async (dispatch, getState) => {
    const { statusExpiredToken } = getState().statusExpiredTokenState;
    if (statusExpiredToken) return;

    const currentState = getState().persisted.getGeneralJournalVoidInternal;

    if (currentState.isLoadMore && isLoadMore) {
      return;
    }

    if (currentState.loadingGeneralJournalVoidInternal && !isLoadMore) {
      return;
    }

    dispatch(setLoadingGeneralJournalVoidInternal({ loading: true, isLoadMore }));

    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_GET_GENERAL_JOURNAL_VOID_INTERNAL_URL}`, {
        withCredentials: true,
        headers: {
          'API_KEY': process.env.REACT_APP_API_KEY,
        },
        params: {
          start_date: startDate,
          end_date: endDate,
          page: page,
        },
      });

      dispatch(fetchSuccessGeneralJournalVoidInternal({
        data: response?.data?.data || [],
        page: page,
        hasMore: response?.data?.hasMore || false,
      }));
    } catch (error) {
      if (error.response?.data?.code === "TOKEN_EXPIRED") {
        dispatch(setStatusExpiredToken(true));
      }

      if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
        dispatch(setStatusExpiredInternalToken(true));
      }

      if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
        dispatch(setStatusExpiredUserToken(true));
      }

      if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
        dispatch(setStatusServiceMaintenance(true));
      }

      dispatch(fetchErrorGeneralJournalVoidInternal(error.response?.data?.error));
    }
  };
};


const {fetchSuccessGeneralJournalDrafInternal, fetchErrorGeneralJournalDrafInternal, setLoadingGeneralJournalDrafInternal} = getGeneralJournalDrafInternalSlice.actions
export const fetchGeneralJournalDrafInternal = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingGeneralJournalDrafInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_GENERAL_JOURNAL_DRAF_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        dispatch(fetchSuccessGeneralJournalDrafInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(fetchErrorGeneralJournalDrafInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingGeneralJournalDrafInternal(false))
      }
    }
}


const {fetchSuccessAssetsStoreInternal, fetchErrorAssetsStoreInternal, setLoadingAssetsStoreInternal} = getAssetsStoreInternalSlice.actions
export const fetchAssetsStoreInternal = (data) => {
  return async (dispatch, getState) => {
    const { statusExpiredToken } = getState().statusExpiredTokenState;
    if (statusExpiredToken) return; 

    dispatch(setLoadingAssetsStoreInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_ASSETS_STORE_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        dispatch(fetchSuccessAssetsStoreInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(fetchErrorAssetsStoreInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingAssetsStoreInternal(false))
      }
  }
}

// get order dengan order_status process and progress
const {fetchSuccessOrdersInternal, fetchErrorOrdersInternal, appendOrdersInternal, setLoadingOrdersInternal} = getOrdersInternalSlice.actions
export const fetchOrdersInternal = () => {
  return async (dispatch, getState) => {
    const { statusExpiredToken } = getState().statusExpiredTokenState;
    if (statusExpiredToken) return; 

    dispatch(setLoadingOrdersInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_ORDER_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          }
        })
        dispatch(fetchSuccessOrdersInternal(response?.data?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(fetchErrorOrdersInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingOrdersInternal(false))
      }
  }
}

const { fetchSuccessOrdersFinishedInternal, fetchErrorOrdersFinishedInternal, setLoadingOrdersFinishedInternal } = getOrdersFinishedInternalSlice.actions
export const fetchOrdersFinishedInternal = (startDate, endDate, page, isLoadMore = false) => {
  return async (dispatch, getState) => {
    const { statusExpiredToken } = getState().statusExpiredTokenState;
    if (statusExpiredToken) return;
    
    const currentState = getState().persisted.dataOrdersFinishedInternal;
    
    // Prevent multiple simultaneous requests
    if (currentState.isLoadMore && isLoadMore) {
      return;
    }
    
    if (currentState.loadingOrdersFinishedInternal && !isLoadMore) {
      return;
    }

    dispatch(setLoadingOrdersFinishedInternal({ loading: true, isLoadMore }))
    
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_GET_ORDER_INTERNAL_URL}`, {
        withCredentials: true,
        headers: {
          'API_KEY': process.env.REACT_APP_API_KEY
        },
        params: {
          start_date: startDate,
          end_date: endDate,
          status_finished: 'FINISHED',
          page: page,
        }
      })
      
      dispatch(fetchSuccessOrdersFinishedInternal({
        data: response?.data?.data || [],
        hasMore: response?.data?.hasMore || false,
        totalCount: response?.data?.totalCount || 0,
        totalRevenue: response?.data?.totalRevenue || 0,
      }))
    } catch (error) {
      if (error.response?.data?.code === "TOKEN_EXPIRED") {
        dispatch(setStatusExpiredToken(true))
      }

      if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
        dispatch(setStatusExpiredInternalToken(true));
      }

      if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
        dispatch(setStatusExpiredUserToken(true));
      }

      if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
        dispatch(setStatusServiceMaintenance(true));
      }

      dispatch(fetchErrorOrdersFinishedInternal(error.response?.data?.error))
    }
  }
}

const {fetchSuccessSearchOrder, fetchErrorSearchOrder, setLoadingSearchOrder, addSearchOrder} = searchOrderInternalSlice.actions
export const fetchSearchOrderInternal = (searchQuery, currentPage, isLoadMore = false) => async (dispatch, getState) => {
  const { statusExpiredToken } = getState().statusExpiredTokenState;
  if (statusExpiredToken) return;

  const currentState = getState().searchOrderInternalState;

  if (currentState.isLoadMore && isLoadMore) {
    return;
  }

  if (currentState.isLoadingSearchOrder && !isLoadMore) {
    return;
  }

  dispatch(setLoadingSearchOrder({ loading: true, isLoadMore }));
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_GET_SEARCH_ORDER_INTERNAL_URL}`, {
      withCredentials: true,
      headers: {
        'API_KEY': process.env.REACT_APP_API_KEY,
      },
      params: {
        key: searchQuery,
        page: currentPage,
      },
    });

    dispatch(
      fetchSuccessSearchOrder({
        data: response.data?.data || [],
        hasMore: response.data?.hasMore || false,
        totalCount: response.data?.totalCount || 0,
        totalRevenue: response.data?.totalRevenue || 0,
      })
    );
  } catch (error) {
    if (error.response?.data?.code === 'TOKEN_EXPIRED') {
      dispatch(setStatusExpiredToken(true));
    }

    if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
      dispatch(setStatusExpiredInternalToken(true));
    }

    if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
      dispatch(setStatusExpiredUserToken(true));
    }

    if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
      dispatch(setStatusServiceMaintenance(true));
    }

    dispatch(fetchErrorSearchOrder(error.response?.data?.error));
  }
};


const {fetchSuccessTablesInternal, fetchErrorTablesInternal, setLoadingTablesInternal} = getTablesInternalSlice.actions
export const fetchTablesInternal = () => {
  return async (dispatch, getState) => {
    const { statusExpiredToken } = getState().statusExpiredTokenState;
    if (statusExpiredToken) return; 

    dispatch(setLoadingTablesInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_POST_DELETE_TABLE_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        dispatch(fetchSuccessTablesInternal({ 
          tables: response?.data?.tables, 
          orderTypeTakeAway: response?.data?.order_type_take_away,
        }))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(fetchErrorTablesInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingTablesInternal(false))
      }
  }
}


const {fetchSuccessDataEmployeeInternal, fetchErrorDataEmployeeInternal, setLoadingDataEmployeeInternal} = getDataEmployeeInternalSlice.actions
export const fetchDataEmployeeInternal = () => {
    return async (dispatch, getState) => {
      const { statusExpiredToken } = getState().statusExpiredTokenState;
      if (statusExpiredToken) return; 

      dispatch(setLoadingDataEmployeeInternal(true))
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_GET_PATCH_DATA_EMPLOYEE_INTERNAL_URL}`, {
          withCredentials: true,
          headers: {
            'API_KEY': process.env.REACT_APP_API_KEY
          },
        })
        dispatch(fetchSuccessDataEmployeeInternal(response?.data))
      } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }
        
        dispatch(fetchErrorDataEmployeeInternal(error.response?.data?.error))
      } finally {
        dispatch(setLoadingDataEmployeeInternal(false))
      }
    }
}

const {
  setEmployees,
  setLoadingGetEmployees,
  setErrorGetEmployees,
} = getEmployeesSlice.actions
export const fetchAllEmployees = (storeId) => {
  return async (dispatch) => {
    dispatch(setLoadingGetEmployees(true))
    try {
      const response = await axiosInstance.get(process.env.REACT_APP_EMPLOYEE, {
        params: { store_id: storeId },
        withCredentials: true,
        headers: {
          'API_KEY': process.env.REACT_APP_API_KEY
        },
      })
      dispatch(setEmployees(response?.data || []))
    } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }
        
        dispatch(setErrorGetEmployees(error?.response?.data?.error))
    } finally {
        dispatch(setLoadingGetEmployees(false))
    }
  }
}