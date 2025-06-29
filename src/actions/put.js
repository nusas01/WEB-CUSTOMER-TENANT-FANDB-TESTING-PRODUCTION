import { useDispatch } from "react-redux"
import { 
    updateInternalSlice,
    updateGeneralJournalInternalSlice,
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

const { removeGeneralJournalDrafInternalByDataObject } = getGeneralJournalDrafInternalSlice.actions
const { successUpdateGeneralJournalInternal, errorUpdateGeneralJournalInternal, setLoadingUpdateGeneralJournalInternal } = updateGeneralJournalInternalSlice.actions
export const UpdateGeneralJournalInternal = (data) => async (dispatch) => {
    const configJson = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingUpdateGeneralJournalInternal(true))
    try {
        const response = await axios.put(`${process.env.REACT_APP_PUT_GENERAL_JOURNAL_UPDATE_INTERNAL_URL}`, data, configJson)
        console.log("response data create transacrion internal: ", response)
        
        dispatch(successUpdateGeneralJournalInternal(response.data?.success))
        
        if (response.status === 200) {
            const { dataGeneralJournalByEventPerDayInternal } = useSelector((state) => state.getGeneralJournalByEventPerDayInternal)
            
            if (data.action === "VOID") {
                dispatch(fetchGeneralJournalVoidInternal())
                dispatch(removeGeneralJournalDrafInternalByDataObject(data.detail.data_general_journal))
            }

            if (data.action === "FINALIZE") {
                dispatch(fetchGeneralJournalByEventAllInternal())

                if (dataGeneralJournalByEventPerDayInternal || dataGeneralJournalByEventPerDayInternal.length > 0) {
                    dispatch(fetchGeneralJournalByEventPerDayInternal())
                }
                
                dispatch(removeGeneralJournalDrafInternalByDataObject(data.detail.data_general_journal))
            }

            if (data.action === "DRAF") {
                dispatch(fetchGeneralJournalDrafInternal())
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