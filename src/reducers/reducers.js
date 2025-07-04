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

const initialFilterGeneralJournalInternalState = {
    startDate: null,
    endDate: null,
    statusFilter: null,
    eventFilter: null, 
    searchTerm: null,
}
export const filterGeneralJournalInternalSlice = createSlice({
    name: "filterGeneralJournal",
    initialState: initialFilterGeneralJournalInternalState,
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload
        },
        setEndDate: (state, action) => {
            state.endDate = action.payload
        },
        setStatusFilter: (state, action) => {
            state.statusFilter = action.payload
        },
        setEventFilter: (state, action) => {
            state.eventFilter = action.payload
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload
        },
        resetFilterGeneralJournal: (state) => {
            state.startDate = null
            state.endDate = null
            state.statusFilter = null
            state.eventFilter = null
            state.searchTerm = null            
        }
    }
})







