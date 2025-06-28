import {createSlice} from '@reduxjs/toolkit'


const initialChangePasswordCustomerState = {
    responseSucces: null,
    errorField: null, 
    errorMessage: null,
    errorCP: null,
    loading: false,
}
export const changePasswordCustomerSlice = createSlice({
    name: 'changePassword',
    initialState: initialChangePasswordCustomerState,
    reducers: {
        changePassSuccessCustomer: (state, action) => {
            state.responseSucces = action.payload;
            state.errorField = null;
            state.errorMessage = null;
            state.errorCP = null;
            state.loading = false;
        },
        changePassErrorCustomer: (state, action) => {
            state.errorField = action.payload.errorField;
            state.errorMessage = action.payload.errorMessage;
            state.errorCP = action.payload.error;
            state.responseSucces = null;
            state.loading = false;
        },
        setLoadingPassCustomer: (state, action) => {
            state.loading = action.payload;
        },
        resetChangePasswordCustomer: (state) => {
            state.responseSucces = null
            state.errorField = null
            state.errorMessage = null
            state.errorCP = null
        }
    }
})


const initialSetPasswordCustomerState = {
    successSetPass: null,
    errorFieldSetPass: null,
    errorSetPass: null,
    loadingSetPass: false,
}
export const setPasswordCustomerSlice = createSlice({
    name: 'setPasswordCustomer',
    initialState: initialSetPasswordCustomerState,
    reducers: {
        setLoadingSetPassCustomer: (state, action) => {
            state.loadingSetPass = action.payload
        },
        setPassSuccessCustomer: (state, action) => {
            state.successSetPass = action.payload
            state.errorFieldSetPass = null
            state.errorSetPass = null
        }, 
        setPassErrorCustomer: (state, action) => {
            state.errorFieldSetPass = action.payload.errorField
            state.errorSetPass = action.payload.error
            state.successSetPass = null
        },
        resetSetPassCustomer: (state) => {
            state.successSetPass = null
            state.errorFieldSetPass = null
            state.errorSetPass = null
        }
    }
})


const initialSetUsernameCustomerState = {
    successSetUsername: null,
    errorFieldSetUsername: null,
    errorSetUsername: null,
    loadingSetUsername: false,
}
export const setUsernameCustomerSlice = createSlice({
    name: 'setUsernameCustomer',
    initialState: initialSetUsernameCustomerState,
    reducers: {
        setLoadingSetUsernameCustomer: (state, action) => {
            state.loadingSetUsername = action.payload
        },
        setUsernameSuccessCustomer: (state, action) => {
            state.successSetUsername = action.payload
            state.errorFieldSetUsername = null
            state.errorSetUsername = null
        },
        setUsernameErrorCustomer: (state, action) => {
            state.errorFieldSetUsername = action.payload.errorField
            state.errorSetUsername = action.payload.error
            state.successSetUsername = null
        },
        resetSetUsernameCustomer: (state) => {
            state.successSetUsername = null
            state.errorFieldSetUsername = null
            state.errorSetUsername = null
        }
    }
})


const initialBuyTransactionCashOnGoingInternalState = {
    successBuyTransactionCashOnGoing: null,
    errorBuyTransactionCashOnGoing: null,
    errorFieldBuyTransactionCashOnGoing: null,
    loadingBuyTransactionCashOnGoing: false,
}
export const buyTransactionCashOnGoingInternalSlice = createSlice({
    name: 'setUsernameCustomer',
    initialState: initialBuyTransactionCashOnGoingInternalState,
    reducers: {
        setLoadingBuyTransactionCashOnGoingInternal: (state, action) => {
            state.loadingBuyTransactionCashOnGoing = action.payload
        },
        setSuccessBuyTransactionCashOnGoingInternal: (state, action) => {
            state.successBuyTransactionCashOnGoing = action.payload
            state.errorBuyTransactionCashOnGoing = null
            state.errorFieldBuyTransactionCashOnGoing = null
        },
        setErrorBuyTransactionCashOnGoinInternal: (state, action) => {
            state.errorBuyTransactionCashOnGoing = action.payload.error
            state.errorFieldBuyTransactionCashOnGoing = action.payload.errorField
            state.successBuyTransactionCashOnGoing = null
        },
        resetBuyTransactionCashOnGoingInternal: (state) => {
            state.successBuyTransactionCashOnGoing = null
            state.errorBuyTransactionCashOnGoing = null
            state.errorFieldBuyTransactionCashOnGoing = null
        }
    }
})


const initialAvailableProductInternalState = {
    successAvailableProduct: null,
    errorAvailableProduct: null,
}
export const availbaleProductlSlice = createSlice({
    name: 'availableProduct',
    initialState: initialAvailableProductInternalState,
    reducers: {
        setSuccessAvailableProduct: (state, action) => {
            state.successAvailableProduct = action.payload
            state.errorAvailableProduct = null
        },
        setErrorAvailableProduct: (state, action) => {
            state.errorAvailableProduct = action.payload
            state.successAvailableProduct = null
        },
        resetAvailableProduct: (state) => {
            state.successAvailableProduct = null
            state.errorAvailableProduct = null
        }
    }
})


