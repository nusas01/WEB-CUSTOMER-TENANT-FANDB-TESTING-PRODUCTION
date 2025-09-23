import axiosInstance from "./axiosInstance.js"
import {
    deleteTableInternalSlice, 
    deleteCategoryInternalSlice,
    deleteEmployeeSlice,
} from '../reducers/delete'
import {
    getTablesInternalSlice,
    getCategoryInternalSlice,
} from '../reducers/get'
import {
    statusExpiredTokenSlice,
    statusExpiredInternalTokenSlice,
    statusExpiredUserTokenSlice,
    statusServiceMaintenanceSlice,
} from "../reducers/expToken.js"

const {setStatusExpiredToken} = statusExpiredTokenSlice.actions
const {setStatusExpiredUserToken} = statusExpiredUserTokenSlice.actions
const {setStatusServiceMaintenance} = statusServiceMaintenanceSlice.actions
const {setStatusExpiredInternalToken} = statusExpiredInternalTokenSlice.actions

const {deleteTableInternalByNumber} = getTablesInternalSlice.actions
const {setSuccessDeleteTableInternal, setErrorDeleteTableInternal, setLoadingDeleteTableInternal} = deleteTableInternalSlice.actions
export const deleteTableInternal = (numberTable) => async (dispatch) => {
    const config = {
        headers: {
            "API_KEY": process.env.REACT_APP_API_KEY,
            "API_KEY_MAINTANANCE": process.env.REACT_APP_API_KEY_MAINTANANCE,
        },
        withCredentials: true,
    }
    dispatch(setLoadingDeleteTableInternal(true))
    try {
        const response = await axiosInstance.delete(`${process.env.REACT_APP_GET_POST_DELETE_TABLE_INTERNAL_URL}`, config);
        if (response.status === 200) {
            dispatch(setSuccessDeleteTableInternal(response?.data?.success));
            dispatch(deleteTableInternalByNumber())
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

        dispatch(setErrorDeleteTableInternal(error.response?.data?.error));
    } finally {
        dispatch(setLoadingDeleteTableInternal(false))
    }
};

const {deleteCategoryById} = getCategoryInternalSlice.actions
const {setSuccessDeleteCategoryInternal, setErrorDeleteCategoryInternal, setLoadingDeleteCategoryInternal} = deleteCategoryInternalSlice.actions
export const deleteCategoryInternal = (id) => async (dispatch) => {
    const config = {
        headers: {
            "API_KEY": process.env.REACT_APP_API_KEY,
            "API_KEY_MAINTANANCE": process.env.REACT_APP_API_KEY_MAINTANANCE,
        },
        withCredentials: true,
        params: {
            id: id,
        }
    }
    dispatch(setLoadingDeleteCategoryInternal(true))
    try {
        const response = await axiosInstance.delete(`${process.env.REACT_APP_DELETE_GET_CATEGORY_INTERNAL_URL}`, config);
        if (response.status === 200) {
            dispatch(setSuccessDeleteCategoryInternal(response?.data?.success));
            dispatch(deleteCategoryById(id))
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

        dispatch(setErrorDeleteCategoryInternal({
            error: error.response?.data?.error,
            errorHasProduct: error.response?.data?.errorHasProduct,
        }));
    } finally {
        dispatch(setLoadingDeleteCategoryInternal(false))
    }
};

const {
  setSuccessDeleteEmployee,
  setErrorDeleteEmployee,
  setLoadingDeleteEmployee,
} = deleteEmployeeSlice.actions
export const deleteEmployee = (id) => {
  return async (dispatch) => {
    dispatch(setLoadingDeleteEmployee(true))
    try {
        const response = await axiosInstance.delete(process.env.REACT_APP_EMPLOYEE, {
            params: { id: id },
            withCredentials: true,
            headers: {
                "API_KEY": process.env.REACT_APP_API_KEY,
                "API_KEY_MAINTANANCE": process.env.REACT_APP_API_KEY_MAINTANANCE,
            },
        })
        dispatch(setSuccessDeleteEmployee(response?.data?.success))
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

        dispatch(setErrorDeleteEmployee(error?.response?.data?.error || 'Gagal menghapus employee'))
    } finally {
        dispatch(setLoadingDeleteEmployee(false))
    }
  }
}