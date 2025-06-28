import { useDispatch } from "react-redux"
import { updateInternalSlice } from '../reducers/put'
import axios from "axios"
import {
statusExpiredTokenSlice
} from "../reducers/expToken.js"


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