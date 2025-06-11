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