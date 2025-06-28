import { createSlice } from "@reduxjs/toolkit";


const initialPaymentSuccessTransactionCashierState = {
    dataTransactionCashierSuccess: null,
}

export const paymentSuccessTransactionCashierSlice = createSlice({
    name: 'paymentSuccessTransactionCashierSlice',
    initialState: initialPaymentSuccessTransactionCashierState,
    reducers: {
        addPaymentSuccessTransactionCashier: (state, action) => {
            state.dataTransactionCashierSuccess = action.payload
        },
        removePaymentSuccessTransactionCashier: (state) => {
            state.dataTransactionCashierSuccess = null
        }
    }
})

const initialDataTempUpdateProductInternalSlice = {
    dataTempUpdateProduct: null
}
export const dataTempUpdateProductSlice = createSlice({
    name: 'dataTempUpdateProduct',
    initialState: initialDataTempUpdateProductInternalSlice,
    reducers: {
        addDataTempUpdateProduct: (state, action) => {
            state.dataTempUpdateProduct = action.payload
        },
        resetDataTempUpdateProduct: (state) => {
            state.dataTempUpdateProduct = null
        }
    }
})


