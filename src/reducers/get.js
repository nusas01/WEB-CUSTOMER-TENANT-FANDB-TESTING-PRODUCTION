import { createSlice } from "@reduxjs/toolkit"

const initialGetProductsCustomerState = {
    datas: [],
    loading: false,
    error: null,
    errorStatusCode: null,
    hasFetched: false,
}
export const getProductsCustomerSlice = createSlice({
    name: "products",
    initialState: initialGetProductsCustomerState,
    reducers: {
        setLoadingProducts: (state, action) => {
            state.loading = action.payload
        },
        successFetchProducts: (state, action) => {
            state.datas = action.payload
            state.error = null
        },
        errorFetchProducts: (state, action) => {
            state.error = action.payload.message
            state.errorStatusCode = action.payload.statusCode
        }
    }
})


const initialGetDataCustomer = {
    data: {},
    error: null,
    statusCode: null,
    loading: false,
}
export const getDataCustomerSlice = createSlice({
    name: "dataCustomer",
    initialState: initialGetDataCustomer,
    reducers: {
        setLoadingGetDataCustomer: (state, action) => {
            state.loading = action.payload;
        },
        fetchSuccessGetDataCustomer: (state, action) => {
            state.data = action.payload;
            state.statusCode =  200;
            state.loading = false;
        },
        fetchErrorGetDataCustomer: (state, action) => {
            state.error = action.payload.error;
            state.statusCode = action.payload.statusCode;
            state.loading = false;
        },
        resetGetDataCustomer: (state) => {
            state.data = {};
        }
    }
})


const initialGetTransactionsOnGoingCustomer = {
    dataTransactionOnGoing: [],
    lengthTransactionOnGoing: 0,
    error: null,
    statusCode: null,
    loading: false,
}
export const getTransactionOnGoingCustomerSlice = createSlice({
    name: "transactionsOnGoing",
    initialState: initialGetTransactionsOnGoingCustomer,
    reducers: {
        setLoadingGetTransactionOnGoingCustomer: (state, action) => {
            state.loading = action.payload
        },
        fetchSuccessGetTransactionOnGoingCustomer: (state, action) => {
            state.dataTransactionOnGoing = action.payload
            state.lengthTransactionOnGoing = action.payload.length
            state.statusCode = 200
            state.loading = false
        },
        fetchErrorGetTransactionOnGoingCustomer: (state, action) => {
            state.error = action.payload.error
            state.statusCode = action.payload.statusCode
            state.loading = false
        },
        removeTransactionOnGoingById: (state, action) => {
            state.dataTransactionOnGoing = state.dataTransactionOnGoing.filter(
                (item) => item.id !== action.payload
            )
        },
        updateTransactionOnGoingStatusById: (state, action) => {
            const updated = state.dataTransactionOnGoing.map(item => {
                if (String(item.id) === String(action.payload.id)) {
                    return {
                        ...item,
                        order_status: action.payload.order_status,
                        status_transaction: action.payload.status_transaction,
                    }
                }
                return item
            })
            state.dataTransactionOnGoing = updated
        }        
    }
})


const initialTransactionsHistoryCustomer = {
    dataTransactionHistory: [],
    error: null,
    statusCode: null,
    lengthTransactionProses: 0,
    loadingHistory: false,
    hasMore: false,
    page: 1,
}
export const getTransactionsHistoryCustomerSlice = createSlice({
    name: "transactionHistory",
    initialState: initialTransactionsHistoryCustomer,
    reducers: {
        setLoadingGetTransactionHistoryCustomer: (state, action) => {
            state.loadingHistory = action.payload
        },
        fetchSuccessGetTransactionHistoryCustomer: (state, action) => {
            const { data, hasMore, page, lengthTransactionProses } = action.payload
            if (page === 1) {
                state.dataTransactionHistory = data;
              } else {
                state.dataTransactionHistory = [...state.dataTransactionHistory, ...data]; 
              }
            state.page = page
            state.hasMore = hasMore
            state.lengthTransactionProses = lengthTransactionProses
        },
        fetchErrorGetTransactionHistoryCustomer: (state, action) => {
            state.error = action.payload.error
            state.statusCode = action.payload.statusCode
        }
    }
})


const initialGetPaymentMethodsCustomer = {
    dataPaymentMethodCustomer: {},
    taxRate: 0,
    errorPaymentMethodsCustomer: null,
    statusCodePaymentMethodsCustomer: null,
    loadingPaymentMethodsCustomer: false,
}
export const getPaymentMethodsCustomerSlice = createSlice({
    name: "dataPaymentMethod",
    initialState: initialGetPaymentMethodsCustomer,
    reducers: {
        setLoadingGetPaymentMethodsCustomer: (state, action) => {
            state.loadingPaymentMethodsCustomer = action.payload
        },
        fetchSuccessGetPaymentMethodsCustomer: (state, action) => {
            state.dataPaymentMethodCustomer = action.payload
            state.taxRate = action.payload.data.tax_rate
            state.statusCodePaymentMethodsCustomer = 200
            state.errorPaymentMethodsCustomer = null
        },
        fetchErrorGetPaymentMethodsCustomer: (state, action) => {
            state.errorPaymentMethodsCustomer = action.payload.error
            state.statusCodePaymentMethodsCustomer = action.payload.statusCode
        }
    }
})

const initialLogoutCustomerState = {
    message: null, 
    error: null,
    loadingLogout: false,
}
export const logoutCustomerSlice = createSlice({
    name: 'logout',
    initialState: initialLogoutCustomerState,
    reducers: {
        logoutSuccessCustomer: (state, action) => {
            state.message = action.payload;
        },
        logoutErrorCustomer: (state, action) => {
            state.error = action.payload;
        },
        setLoadingLogoutCustomer: (state, action) => {
            state.loadingLogout = action.payload;
        }
    }
})


const initialLoginStatusCustomer = {
    loggedIn: false,
}
export const loginStatusCustomerSlice = createSlice({
    name: 'loginStatusCustomerSlice',
    initialState: initialLoginStatusCustomer,
    reducers: {
        setLoginStatusCustomer: (state, action) => {
            state.loggedIn = action.payload
        },
    }
})

const initialLoginStatusInternal = {
    loggedIn: false,
}
export const loginStatusInternalSlice = createSlice({
    name: 'loginStatusInternalSlice',
    initialState: initialLoginStatusInternal,
    reducers: {
        setLoginStatusInternal: (state, action) => {
            state.loggedIn = action.payload;
        }
    }
})


const initialLogoutInternalState = {
    message: null, 
    error: null,
    loadingLogout: false,
}
export const logoutInternalSlice = createSlice({
    name: 'logout',
    initialState: initialLogoutInternalState,
    reducers: {
        logoutSuccessInternal: (state, action) => {
            state.message = action.payload
            state.error = null
        },
        logoutErrorInternal: (state, action) => {
            state.error = action.payload
            state.message = null
        },
        setLoadingLogoutInternal: (state, action) => {
            state.loadingLogout = action.payload
        }, 
        resetLogoutInternal: (state) => {
            state.message = null
            state.error = null
        }
    }
})

const initialTransactionCashOnGoingInternalState = {
    dataTransactionCashInternal: [],
    errorTransactionCashInternal: null,
    loadingTransactionCashInternal: false,
}
export const transactionCashOnGoingInternalSlice = createSlice({
    name: 'transactionCashOnGoingInternal',
    initialState: initialTransactionCashOnGoingInternalState,
    reducers: {
        setLoadingTransactionCashInternal: (state, action) => {
            state.loadingTransactionCashInternal = action.payload
        },
        fetchSuccessTransactionCashInternal: (state, action) => {
            state.dataTransactionCashInternal = action.payload
            state.errorTransactionCashInternal = null
            state.loadingTransactionCashInternal = false
        },
        fetchErrorTransactionCashInternal: (state, action) => {
            state.errorTransactionCashInternal = action.payload
            state.loadingTransactionCashInternal = false
        }, 
        removeTransactionCashOnGoingInternalById: (state, action) => {
            state.dataTransactionCashInternal = state.dataTransactionCashInternal.filter(
                (item) => item.id !== action.payload
            )
        },
        updateStatusTransactionCashOnGoingInternalById: (state, action) => {
            const updated = state.dataTransactionCashInternal.map(item => {
                if (String(item.id) === String(action.payload.id)) {
                    return {
                        ...item,
                        status_transaction: action.payload.status_transaction,
                    }
                }
                return item
            })
            state.dataTransactionCashInternal = updated
        },
        addTransactionCashOnGoingInternal: (state, action) => {
            state.dataTransactionCashInternal.push(action.payload)
        }
    }
})


const initialTransactionNonCashOnGoingInternalState = {
    dataTransactionNonCashInternal: [],
    errorTransactionNonCashInternal: null,
    loadingTransactionNonCashInternal: false,
}
export const transactionNonCashOnGoingInternalSlice  = createSlice({
    name: 'transactionNonCashOnGoingInternal',
    initialState: initialTransactionNonCashOnGoingInternalState,
    reducers: {
        setLoadingTransactionNonCashInternal: (state, action) => {
            state.loadingTransactionNonCashInternal = action.payload
        },
        fetchSuccessTransactionNonCashInternal: (state, action) => {
            state.dataTransactionNonCashInternal = action.payload
            state.errorTransactionNonCashInternal = null
            state.loadingTransactionNonCashInternal = false
        },
        fetchErrorTransactionNonCashInternal: (state, action) => {
            state.errorTransactionNonCashInternal = action.payload
            state.loadingTransactionNonCashInternal = false
        },
        removeTransactionNonCashOnGoingInternalById: (state, action) => {
            state.dataTransactionNonCashInternal = state.dataTransactionNonCashInternal.filter(
                (item) => item.id !== action.payload
            )
        },
        updateStatusTransactionNonCashOnGoingInternalById: (state, action) => {
            const updated = state.dataTransactionNonCashInternal.map(item => {
                if (String(item.id) === String(action.payload.id)) {
                    return {
                        ...item,
                        status_transaction: action.payload.status_transaction,
                    }
                }
                return item
            })
            state.dataTransactionNonCashInternal = updated
        }, 
        addTransactionNonCashOnGoingInternal: (state, action) => {
            state.dataTransactionNonCashInternal.push(action.payload)
        }
    }
})

const dataFilteringTransactionHistoryState = {
    method: null,
    status: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    page: 0,
} 
export const dataFilteringTransactionHistorySlice = createSlice({
    name: "dataFilteringHistory",  
    initialState: dataFilteringTransactionHistoryState,
    reducers: {
        setData: (state, action) => {
            state.method = action.payload.method
            state.status = action.payload.status
            state.startDate = action.payload.startDate
            state.endDate = action.payload.endDate
            state.startTime = action.payload.startTime
            state.endTime = action.payload.endTime
            state.page = action.payload.page
        }, 
        setIncrementPage: (state) => {
            state.page += 1
        },
        resetData : (state) => {
            state.method = null
            state.status = ''
            state.startDate = ''
            state.endDate = ''
            state.startTime = ''
            state.endTime = ''
            state.page = 0
        }
    }
})


const intitalTransactionHistoryState = {
    dataTransactionHistoryInternal: [],
    errorTransactionHistoryInternal: null,
    statusCodeTransactionHistoryInternal: null,
    loadingTransactionHistoryInternal: false,
}
export const transactionHistoryInternalSlice = createSlice({
    name: 'transactionHistoryInternal',
    initialState: intitalTransactionHistoryState,
    reducers: {
        setLoadingTransactionHistoryInternal: (state, action) => {
            state.loadingTransactionHistoryInternal = action.payload
        },
        fetchSuccessTransactionHistoryInternal: (state, action) => {
            state.dataTransactionHistoryInternal = action.payload.data
            state.statusCodeTransactionHistoryInternal = 200
            state.errorTransactionHistoryInternal = null
            state.loadingTransactionHistoryInternal = false
        },
        fetchErrorTransactionHistoryInternal: (state, action) => {
            state.errorTransactionHistoryInternal = action.payload.error
            state.statusCodeTransactionHistoryInternal = action.payload.statusCode
            state.loadingTransactionHistoryInternal = false
        },
        resetTransactionHitoryInternal: (state) => {  
            state.errorTransactionHistoryInternal = null
            state.dataTransactionHistoryInternal = []
        }
    }
})


const initialCheckTransactionNonCashInternalState = {
    checkTransactionNonCashId: null,
    statusCheckTransactionNonCash: null, 
    errorCheckTransactionNonCash: null,
    loadingCheckTransactionNonCash: false,
}
export const checkTransactionNonCashInternalSlice = createSlice({
    name: 'checkTransactionNonCashInternal',
    initialState: initialCheckTransactionNonCashInternalState,
    reducers: {
        checkTransactionNonCashSuccess: (state, action) => {
            state.checkTransactionNonCashId = action.payload.checkTransactionNonCashId;
            state.statusCheckTransactionNonCash = action.payload.statusCheckTransactionNonCash;
            state.errorCheckTransactionNonCash = null;
            state.loadingCheckTransactionNonCash = false;
        },
        checkTransactionNonCashError: (state, action) => {
            state.errorCheckTransactionNonCash = action.payload.error;
            state.statusCheckTransactionNonCash = null;
            state.loadingCheckTransactionNonCash = false;
        },
        setLoadingCheckTransactionNonCash: (state, action) => {
            state.loadingCheckTransactionNonCash = action.payload;
        },
        resetCheckTransactionNonCash: (state) => {
            state.checkTransactionNonCashId = null;
            state.statusCheckTransactionNonCash = null;
            state.errorCheckTransactionNonCash = null;
        }
    }
})

