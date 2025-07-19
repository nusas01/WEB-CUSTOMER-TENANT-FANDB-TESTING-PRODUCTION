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


const today = new Date();
const lastMonth = new Date();
lastMonth.setMonth(today.getMonth() - 1);

// Format ke yyyy-mm-dd
const formatDate = (date) => date.toISOString().split("T")[0];

const initialFilterDateLabaRugiInternalState = {
    startDate: formatDate(lastMonth), // 1 bulan ke belakang
    endDate: formatDate(today),       // hari ini
};
export const filterDateLabaRugiInternalSlice = createSlice({
    name: "filterDateLabaRugi",
    initialState: initialFilterDateLabaRugiInternalState,
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload
        }, 
        setEndDate: (state, action) => {
            state.endDate = action.payload
        }
    }
})


const initialFilterDateNeracaInternalState = {
    startDate: formatDate(lastMonth), // 1 bulan ke belakang
    endDate: formatDate(today),       // hari ini
};
export const filterDateNeracaInternalSlice = createSlice({
    name: "filterDateNeraca",
    initialState: initialFilterDateNeracaInternalState,
    reducers: {
        setStartDate: (state, action) => {
            state.startDate = action.payload
        }, 
        setEndDate: (state, action) => {
            state.endDate = action.payload
        }
    }
})


const initialDataDrafToVoidInternalState = {
    dataDrafToVoid: {},
};
export const dataDrafToVoidInternalSlice = createSlice({
    name: "dataDrafToVoid",
    initialState: initialDataDrafToVoidInternalState,
    reducers: {
        setDataDrafToVoid: (state, action) => {
            state.dataDrafToVoid = action.payload
        }, 
        resetDataDrafToVoid: (state) => {
            state.dataDrafToVoid = {}
        }
    }
})


const initialFilterOrderInternalState = {
    startDate: null,
    endDate: null,
    statusFilter: 'PROCESS',
}
export const filterOrderInternalSlice = createSlice({
    name: "filterOrderInternal",
    initialState: initialFilterOrderInternalState,
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
        resetFilterGeneralJournal: (state) => {
            state.startDate = null
            state.endDate = null
            state.statusFilter = 'PROCESS'       
        }
    }
})







