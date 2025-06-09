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


