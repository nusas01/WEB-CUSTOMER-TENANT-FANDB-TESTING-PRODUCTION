import { createSlice } from "@reduxjs/toolkit";

const initialSseTransactionOnGoingCustomer = {
    message: [],
}
export const sseTransactionOnGoingCustomerSlice = createSlice({
    name: "sseTransactionOnGoingCustomer",
    initialState: initialSseTransactionOnGoingCustomer,
    reducers: {
        Message: (state, action) => {
            state.message.push(action.payload);
        },
    },
})