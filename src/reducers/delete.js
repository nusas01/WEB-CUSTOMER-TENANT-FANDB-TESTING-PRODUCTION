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


const initialDeleteCategoryInternalState = {
    successDeleteCategory: null,
    errorDeleteCategory: null,
    errorHasProductDeleteCategory: null,
    loadingDeleteCategory: false
}
export const deleteCategoryInternalSlice = createSlice({
    name: 'DeleteCategory',
    initialState: initialDeleteCategoryInternalState,
    reducers: {
        setSuccessDeleteCategoryInternal: (state, action) => {
            state.successDeleteCategory = action.payload
        },
        setErrorDeleteCategoryInternal: (state, action) => {
            state.errorDeleteCategory = action.payload.error
            state.errorHasProductDeleteCategory = action.payload.errorHasProduct
        },
        setLoadingDeleteCategoryInternal: (state, action) => {
            state.loadingDeleteCategory = action.payload
        },
        resetDeleteCategoryInternal: (state) => {
            state.successDeleteCategory = null
            state.errorDeleteCategory = null
            state.errorHasProductDeleteCategory = null
        }
    }
})


const initialDeleteEmployeeState = {
  successDeleteEmployee: false,
  errorDeleteEmployee: null,
  loadingDeleteEmployee: false,
}
export const deleteEmployeeSlice = createSlice({
  name: 'deleteEmployee',
  initialState: initialDeleteEmployeeState,
  reducers: {
    setSuccessDeleteEmployee: (state, action) => {
      state.successDeleteEmployee = action.payload
    },
    setErrorDeleteEmployee: (state, action) => {
      state.errorDeleteEmployee = action.payload || null
    },
    setLoadingDeleteEmployee: (state, action) => {
      state.loadingDeleteEmployee = action.payload
    },
    resetDeleteEmployee: (state) => {
      state.successDeleteEmployee = false
      state.errorDeleteEmployee = null
    },
  },
})