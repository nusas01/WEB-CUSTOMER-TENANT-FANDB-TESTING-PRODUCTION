import { createSlice } from "@reduxjs/toolkit";

const initialDeleteTableInternalState = {
    successDeleteTable: null,
    errorDeleteTable: null,
    loadingDeleteTable: false 
}

export const deleteTableInternalSlice = createSlice({
    name: 'DeleteTable',
    initialState: initialDeleteTableInternalState,
    reducers: {
        setSuccessDeleteTableInternal: (state, action) => {
            state.successDeleteTable = action.payload
        },
        setErrorDeleteTableInternal: (state, action) => {
            state.errorDeleteTable = action.payload
        },
        setLoadingDeleteTableInternal: (state, action) => {
            state.loadingDeleteTable = action.payload
        },
        resetDeleteTableInternal: (state, action) => {
            state.successDeleteTable = null
            state.errorDeleteTable = null
        }
    }
})