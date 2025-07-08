import axios from "axios"
import {deleteTableInternalSlice} from '../reducers/delete'
import {getTablesInternalSlice} from '../reducers/get'
import {
    statusExpiredTokenSlice
} from "../reducers/expToken.js"

const {setStatusExpiredToken} = statusExpiredTokenSlice.actions

const {deleteTableInternalByNumber} = getTablesInternalSlice.actions
const {setSuccessDeleteTableInternal, setErrorDeleteTableInternal, setLoadingDeleteTableInternal} = deleteTableInternalSlice.actions
export const deleteTableInternal = (numberTable) => async (dispatch) => {
    const config = {
        headers: {
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingDeleteTableInternal(true))
    try {
        const response = await axios.delete(`${process.env.REACT_APP_GET_POST_DELETE_TABLE_INTERNAL_URL}`, config);
        if (response.status === 200) {
            dispatch(setSuccessDeleteTableInternal(response?.data.success));
            dispatch(deleteTableInternalByNumber(numberTable))
        }
    } catch(error) {
        if (error.response?.data?.code === "TOKEN_EXPIRED") {
            dispatch(setStatusExpiredToken(true))
        }

        dispatch(setErrorDeleteTableInternal(error.response?.data?.error));
    } finally {
        dispatch(setLoadingDeleteTableInternal(false))
    }
};