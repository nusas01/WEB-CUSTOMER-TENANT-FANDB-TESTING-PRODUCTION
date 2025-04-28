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
            state.loading = action.payload.loading;
            state.loading = action.payload.hasFetched;
        },
        successFetchProducts: (state, action) => {
            state.datas = action.payload;
            state.loading = false;
            state.error = null;
        },
        errorFetchProducts: (state, action) => {
            state.error = action.payload.message;
            state.errorStatusCode = action.payload.statusCode;
            state.loading = null;
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
    data: [],
    error: null,
    statusCode: null,
    loading: false,
}
export const getTransactionOnGoingCustomerSlice = createSlice({
    name: "transactionsOnGoing",
    initialState: initialGetTransactionsOnGoingCustomer,
    reducers: {
        setLoadingGetTransactionOnGoingCustomer: (state, action) => {
            state.loading = action.payload;
        },
        fetchSuccessGetTransactionOnGoingCustomer: (state, action) => {
            state.data = action.payload;
            state.statusCode = 200;
            state.loading = false;
        },
        fetchErrorGetTransactionOnGoingCustomer: (state, action) => {
            state.error = action.payload.error;
            state.statusCode = action.payload.statusCode;
            state.loading = false;
        }
    }
})


const initialTransactionsHistoryCustomer = {
    data: [],
    error: null,
    statusCode: null,
    loading: false,
    hasMore: false,
    page: 1,
}
export const getTransactionsHistoryCustomerSlice = createSlice({
    name: "transactionHistory",
    initialState: initialTransactionsHistoryCustomer,
    reducers: {
        setLoadingGetTransactionHistoryCustomer: (state, action) => {
            state.loading = action.payload
        },
        fetchSuccessGetTransactionHistoryCustomer: (state, action) => {
            const { data, hasMore, page } = action.payload
            if (page === 1) {
                state.data = data;
              } else {
                state.data = [...state.data, ...data]; 
              }
            state.page = page
            state.hasMore = hasMore
            state.statusCode = 200
            state.loading = false    
        },
        fetchErrorGetTransactionHistoryCustomer: (state, action) => {
            state.loading = false
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
