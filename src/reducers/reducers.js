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








