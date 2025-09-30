import { createSlice } from "@reduxjs/toolkit"

const initialUpdateProductInternalState = {
    successUpdateProductInternal: null,
    errorUpdateProductInternal: null,
    errorFieldUpdateProductInternal: null,
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
            state.errorUpdateProductInternal = action.payload.error
            state.errorFieldUpdateProductInternal = action.payload.errorField
            state.successUpdateProductInternal = null
        }, 
        setLoadingUpdateProductInternal: (state, action) => {
            state.loadingUpdateProductInternal = action.payload
        }, 
        resetUpdateProductInternal: (state) => {
            state.successUpdateProductInternal = null
            state.errorFieldUpdateProductInternal = null
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
    loadingVoidGeneraljournal:false,
    successVoidGeneralJournal: null,
    errorVoidGeneralJournal: null,
}
export const voidGeneralJournalInternalSlice = createSlice({
    name: 'voidGeneralJournal',
    initialState: initialVoidGeneralJournalInternalState,
    reducers: {
        setLoadingVoidGeneralJournal: (state, action) => {
            state.loadingVoidGeneraljournal = action.payload
        },
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

const initialUpdatePaymentMethodsInternalState = {
    successUpdatePaymentMethods: null,
    errorUpdatePaymentMethods: null,
    loadingUpdatePaymentMethods: false,
}
export const updatePaymentMethodsInternalSlice = createSlice({
    name: 'updatePaymentMethodsInternal',
    initialState: initialUpdatePaymentMethodsInternalState,
    reducers: {
        setSuccessUpdatePaymentMethodsInternal: (state, action) => {
            state.successUpdatePaymentMethods = action.payload
            state.errorUpdatePaymentMethods = null
        },
        setErrorUpdatePaymentMethodsInteral: (state, action) => {
            state.errorUpdatePaymentMethods = action.payload
            state.successChangePassword = null
        },
        setLoadingUpdatePaymentMethodsInternal: (state, action) => {
            state.loadingUpdatePaymentMethods = action.payload
        },
        resetUpdatePaymentMethodsInternal: (state) => {
            state.successUpdatePaymentMethods = null
            state.errorUpdatePaymentMethods = null
        }
    }
})

const initialUpdateEmployeeState = {
  successUpdateEmployee: null,
  errorUpdateEmployee: null,
  errorFieldUpdateEmployee: null,
  loadingUpdateEmployee: false,
}
export const updateEmployeeSlice = createSlice({
  name: 'updateEmployee',
  initialState: initialUpdateEmployeeState,
  reducers: {
    setSuccessUpdateEmployee: (state, action) => {
      state.successUpdateEmployee = action.payload
    },
    setErrorUpdateEmployee: (state, action) => {
      state.errorUpdateEmployee = action.payload.error || null
      state.errorFieldUpdateEmployee = action.payload.errorField || null
    },
    setLoadingUpdateEmployee: (state, action) => {
      state.loadingUpdateEmployee = action.payload
    },
    resetUpdateEmployee: (state) => {
      state.successUpdateEmployee = null
      state.errorUpdateEmployee = null
      state.errorFieldUpdateEmployee = null
    },
  },
})