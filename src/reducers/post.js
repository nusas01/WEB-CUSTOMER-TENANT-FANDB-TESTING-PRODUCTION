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
    loading: false,
}
export const createTransactionCustomerSlice = createSlice({
    name: "createTransaction",
    initialState: initialCreateTransactionCustomer,
    reducers: {
        successCreateTransactionCustomer: (state, action) => {
            state.message = action.payload;
            state.statusCode = 200;
            state.error = null
        },
        errorCreateTransactionCustomer: (state, action) => {
            state.error = action.payload.error;
            state.statusCode = action.payload.statusCode;
            state.message = null
        }, 
        setLoadingCreateTransactionCustomer: (state, action) => {
            state.loading = action.payload;
        }, 
        resetCreateTransactionCustomer: (state) => {
            state.message = null
            state.statusCode = null
            state.error = null
        }
    }
})