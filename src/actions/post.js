import axiosInstance from "./axiosInstance.js";
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
    getJournalDrafByJsonInternalSlice,
    createEmployeeSlice,
    forgotPasswordCustomerSlice,
    forgotPasswordInternalSlice,
 } from "../reducers/post"
import {
    statusExpiredTokenSlice,
    statusExpiredInternalTokenSlice,
    statusExpiredUserTokenSlice,
    statusServiceMaintenanceSlice,
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
import { internalCollectFingerprintAsync, customerCollectFingerprintAsync } from '../helper/fp.js'

const {setStatusExpiredToken} = statusExpiredTokenSlice.actions
const {setStatusExpiredInternalToken} = statusExpiredInternalTokenSlice.actions
const {setStatusExpiredUserToken} = statusExpiredUserTokenSlice.actions
const {setStatusServiceMaintenance} = statusServiceMaintenanceSlice.actions

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
        const nonce_data = await customerCollectFingerprintAsync()

        const formData = {
            ...data,
            nonce_data,
        }

        const response = await axiosInstance.post(`${process.env.REACT_APP_SIGNUP_CUSTOMER_URL}`, formData, config);
        dispatch(signupSuccessCustomer(response?.data.success));
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        const response = {
            error: error.response?.data?.error,
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
        const response = await axiosInstance.post(`${process.env.REACT_APP_SIGNUP_VERIFICATION_CUSTOMER_URL}`, data, config)
        dispatch(signupVerificationSuccessCustomer(response?.data.success));
    } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }
    
        const message = {
            error: error.response?.data?.error,
            errorField: error.response?.data?.ErrorField,
            message: error.response?.data?.message,
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
        const nonce_data = await customerCollectFingerprintAsync();

        const formData = {
            ...data,
            nonce: nonce_data.nonce,
            value: nonce_data.value,
            iv: nonce_data.iv,
        }

        const response = await axiosInstance.post(`${process.env.REACT_APP_LOGIN_CUSTOMER_URL}`, formData, configJson)
        const message = {
            messageLoginSuccess: response?.data?.success,
            statusCodeSuccess: response?.status,
        }
        dispatch(loginSuccessCustomer(message));
        dispatch(setLoginStatusCustomer(true))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }
        
        const message = {
            errorLogin: error.response?.data?.error,
            errPass: error.response?.data?.ErrorFields?.password, 
            errUsername: error.response?.data?.ErrorFields?.email,
        }
        dispatch(loginErrorCustomer(message));
    }finally {
        dispatch(setLoginLoadingCustomer(false));
    }
}

const {setSuccessForgotPasswordCustomer, setErrorForgotPasswordCustomer, setLoadingForgotPasswordCustomer} = forgotPasswordCustomerSlice.actions
export const forgotPasswordCustomer = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingForgotPasswordCustomer(true))
    try {
        const nonce_data = await customerCollectFingerprintAsync();

        const formData = {
            ...data,
            nonce: nonce_data.nonce,
            value: nonce_data.value, 
            iv: nonce_data.iv,
        }

        const response = await axiosInstance.post(`${process.env.REACT_APP_FORGOT_PASSWORD_CUSTOMER_URL}`, formData, config)
        dispatch(setSuccessForgotPasswordCustomer(response?.data?.success))
    } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(setErrorForgotPasswordCustomer({
            error: error?.response?.data?.error,
            errorField: error?.response?.data?.ErrorField,
        }))
    } finally {
        dispatch(setLoadingForgotPasswordCustomer(false))
    }
}

const { successCreateTransactionCustomer, errorCreateTransactionCustomer, setLoadingCreateTransactionCustomer } = createTransactionCustomerSlice.actions;
export const createTransactionCustomer = (data) => async (dispatch) => {
    const state = store.getState().persisted.orderType
    const configJson = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
            ...(state.orderTakeAway === true
            ? {"order_type_take_away": "true"} 
            : {"table_id": state.tableId})
        },
        withCredentials: true,
    }
    dispatch(setLoadingCreateTransactionCustomer(true));
    try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_CREATE_TRANSACTION_CUSTOMER_URL}`, data, configJson)
        dispatch(successCreateTransactionCustomer(response?.data));
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        const message = {
            error: error.response?.data?.error,
            errorPhoneNumber: error.response?.data?.error?.ErrorFields?.phone_number_ewallet,
            errorProductUnavailable: error?.response?.data?.errorProductUnavailable,
            errorAmountPrice: error.response?.data?.errorAmountPrice,
            errorCashNonActive: error.response?.data?.errorCashNonActive,
            errorTable: error.response?.data?.errorTable,
            statusCode: error?.response?.status,
            errorOrderType: error?.response.data?.errorOrderType,
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
        const response = await axiosInstance.post(`${process.env.REACT_APP_LOGIN_SIGNUP_GOOGLE_CUSTOMER}`, {}, {
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

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }
        
        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

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
        const nonce_data = await internalCollectFingerprintAsync()

        const formData = {
            ...data,
            nonce: nonce_data.nonce, 
            value: nonce_data.value,
            iv: nonce_data.iv
        } 

        const response = await axiosInstance.post(`${process.env.REACT_APP_LOGIN_INTERNAL_URL}`, formData, configJson)
        const message = {
            messageLoginSuccess: response?.data,
            statusCodeSuccess: response?.status,
        }

        dispatch(loginSuccessInternal(message))
        dispatch(setLoginStatusInternal(true))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        const message = {
            errorLogin: error.response?.data?.error,
            errPass: error.response?.data?.ErrorFields?.password, 
            errEmail: error.response?.data?.ErrorFields?.email,
        }
        dispatch(loginErrorInternal(message))
    }finally {
        dispatch(setLoginLoadingInternal(false))
    }
}

const {setSuccessForgotPasswordInternal, setErrorForgotPasswordInternal, setLoadingForgotPasswordInternal} = forgotPasswordInternalSlice.actions
export const forgotPasswordInternal = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingForgotPasswordInternal(true))
    try {
        const nonce_data = await customerCollectFingerprintAsync();

        const formData = {
            ...data,
            nonce: nonce_data.nonce,
            value: nonce_data.value, 
            iv: nonce_data.iv,
        }

        const response = await axiosInstance.post(`${process.env.REACT_APP_FORGOT_PASSWORD_INTERNAL_URL}`, formData, config)
        dispatch(setSuccessForgotPasswordInternal(response?.data?.success))
    } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(setErrorForgotPasswordInternal({
            error: error?.response?.data?.error,
            errorField: error?.response?.data?.ErrorField,
        }))
    } finally {
        dispatch(setLoadingForgotPasswordInternal(false))
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
        const response = await axiosInstance.post(`${process.env.REACT_APP_CREATE_TRANSACTION_INTERNAL_URL}`, data, configJson)
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

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        const message = {
            error: error.response?.data?.error,
            errorProductUnavailable: error.response?.data?.errorProductUnavailable,
            errorAmountPrice: error.response?.data?.errorAmountPrice,
            errorCashNonActive: error.response?.data?.errorCashNonActive
        }
        dispatch(errorCreateTransactionInternal(message))
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
        const response = await axiosInstance.post(`${process.env.REACT_APP_INPUT_CATEGORY_INTERNAL_URL}`, data, configJson)
        dispatch(fetchCategoryInternal())
        dispatch(successCreateCategoryInternal(response.data?.success))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        const message = {
            error: error.response?.data?.ErrorField,
            errorField: error.response?.data?.error
        }
        dispatch(errorCreateCategoryInternal(message))
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
        const response = await axiosInstance.post(`${process.env.REACT_APP_INPUT_PRODUCT_INTERNAL_URL}`, data, configJson)
        dispatch(fetchCategoryAndProductInternal())
        dispatch(successCreateProductInternal(response.data?.success))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        const message = {
            errorField: error.response?.data?.ErrorField,
            error: error.response?.data?.error
        }
        dispatch(errorCreateProductInternal(message))
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
        const response = await axiosInstance.post(`${process.env.REACT_APP_DELETE_PRODUCT_INTERNAL_URL}`, data, configJson)
        dispatch(setSuccessDeleteProductInternal(response.data?.success))
        dispatch(deleteProductById(data.id))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(setErrorDeleteProductIntenal(error.response?.data?.error))
    }
}

const {setSuccessGetJournalByJsontInternal, setErrorGetJournalByJsonIntenal, setLoadingGetJournalByJsonInternal} = getJournalDrafByJsonInternalSlice.actions
export const getJournalDrafByJsonInternal = (data) => async (dispatch, getState) => {
    const configJson = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingGetJournalByJsonInternal(true))
    try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_GET_JOURNAL_DRAF_BY_JSON_INTERNAL_URL}`, data, configJson)
        dispatch(setSuccessGetJournalByJsontInternal(response.data))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(setErrorGetJournalByJsonIntenal(error.response?.data?.error))
    } finally {
        dispatch(setLoadingGetJournalByJsonInternal(false))
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
        const response = await axiosInstance.post(`${process.env.REACT_APP_INPUT_GENERAL_JOURNAL_INTERNAL_URL}`, data, configJson)
        dispatch(setSuccessInputGeneralJournalInternal(response.data?.success))
        if (response.status === 200 || response.status === 201) {
            const state = getState();
            const { dataGeneralJournalByEventPerDayInternal } = state.getGeneralJournalByEventPerDayInternal || {};

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

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(setErrorInputGeneralJournalIntenal(error.response?.data?.error))
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
       const response = await axiosInstance.post(`${process.env.REACT_APP_GET_POST_DELETE_TABLE_INTERNAL_URL}`, data, configJson)
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

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(setErrorCreateTableIntenal(error.response?.data?.error))
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
        const response = await axiosInstance.post(`${process.env.REACT_APP_CREATE_QR_ORDER_TYPE_TAKE_AWAY_INTERNAL_URL}`, {}, configJson)
        if (response.data?.alreadyExists) {
            dispatch(setAlrdyCreatedQROrderTypeTakeAway(response.data?.success))
        } else {
            dispatch(updateOrderTypeTakeAway(response.data?.imageQr))
        }
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
            dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
            dispatch(setStatusServiceMaintenance(true));
        }

        dispatch(setErrorCreateQROrderTypeTakeAway(error.response?.data?.error))
    } finally {
        dispatch(setLoadingCreateQROrderTypeTakeAway(false))
    }
}

const {
  setSuccessCreateEmployee,
  setErrorCreateEmployee,
  setLoadingCreateEmployee,
} = createEmployeeSlice.actions
export const createEmployee = (formData) => {
  return async (dispatch) => {
    dispatch(setLoadingCreateEmployee(true))
    try {
      const response = await axiosInstance.post(process.env.REACT_APP_EMPLOYEE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
      })
      dispatch(setSuccessCreateEmployee(true))
      return response.data
    } catch (error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        if (error.response?.data?.code === "TOKEN_INTERNAL_EXPIRED") {
          dispatch(setStatusExpiredInternalToken(true));
        }

        if (error.response?.data?.code === "TOKEN_USER_EXPIRED") {
          dispatch(setStatusExpiredUserToken(true));
        }

        if (error.response?.data?.code === "SERVICE_ON_MAINTENANCE") {
          dispatch(setStatusServiceMaintenance(true));
        }
        
        dispatch(setErrorCreateEmployee({
            error: error?.response?.data?.error, 
            errorField: error?.response?.data?.ErrorField[0],
        }))
    } finally {
      dispatch(setLoadingCreateEmployee(false))
    }
  }
}
