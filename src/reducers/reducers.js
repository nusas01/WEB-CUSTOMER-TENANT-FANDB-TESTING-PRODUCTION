import { createSlice, findNonSerializableValue } from "@reduxjs/toolkit"

const initialOrderTypeState = {
    orderTakeAway: null,
    tableId: null,
}
export const orderTypeSlice = createSlice({
    name: 'orderType',
    initialState: initialOrderTypeState,
    reducers: {
        setOrderTypeContext: (state, action) => {
            console.log('Dispatching setOrderTypeContext with:', action.payload);
            state.orderTakeAway = action.payload.orderTakeAway
            state.tableId = action.payload.tableId
        }
    }
})
export const { setOrderTypeContext } = orderTypeSlice.actions;


const initialButtonActivityCustomerState = {
    buttonActive: "on going"
}
export const buttonActivityCustomerSlice = createSlice({
    name: "buttonActivity",
    initialState: initialButtonActivityCustomerState,
    reducers: {
        setButtonActivity: (state, action) => {
            state.buttonActive = action.payload
        }
    }
})








