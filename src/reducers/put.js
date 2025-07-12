import { createSlice } from "@reduxjs/toolkit"

const initialUpdateProductInternalState = {
    successUpdateProductInternal: null,
    errorUpdateProductInternal: null,
    loadingUpdateProductInternal: false,
}
export const updateInternalSlice = createSlice({
    name: "updateProductInternal",
    initialState: initialUpdateProductInternalState,
    reducers: {
        successUpdateProductInternal: (state, action) => {
            state.successUpdateProductInternal = action.payload
            state.errorUpdateProductInternal = null
        },
        errorUpdateProductInternal: (state, action) => {
            state.errorUpdateProductInternal = action.payload
            state.successUpdateProductInternal = null
        }, 
        setLoadingUpdateProductInternal: (state, action) => {
            state.loadingUpdateProductInternal = action.payload
        }, 
        resetUpdateProductInternal: (state) => {
            state.successUpdateProductInternal = null
            state.errorUpdateProductInternal = null
        }
    }
})


const initialUpdateGeneralJournalInternalState = {
    successUpdateGeneralJournalInternal: null,
    errorUpdateGeneralJournalInternal: null,
    loadingUpdateGeneralJournalInternal: false,
}
export const updateGeneralJournalInternalSlice = createSlice({
    name: "updateGeneralJournalInternal",
    initialState: initialUpdateGeneralJournalInternalState,
    reducers: {
        successUpdateGeneralJournalInternal: (state, action) => {
            state.successUpdateGeneralJournalInternal = action.payload
            state.errorUpdateGeneralJournalInternal = null
        },
        errorUpdateGeneralJournalInternal: (state, action) => {
            state.errorUpdateGeneralJournalInternal = action.payload
            state.successUpdateGeneralJournalInternal = null
        }, 
        setLoadingUpdateGeneralJournalInternal: (state, action) => {
            state.loadingUpdateGeneralJournalInternal = action.payload
        }, 
        resetUpdateGeneralJournalInternal: (state) => {
            state.successUpdateGeneralJournalInternal = null
            state.errorUpdateGeneralJournalInternal = null
        }
    }
})

const initialVoidGeneralJournalInternalState = {
    successVoidGeneralJournal: null,
    errorVoidGeneralJournal: null,
}
export const voidGeneralJournalInternalSlice = createSlice({
    name: 'voidGeneralJournal',
    initialState: initialVoidGeneralJournalInternalState,
    reducers: {
        setSuccessVoidGeneralJournal: (state, action) => {
            state.successVoidGeneralJournal = action.payload
            state.errorVoidGeneralJournal = null
        },
        setErrorVoidGeneralJournal: (state, action) => {
            state.errorVoidGeneralJournal = action.payload
            state.successVoidGeneralJournal = null
        },
        resetVoidGeneralJournal: (state) => {
            state.successVoidGeneralJournal = null
            state.errorVoidGeneralJournal = null
        }
    }
})