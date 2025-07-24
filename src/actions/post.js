import axios from "axios"
 import {
    loginStatusCustomerSlice,
    loginStatusInternalSlice,
    getAllCreateTransactionInternalSlice,
    getCategoryAndProductInternalSlice,
 } from "../reducers/get"
 import {
    signupCustomerSlice, 
    verificationSignupCustomerSlice, 
    loginCustomerSlice,
    loginGoogleCustomerSlice,
    createTransactionCustomerSlice,
    loginInternalSlice,
    createTransactionInternalSlice,
    createCategoryInternalSlice,
    createProductInternalSlice,
    deleteProductInternalSlice,
    inputGeneralJournalInternalSlice,
    createTableInternalSlice,
    createQROrderTypeTakeAwaySlice,
 } from "../reducers/post"
import {
    statusExpiredTokenSlice
 } from "../reducers/expToken.js"
 import {
    fetchCategoryInternal,
    fetchCategoryAndProductInternal,
    fetchGeneralJournalDrafInternal,
    fetchGeneralJournalByEventAllInternal,
    fetchGeneralJournalByEventPerDayInternal,
 } from './get.js'
 import {
    getTablesInternalSlice
 } from '../reducers/get.js'
import store from "../reducers/state"
import { useSelector } from "react-redux"

const {setStatusExpiredToken} = statusExpiredTokenSlice.actions

const { setLoadingSignCustomer, signupSuccessCustomer, signupErrorCustomer, resetSignupCustomer } = signupCustomerSlice.actions;
export const signupCustomer = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY
        },
        withCredentials: true,
    };
    dispatch(setLoadingSignCustomer(true))
    try {
        const response = await axios.post(`${process.env.REACT_APP_SIGNUP_CUSTOMER_URL}`, data, config);
        dispatch(signupSuccessCustomer(response?.data.success));
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        const response = {
            error: error,
            errorObject: error.response?.data,
        }
        dispatch(signupErrorCustomer(response));
    } finally {
        dispatch(setLoadingSignCustomer(false))
    }
};


const { signupVerificationSuccessCustomer, signupVerificationFailsCustomer, setLoadingSignupVerificationCustomer } = verificationSignupCustomerSlice.actions;
export const verificationSignupCustomer = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials : true,
    };
    dispatch(setLoadingSignupVerificationCustomer(true));
    try {
        const response = await axios.post(`${process.env.REACT_APP_SIGNUP_VERIFICATION_CUSTOMER_URL}`, data, config)
        dispatch(signupVerificationSuccessCustomer(response?.data.success));
    } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        console.log(error)
        const message = {
            error: error.response?.data.error,
            errorField: error.response?.data.ErrorField,
            message: error.response?.data.message,
        };
        dispatch(signupVerificationFailsCustomer(message));
    } finally {
        dispatch(setLoadingSignupVerificationCustomer(false));
    }
}


const { loginSuccessCustomer, loginErrorCustomer, setLoginLoadingCustomer } =  loginCustomerSlice.actions
const { setLoginStatusCustomer } = loginStatusCustomerSlice.actions
export const loginCustomer = (data) => async (dispatch) => {
    const configJson = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoginLoadingCustomer(true));
    try {
        const response = await axios.post(`${process.env.REACT_APP_LOGIN_CUSTOMER_URL}`, data, configJson)
        const message = {
            messageLoginSuccess: response?.data,
            statusCodeSuccess: response?.status,
        }
        dispatch(loginSuccessCustomer(message));
        dispatch(setLoginStatusCustomer(true))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        console.log(error)
        console.log("Error Detail ErrorFields password:", error.response?.data.ErrorFields.password);
        const message = {
            errorLogin: error.response?.data.error,
            errPass: error.response?.data.ErrorFields.password, 
            errUsername: error.response?.data.ErrorFields.email,
        }
        console.log(message)
        dispatch(loginErrorCustomer(message));
        console.log("Dispatched loginErrorCustomer"); 
    }finally {
        dispatch(setLoginLoadingCustomer(false));
    }
}

const { successCreateTransactionCustomer, errorCreateTransactionCustomer, setLoadingCreateTransactionCustomer } = createTransactionCustomerSlice.actions;
export const createTransactionCustomer = (data) => async (dispatch) => {
    const state = store.getState().persisted.orderType
    const configJson = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
            ...(state.orderTakeAway === "true"
            ? {"order_type_take_away": true} 
            : {"table_id": state.tableId})
        },
        withCredentials: true,
    }
    dispatch(setLoadingCreateTransactionCustomer(true));
    try {
        const response = await axios.post(`${process.env.REACT_APP_CREATE_TRANSACTION_CUSTOMER_URL}`, data, configJson)
        dispatch(successCreateTransactionCustomer(response?.data));
        console.log("response data create transacrion: ", response?.data)
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        console.log(error)
        const message = {
            error: error.response?.data?.error,
            errorProductUnavailable: error?.response?.data?.errorProductUnavailable,
            errorAmountPrice: error.response?.data?.errorAmountPrice,
            errorCashNonActive: error.response?.data?.errorCashNonActive,
            statusCode: error?.response?.status,
        }
        dispatch(errorCreateTransactionCustomer(message))
    }finally {
        dispatch(setLoadingCreateTransactionCustomer(false));
    }
}


const {loginGoogleErrorCustomer, setLoadingLoginGoogleCustomer} = loginGoogleCustomerSlice.actions
export const loginGoogleCustomer = () => async (dispatch) => {
    dispatch(setLoadingLoginGoogleCustomer(true))
    try {
        const response = await axios.post(`${process.env.REACT_APP_LOGIN_SIGNUP_GOOGLE_CUSTOMER}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "API_KEY": process.env.REACT_APP_API_KEY,
            },
            withCredentials: true,
        })
        window.location.href = response?.data
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        console.log(error)
        dispatch(loginGoogleErrorCustomer(error.response.data.error))
    } finally {
        dispatch(setLoadingLoginGoogleCustomer(false))
    }
}


const { loginSuccessInternal, loginErrorInternal, setLoginLoadingInternal } =  loginInternalSlice.actions
const { setLoginStatusInternal } = loginStatusInternalSlice.actions
export const loginInternal = (data) => async (dispatch) => {
    const configJson = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoginLoadingInternal(true))
    try {
        const response = await axios.post(`${process.env.REACT_APP_LOGIN_INTERNAL_URL}`, data, configJson)
        const message = {
            messageLoginSuccess: response?.data,
            statusCodeSuccess: response?.status,
        }
        console.log(response)
        dispatch(loginSuccessInternal(message))
        dispatch(setLoginStatusInternal(true))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        const message = {
            errorLogin: error.response?.data.error,
            errPass: error.response?.data.ErrorFields.password, 
            errEmail: error.response?.data.ErrorFields.email,
        }
        console.log(message)
        dispatch(loginErrorInternal(message))
    }finally {
        dispatch(setLoginLoadingInternal(false))
    }
}

const { addGetAllCreateTransactionInternal } = getAllCreateTransactionInternalSlice.actions
const { successCreateTransactionInternal, errorCreateTransactionInternal, setLoadingCreateTransactionInternal } = createTransactionInternalSlice.actions
export const createTransactionInternal = (data) => async (dispatch) => {
    const configJson = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingCreateTransactionInternal(true))
    try {
        const response = await axios.post(`${process.env.REACT_APP_CREATE_TRANSACTION_INTERNAL_URL}`, data, configJson)
        console.log("response data create transacrion internal: ", response)
        const message = {
            data: response.data?.data,
            success: response.data?.success,
        }
        dispatch(successCreateTransactionInternal(message))
        if (message.data.channel_code !== 'CASH') {
            dispatch(addGetAllCreateTransactionInternal(message.data))
        }
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        const message = {
            error: error.response?.data?.error,
            errorProductUnavailable: error.response?.data?.errorProductUnavailable,
            errorAmountPrice: error.response?.data?.errorAmountPrice,
            errorCashNonActive: error.response?.data?.errorCashNonActive
        }
        dispatch(errorCreateTransactionInternal(message))
        console.log("response data create transacrion internal: ", error)
    }finally {
        dispatch(setLoadingCreateTransactionInternal(false))
    }
}

const { successCreateCategoryInternal, errorCreateCategoryInternal, setLoadingCreateCategoryInternal } = createCategoryInternalSlice.actions
export const createCategoryInternal = (data) => async (dispatch) => {
    const configJson = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingCreateCategoryInternal(true))
    try {
        const response = await axios.post(`${process.env.REACT_APP_INPUT_CATEGORY_INTERNAL_URL}`, data, configJson)
        console.log("response data create transacrion internal: ", response)
        dispatch(fetchCategoryInternal())
        dispatch(successCreateCategoryInternal(response.data?.success))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        const message = {
            error: error.response?.data?.ErrorField,
            errorField: error.response?.data?.error
        }
        dispatch(errorCreateCategoryInternal(message))
        console.log("response data create transacrion internal: ", error)
    }finally {
        dispatch(setLoadingCreateCategoryInternal(false))
    }
}


const { successCreateProductInternal, errorCreateProductInternal, setLoadingCreateProductInternal } = createProductInternalSlice.actions
export const createProductInternal = (data) => async (dispatch) => {
    const configJson = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingCreateProductInternal(true))
    try {
        const response = await axios.post(`${process.env.REACT_APP_INPUT_PRODUCT_INTERNAL_URL}`, data, configJson)
        console.log("response data create transacrion internal: ", response)
        dispatch(fetchCategoryAndProductInternal())
        dispatch(successCreateProductInternal(response.data?.success))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        const message = {
            errorField: error.response?.data?.ErrorField,
            error: error.response?.data?.error
        }
        dispatch(errorCreateProductInternal(message))
        console.log("response data create product internal: ", error)
    }finally {
        dispatch(setLoadingCreateProductInternal(false))
    }
}


const {deleteProductById} = getCategoryAndProductInternalSlice.actions
const {setSuccessDeleteProductInternal, setErrorDeleteProductIntenal} = deleteProductInternalSlice.actions
export const DeleteProductInternal = (data) => async (dispatch) => {
    const configJson = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    try {
        const response = await axios.post(`${process.env.REACT_APP_DELETE_PRODUCT_INTERNAL_URL}`, data, configJson)
        console.log("response data create transacrion internal: ", response)
        dispatch(setSuccessDeleteProductInternal(response.data?.success))
        dispatch(deleteProductById(data.id))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        dispatch(setErrorDeleteProductIntenal(error.response?.data?.error))
        console.log("response data create transacrion internal: ", error)
    }
}

const {setSuccessInputGeneralJournalInternal, setErrorInputGeneralJournalIntenal, setLoadingInputGeneralJournalInternal} = inputGeneralJournalInternalSlice.actions 
export const inputGeneralJournalInternal = (data) => async (dispatch, getState) => {
    const configJson = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingInputGeneralJournalInternal(true))
    try {
        const response = await axios.post(`${process.env.REACT_APP_INPUT_GENERAL_JOURNAL_INTERNAL_URL}`, data, configJson)
        console.log("response data create transacrion internal: ", response)
        dispatch(setSuccessInputGeneralJournalInternal(response.data?.success))
        if (response.status === 200 || response.status === 201) {
            const state = getState();
            const { dataGeneralJournalByEventPerDayInternal } = state.getGeneralJournalByEventPerDayInternal || {};

            console.log("data input general journal wkwwkwk: ", data)

            if (data.detail.action === "DRAF") {
                dispatch(fetchGeneralJournalDrafInternal());
            }

            if (data.detail.action === "FINALIZE") {
                dispatch(fetchGeneralJournalByEventAllInternal());

                if (Array.isArray(dataGeneralJournalByEventPerDayInternal) && dataGeneralJournalByEventPerDayInternal.length > 0) {
                dispatch(fetchGeneralJournalByEventPerDayInternal());
                }
            }
        }
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        dispatch(setErrorInputGeneralJournalIntenal(error.response?.data?.error))
        console.log("response data create transacrion internal: ", error)
    } finally {
        dispatch(setLoadingInputGeneralJournalInternal(false))
    }
}

const { addTableInternal, updateOrderTypeTakeAway } = getTablesInternalSlice.actions
const { setSuccessCreateTableInternal, setErrorCreateTableIntenal, setLoadingCreateTableInternal } = createTableInternalSlice.actions
export const createTabelInternal = (data) => async (dispatch) => {
    const configJson = {
        headers: {
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingCreateTableInternal(true))
    try {
       const response = await axios.post(`${process.env.REACT_APP_GET_POST_DELETE_TABLE_INTERNAL_URL}`, data, configJson)
        console.log("response data create transacrion internal: ", response)
        if (response.status === 200) {
            dispatch(setSuccessCreateTableInternal(response.data?.success))
            const data = {
                number_table: response.data?.number,
                image: response.data?.imageQr 
            }
            dispatch(addTableInternal(data))
        }
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        dispatch(setErrorCreateTableIntenal(error.response?.data?.error))
        console.log("response data create transacrion internal: ", error)
    } finally {
        dispatch(setLoadingCreateTableInternal(false))
    }
}

const {setAlrdyCreatedQROrderTypeTakeAway, setErrorCreateQROrderTypeTakeAway, setLoadingCreateQROrderTypeTakeAway} = createQROrderTypeTakeAwaySlice.actions
export const createQROrderTypeTakeAway = () => async (dispatch) => {
    const configJson = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingCreateQROrderTypeTakeAway(true))
    try {
        const response = await axios.post(`${process.env.REACT_APP_CREATE_QR_ORDER_TYPE_TAKE_AWAY_INTERNAL_URL}`, {}, configJson)
        console.log("response data create QR order type take away: ", response)
        if (response.data?.alreadyExists) {
            dispatch(setAlrdyCreatedQROrderTypeTakeAway(response.data?.success))
        } else {
            dispatch(updateOrderTypeTakeAway(response.data?.imageQr))
        }
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        console.log(error)
        dispatch(setErrorCreateQROrderTypeTakeAway(error.response?.data?.error))
    } finally {
        dispatch(setLoadingCreateQROrderTypeTakeAway(false))
    }
}
