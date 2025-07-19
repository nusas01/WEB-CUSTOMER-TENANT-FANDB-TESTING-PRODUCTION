import { createSlice } from "@reduxjs/toolkit";


const initialSignupCustomerState = {
    successSign: null, 
    error: null,
    errorObject: null,
    loadingSign: false,
}
export const signupCustomerSlice = createSlice({
    name: 'signup',
    initialState: initialSignupCustomerState,
    reducers: {
        setLoadingSignCustomer: (state, action) => {
            state.loadingSign = action.payload;
        },
        signupSuccessCustomer: (state, action) => {
            state.successSign = action.payload;
            state.error = null;
            state.errorObject = null;
        },
        signupErrorCustomer: (state, action) => {
            state.error = action.payload.error;
            state.errorObject = action.payload.errorObject;
            state.successSign = null;
        },
        resetSignupCustomer: (state) => {
            state.successSign = null;
            state.error = null;
            state.errorObject = null;
        }
    }
})


const initialVerificationSignupCustomer = {
    succes: null,
    error: null,
    message: null,
    ErrorField: null,
    loading: false,
}
export const verificationSignupCustomerSlice = createSlice({
    name: 'signupVerification',
    initialState: initialVerificationSignupCustomer,
    reducers: {
        signupVerificationSuccessCustomer: (state, action) => {
            state.succes = action.payload
            state.error = null
            state.ErrorField = null
            state.message = null
        },
        signupVerificationFailsCustomer: (state, action) => {
            state.succes = null
            state.ErrorField = action.payload.errorField
            state.error = action.payload.error
            state.message = action.payload.message
        },
        setLoadingSignupVerificationCustomer: (state, action) => {
            state.loading = action.payload
        },
        resetSignupVerificationCustomer: (state, action) => {
            state.succes = null
            state.error = null
            state.message = null
            state.ErrorField = null
        }
    }
})


const initialLoginCustomerState = {
    messageLoginSuccess: null,
    loadingLogin: false,
    statusCodeSuccess: null,
    errorLogin: null, 
    errPass: null,
    errUsername: null,
}
export const loginCustomerSlice = createSlice({
    name: 'login',
    initialState: initialLoginCustomerState,
    reducers: {
        loginSuccessCustomer: (state, action) => {
            state.messageLoginSuccess = action.payload.messageLoginSuccess;
            state.statusCodeSuccess = action.payload.statusCodeSuccess;
            state.loadingLogin = false;
            state.errorLogin = null;
            state.errPass = null;
            state.errUsername = null;
        },
        loginErrorCustomer: (state, action) => {
            state.errorLogin = action.payload.errorLogin;
            state.errPass = action.payload.errPass;
            state.errUsername = action.payload.errUsername;
            state.statusCodeSuccess = null;
            state.loadingLogin = false;
        },
        setLoginLoadingCustomer: (state, action) => {
            state.loadingLogin = action.payload;
        },
        setLoginStateNullCustomer: (state, action) => {
            state.messageLoginSuccess = null;
            state.loadingLogin = false;
            state.statusCodeSuccess = null;
            state.errorLogin = null;
            state.errPass = null;
            state.errUsername = null;
        }
    }
})


const initialLoginGoogleCustomerState = {
    errorLoginGoogleCustomer: null,
    loadingLoginGoogleCustomer: false,
}
export const loginGoogleCustomerSlice = createSlice({
    name: 'loginGoogleCustomer',
    initialState: initialLoginGoogleCustomerState,
    reducers: {
        loginGoogleErrorCustomer: (state, action) => {
            state.errorLoginGoogleCustomer = action.payload
        },
        setLoadingLoginGoogleCustomer: (state, action) => {
            state.loadingLoginGoogleCustomer = action.payload
        },
        resetLoginGoogleCustomer: (state) => {
            state.errorLoginGoogleCustomer = null
        }
    }
})


const initialCreateTransactionCustomer = {
    message: null,
    statusCode: null,
    error: null,
    errorProductUnavailable: null,
    errorAmountPrice: null,
    errorCashNonActive: null,
    loading: false,
}
export const createTransactionCustomerSlice = createSlice({
    name: "createTransaction",
    initialState: initialCreateTransactionCustomer,
    reducers: {
        successCreateTransactionCustomer: (state, action) => {
            state.message = action.payload
            state.statusCode = 200
        },
        errorCreateTransactionCustomer: (state, action) => {
            state.error = action.payload.error
            state.errorProductUnavailable = action.payload.errorProductUnavailable
            state.errorAmountPrice = action.payload.errorAmountPrice
            state.statusCode = action.payload.statusCode
            state.errorCashNonActive = action.payload.errorCashNonActive
        }, 
        setLoadingCreateTransactionCustomer: (state, action) => {
            state.loading = action.payload;
        }, 
        resetCreateTransactionCustomer: (state) => {
            state.message = null
            state.errorProductUnavailable = null
            state.errorAmountPrice = null
            state.statusCode = null
            state.error = null
            state.errorCashNonActive = null
        }
    }
})


const initialLoginInternalState = {
    messageLoginSuccessInternal: null,
    loadingLoginInternal: false,
    statusCodeSuccessInternal: null,
    errorLoginInternal: null, 
    errPassInternal: null,
    errEmailInternal: null,
}
export const loginInternalSlice = createSlice({
    name: 'loginInternal',
    initialState: initialLoginInternalState,
    reducers: {
        loginSuccessInternal: (state, action) => {
            state.messageLoginSuccessInternal = action.payload.messageLoginSuccess;
            state.statusCodeSuccessInternal = action.payload.statusCodeSuccess;
            state.errorLoginInternal = null;
            state.errPassInternal = null;
            state.errEmailInternal = null;
        },
        loginErrorInternal: (state, action) => {
            state.errorLoginInternal = action.payload.errorLogin;
            state.errPassInternal = action.payload.errPass;
            state.errEmailInternal = action.payload.errEmail;
            state.statusCodeSuccessInternal = null;
        },
        setLoginLoadingInternal: (state, action) => {
            state.loadingLoginInternal = action.payload;
        },
        setLoginStateNullInternal: (state, action) => {
            state.messageLoginSuccessInternal = null;
            state.statusCodeSuccessInternal = null;
            state.errorLoginInternal = null;
            state.errPassInternal = null;
            state.errEmailInternal = null;
        }
    }
})

const initialCreateTransactionInternalState = {
    successCreateTransactionInternal: null,
    dataSuccessCreateTransactionInternal: null,
    errorCreateTransactionInternal: null,
    errorProductUnavailable: null,
    errorInvalidAmountPrice: null,
    errorCashNonActive: null,
    loadingCreateTransactionInternal: false,
}
export const createTransactionInternalSlice = createSlice({
    name: "createTransactionInternal",
    initialState: initialCreateTransactionInternalState,
    reducers: {
        successCreateTransactionInternal: (state, action) => {
            state.dataSuccessCreateTransactionInternal = action.payload.data
            state.successCreateTransactionInternal = action.payload.success
            state.errorCreateTransactionInternal = null
            state.errorProductUnavailable = null
            state.errorInvalidAmountPrice = null
        },
        errorCreateTransactionInternal: (state, action) => {
            state.errorCreateTransactionInternal = action.payload.error 
            state.errorProductUnavailable = action.payload.errorProductUnavailable
            state.errorInvalidAmountPrice = action.payload.errorAmountPrice
            state.errorCashNonActive = action.payload.errorCashNonActive
            state.dataSuccessCreateTransactionInternal = null
            state.successCreateTransactionInternal = null
        }, 
        setLoadingCreateTransactionInternal: (state, action) => {
            state.loadingCreateTransactionInternal = action.payload
        }, 
        resetCreateTransactionInternal: (state) => {
            state.errorProductUnavailable = null
            state.dataSuccessCreateTransactionInternal = null
            state.successCreateTransactionInternal = null
            state.errorCreateTransactionInternal = null
            state.errorInvalidAmountPrice = null
            state.errorCashNonActive = null
        }
    }
})


const initialCreateCategoryInternalState = {
    successCreateCategoryInternal: null,
    errorCreateCategoryInternal: null,
    errorFieldCreateCategoryInternal: null,
    loadingCreateCategoryInternal: false,
}
export const createCategoryInternalSlice = createSlice({
    name: "createCategoryInternal",
    initialState: initialCreateCategoryInternalState,
    reducers: {
        successCreateCategoryInternal: (state, action) => {
            state.successCreateCategoryInternal = action.payload
            state.errorFieldCreateCategoryInternal = null
            state.errorCreateCategoryInternal = null
        },
        errorCreateCategoryInternal: (state, action) => {
            state.errorCreateCategoryInternal = action.payload.error
            state.errorFieldCreateCategoryInternal = action.payload.errorField
            state.successCreateCategoryInternal = null
        }, 
        setLoadingCreateCategoryInternal: (state, action) => {
            state.loadingCreateCategoryInternal = action.payload
        }, 
        resetCreateCategoryInternal: (state) => {
            state.successCreateCategoryInternal = null
            state.errorCreateCategoryInternal = null
            state.errorFieldCreateCategoryInternal = null
        }
    }
})


const initialCreateProductInternalState = {
    successCreateProductInternal: null,
    errorCreateProductInternal: null,
    errorFieldCreateProductInternal: null,
    loadingCreateProductInternal: false,
}
export const createProductInternalSlice = createSlice({
    name: "createProductInternal",
    initialState: initialCreateProductInternalState,
    reducers: {
        successCreateProductInternal: (state, action) => {
            state.successCreateProductInternal = action.payload
            state.errorFieldCreateProductInternal = null
            state.errorCreateProductInternal = null
        },
        errorCreateProductInternal: (state, action) => {
            state.errorCreateProductInternal = action.payload.error
            state.errorFieldCreateProductInternal = action.payload.errorField
            state.successCreateProductInternal = null
        }, 
        setLoadingCreateProductInternal: (state, action) => {
            state.loadingCreateProductInternal = action.payload
        }, 
        resetCreateProductInternal: (state) => {
            state.successCreateProductInternal = null
            state.errorCreateProductInternal = null
            state.errorFieldCreateProductInternal = null
        }
    }
})


const initialDeleteProductInternalState = {
    successDeleteProductInternal: null,
    errorDeleteProductInternal: null,
}
export const deleteProductInternalSlice = createSlice({
    name: "deleteProductInternal",
    initialState: initialDeleteProductInternalState,
    reducers: {
        setSuccessDeleteProductInternal: (state, action) => {
            state.successDeleteProductInternal = action.payload
            state.errorDeleteProductInternal = null
        },
        setErrorDeleteProductIntenal: (state, action) => {
            state.errorDeleteProductInternal = action.payload
            state.successDeleteProductInternal = null
        },
        resetDeleteProductInternal: (state) => {
            state.successDeleteProductInternal = null
            state.errorDeleteProductInternal = null
        }       
    }
})


const initialInputGeneralJournalInternalState = {
    successInputGeneralJournal: null,
    errorInputGeneralJournal: null,
    loadingInputGeneralJournal: null,
}
export const inputGeneralJournalInternalSlice = createSlice({
    name: "inputGeneralJournalInternal",
    initialState: initialInputGeneralJournalInternalState,
    reducers: {
        setSuccessInputGeneralJournalInternal: (state, action) => {
            state.successInputGeneralJournal = action.payload
            state.errorInputGeneralJournal = null
        },
        setErrorInputGeneralJournalIntenal: (state, action) => {
            state.errorInputGeneralJournal = action.payload
            state.successInputGeneralJournal = null
        },
        setLoadingInputGeneralJournalInternal: (state, action) => {
            state.loadingInputGeneralJournal = action.payload
        },      
        resetInputGeneralJournalInternal: (state) => {
            state.errorInputGeneralJournal = null
            state.successInputGeneralJournal = null
        },
    }
})

const initialCreateTableInternalState = {
    successCreateTable: null,
    errorCreateTable: null,
    loadingCreateTable: null,
}
export const createTableInternalSlice = createSlice({
    name: "createTableInternal",
    initialState: initialCreateTableInternalState,
    reducers: {
        setSuccessCreateTableInternal: (state, action) => {
            state.successCreateTable = action.payload.success
            state.errorCreateTable = null
        },
        setErrorCreateTableIntenal: (state, action) => {
            state.errorCreateTable = action.payload
            state.successCreateTable = null
        },
        setLoadingCreateTableInternal: (state, action) => {
            state.loadingCreateTable = action.payload
        },      
        resetCreateTableInternal: (state) => {
            state.errorCreateTable = null
            state.successCreateTable = null
        },
    }
})