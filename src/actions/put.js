import { useDispatch } from "react-redux"
import { 
    updateInternalSlice,
    updateGeneralJournalInternalSlice,
    voidGeneralJournalInternalSlice,
    updatePaymentMethodsInternalSlice,
 } from '../reducers/put'
 import {
    getGeneralJournalDrafInternalSlice
 } from "../reducers/get"
 import {
    fetchGeneralJournalVoidInternal,
    fetchGeneralJournalByEventAllInternal,
    fetchGeneralJournalByEventPerDayInternal,
    fetchGeneralJournalDrafInternal,
 } from "./get.js"
import axios from "axios"
import {
statusExpiredTokenSlice
} from "../reducers/expToken.js"
import { useSelector } from "react-redux"


const {setStatusExpiredToken} = statusExpiredTokenSlice.actions


const { successUpdateProductInternal, errorUpdateProductInternal, setLoadingUpdateProductInternal } = updateInternalSlice.actions
export const UpdateProductInternal = (data) => async (dispatch) => {
    const configJson = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingUpdateProductInternal(true))
    try {
        const response = await axios.put(`${process.env.REACT_APP_INPUT_PRODUCT_INTERNAL_URL}`, data, configJson)
        console.log("response data create transacrion internal: ", response)
      
        dispatch(successUpdateProductInternal(response.data?.success))
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        dispatch(errorUpdateProductInternal(error.response?.data?.error))
        console.log("response data create transacrion internal: ", error)
    }finally {
        dispatch(setLoadingUpdateProductInternal(false))
    }
}

const { removeGeneralJournalDrafInternalByAccountId } = getGeneralJournalDrafInternalSlice.actions
const { successUpdateGeneralJournalInternal, errorUpdateGeneralJournalInternal, setLoadingUpdateGeneralJournalInternal } = updateGeneralJournalInternalSlice.actions
export const UpdateGeneralJournalInternal = (data) => async (dispatch, getState) => {
    const configJson = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }

    dispatch(setLoadingUpdateGeneralJournalInternal(true))
    try {
        const response = await axios.put(`${process.env.REACT_APP_PUT_GENERAL_JOURNAL_UPDATE_AND_VOID_INTERNAL_URL}`, data, configJson)
        console.log("response data create transacrion internal: ", response)
        
        dispatch(successUpdateGeneralJournalInternal(response.data?.success))
        
        if (response.status === 200 || response.status === 201) {
            // const { dataGeneralJournalByEventPerDayInternal } = getState().getGeneralJournalByEventPerDayInternal

            if (data.detail.action === "VOID") {
                dispatch(fetchGeneralJournalVoidInternal())
                dispatch(removeGeneralJournalDrafInternalByAccountId(data))
            }

            if (data.detail.action === "FINALIZE") {
                dispatch(fetchGeneralJournalByEventAllInternal())

                // if (dataGeneralJournalByEventPerDayInternal || dataGeneralJournalByEventPerDayInternal.length > 0) {
                    dispatch(fetchGeneralJournalByEventPerDayInternal())
                // }
                
                dispatch(removeGeneralJournalDrafInternalByAccountId(data))
            }

            if (data.detail.action === "DRAF") {
                dispatch(fetchGeneralJournalDrafInternal())

                dispatch(removeGeneralJournalDrafInternalByAccountId(data))
            }
        }
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        dispatch(errorUpdateGeneralJournalInternal(error.response?.data?.error))
        console.log("response data create transacrion internal: ", error)
    }finally {
        dispatch(setLoadingUpdateGeneralJournalInternal(false))
    }
}


const {setSuccessVoidGeneralJournal, setErrorVoidGeneralJournal, setLoadingVoidGeneralJournal} = voidGeneralJournalInternalSlice.actions
export const voidGeneralJournalInternal  = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    console.log("data draf to void: ", data)
    dispatch(setLoadingVoidGeneralJournal(true))
    try {
        const response = await axios.put(`${process.env.REACT_APP_PUT_GENERAL_JOURNAL_UPDATE_AND_VOID_INTERNAL_URL}`, data, config)
        dispatch(setSuccessVoidGeneralJournal(response.data?.success))
        dispatch(removeGeneralJournalDrafInternalByAccountId(data))
        console.log("response buy transaction cash vnfoifbuofbvoufb: ", response)
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        console.log("response buy transaction cash vnfoifbuofbvoufb: ", error.response.data)
        dispatch(setErrorVoidGeneralJournal(error.response?.data?.error));
    } finally {
        dispatch(setLoadingVoidGeneralJournal(false))
    }
}

const {setSuccessUpdatePaymentMethodsInternal, setErrorUpdatePaymentMethodsInteral, setLoadingUpdatePaymentMethodsInternal} = updatePaymentMethodsInternalSlice.actions
export const updatePaymentMethodsInternal = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingUpdatePaymentMethodsInternal(true))
    try {
        console.log("data update employee hehehe: ", data);
        const response = await axios.put(`${process.env.REACT_APP_GET_PUT_PAYMENT_METHODS_INTERNAL_URL}`, data, config)
        dispatch(setSuccessUpdatePaymentMethodsInternal(response.data?.success))
        console.log("response buy transaction cash vnfoifbuofbvoufb: ", response)
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }
        console.log("response buy transaction cash vnfoifbuofbvoufb: ", error.response.data)
        dispatch(setErrorUpdatePaymentMethodsInteral(error.response.data.error));
    } finally {
        dispatch(setLoadingUpdatePaymentMethodsInternal(false))
    }
}