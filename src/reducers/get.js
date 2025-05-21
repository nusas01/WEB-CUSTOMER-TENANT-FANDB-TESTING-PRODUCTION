import { createSlice } from "@reduxjs/toolkit";

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
            state.loading = action.payload;
        },
        successFetchProducts: (state, action) => {
            state.datas = action.payload;
            state.error = null;
        },
        errorFetchProducts: (state, action) => {
            state.error = action.payload.message;
            state.errorStatusCode = action.payload.statusCode;
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
            state.loggedIn = action.payload;
        }
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
