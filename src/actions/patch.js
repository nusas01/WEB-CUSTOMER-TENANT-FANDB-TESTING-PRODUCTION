import axiosInstance from "./axiosInstance.js";
 import { 
    changePasswordCustomerSlice,
    setPasswordCustomerSlice,
    setUsernameCustomerSlice,
    buyTransactionCashOnGoingInternalSlice,
    availbaleProductlSlice,
    toProgressOrderInternalSlice,
    toFinishedOrderInternalSlice,
    updateDataEmployeeSlice,
    changePasswordInternalSlice,
    changePasswordEmployeeSlice,
 } from "../reducers/patch"
  import {
    statusExpiredTokenSlice, 
    statusExpiredInternalTokenSlice,
    statusExpiredUserTokenSlice,
    statusServiceMaintenanceSlice
 } from "../reducers/expToken.js"
import {
    getCategoryAndProductInternalSlice,
    getOrdersInternalSlice, 
} from "../reducers/get"


const {setStatusExpiredToken} = statusExpiredTokenSlice.actions
const {setStatusExpiredInternalToken} = statusExpiredInternalTokenSlice.actions
const {setStatusExpiredUserToken} = statusExpiredUserTokenSlice.actions
const {setStatusServiceMaintenance} = statusServiceMaintenanceSlice.actions


const { changePassSuccessCustomer, changePassErrorCustomer, setLoadingPassCustomer } = changePasswordCustomerSlice.actions;
export const changePasswordCustomer = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingPassCustomer(true))
    try {
        const response = await axiosInstance.patch(`${process.env.REACT_APP_CHANGE_PASSWORD_CUSTOMER_URL}`, data, config)
        dispatch(changePassSuccessCustomer(response?.data?.success))
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
            errorField: error.response?.data?.ErrorFields, 
            errorMessage: error.response?.data?.message,
            error: error.response?.data?.error,
        };
        dispatch(changePassErrorCustomer(message));
    } finally {
        dispatch(setLoadingPassCustomer(false))
    }
}


const { setPassSuccessCustomer, setPassErrorCustomer, setLoadingSetPassCustomer } = setPasswordCustomerSlice.actions;
export const setPasswordCustomer = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingSetPassCustomer(true))
    try {
        const response = await axiosInstance.patch(`${process.env.REACT_APP_SET_PASSWORD_CUSTOMER_URL}`, data, config)
        dispatch(setPassSuccessCustomer(response?.data?.success))
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
            errorField: error.response?.data?.ErrorFields, 
            error: error.response?.data?.error,
        };
        dispatch(setPassErrorCustomer(message));
    } finally {
        dispatch(setLoadingSetPassCustomer(false))
    }
}


const {setLoadingSetUsernameCustomer, setUsernameSuccessCustomer, setUsernameErrorCustomer} = setUsernameCustomerSlice.actions
export const setUsernameCustomer = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingSetUsernameCustomer(true))
    try {
        const response = await axiosInstance.patch(`${process.env.REACT_APP_SET_USERNAME_CUSTOMER_URL}`, data, config)
        dispatch(setUsernameSuccessCustomer(response?.data?.success))
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
            errorField: error.response?.data?.ErrorFields, 
            error: error.response?.data?.error,
        };
        dispatch(setUsernameErrorCustomer(message));
    } finally {
        dispatch(setLoadingSetUsernameCustomer(false))
    }
}

const { setSuccessBuyTransactionCashOnGoingInternal, setErrorBuyTransactionCashOnGoinInternal, setLoadingBuyTransactionCashOnGoingInternal } = buyTransactionCashOnGoingInternalSlice.actions;
export const buyTransactionCashOnGoingInternal = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "application/json",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingBuyTransactionCashOnGoingInternal(true))
    try {
        const response = await axiosInstance.patch(`${process.env.REACT_APP_BUY_TRANSACTION_CASH_ON_GOING_INTERNAL_URL}`, data, config)
        dispatch(setSuccessBuyTransactionCashOnGoingInternal(response?.data))
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
            errorField: error.response?.data?.ErrorFields, 
            error: error.response?.data?.error,
        };
        dispatch(setErrorBuyTransactionCashOnGoinInternal(message));
    } finally {
        dispatch(setLoadingBuyTransactionCashOnGoingInternal(false))
    }
}

const {toggleProductAvailability} = getCategoryAndProductInternalSlice.actions
const {setSuccessAvailableProduct, setErrorAvailableProduct}  = availbaleProductlSlice.actions
export const availableProductInternal = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    try {
        const response = await axiosInstance.patch(`${process.env.REACT_APP_AVAILABLE_PRODUCT_INTERNAL_URL}`, data, config)
        dispatch(setSuccessAvailableProduct(response?.data?.success))
        dispatch(toggleProductAvailability(data.id))
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

        dispatch(setErrorAvailableProduct(error.response?.data?.error));
    } 
}

const {appendOrdersInternal} = getOrdersInternalSlice.actions
const {setSuccessToProgressOrder, setErrorToProgressOrder, setLoadingToProgressOrder} = toProgressOrderInternalSlice.actions
export const toProgressOrderInternal = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingToProgressOrder(true))
    try {
        const response = await axiosInstance.patch(`${process.env.REACT_APP_PATCH_TO_PROGRESS_ORDER_INTERNAL_URL}`, data, config)
        dispatch(setSuccessToProgressOrder("Order accepted successfully. Status has been updated from Processing to In Progress."))
        dispatch(appendOrdersInternal(response?.data?.data))
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

        dispatch(setErrorToProgressOrder(error.response?.data?.error));
    } finally {
        dispatch(setLoadingToProgressOrder(false))
    }
}

// const { addOrderFinishedInternal } = getOrdersFinishedInternalSlice.actions
const {setSuccessToFinishedOrder, setErrorToFinishedOrder, setLoadingToFinishedOrder} = toFinishedOrderInternalSlice.actions
export const toFinishedOrderInternal = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingToFinishedOrder(true))
    try {
        const formData = {
            transaction_id: data.id,
        }
        const response = await axiosInstance.patch(`${process.env.REACT_APP_PATCH_TO_FINISHED_ORDER_INTERNAL_URL}`, formData, config)
        dispatch(setSuccessToFinishedOrder("The order has been completed. Status has been updated from In Progress to Finished."))
        // dispatch(addOrderFinishedInternal(data))
        dispatch(appendOrdersInternal(response?.data?.data))
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

        dispatch(setErrorToFinishedOrder(error.response?.data?.error));
    } finally {
        dispatch(setLoadingToFinishedOrder(false))
    }
}


const {setSuccessUpdateDataEmployee, setErrorUpdateDataEmployee, setLoadingUpdateDataEmployee} = updateDataEmployeeSlice.actions
export const updateDataEmployeeInternal = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingUpdateDataEmployee(true))
    try {
        const response = await axiosInstance.patch(`${process.env.REACT_APP_GET_PATCH_DATA_EMPLOYEE_INTERNAL_URL}`, data, config)
        dispatch(setSuccessUpdateDataEmployee(response?.data?.success))
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

        dispatch(setErrorUpdateDataEmployee(error.response?.data?.error));
    } finally {
        dispatch(setLoadingUpdateDataEmployee(false))
    }
}

const {setSuccessChangePasswordInternal, setErrorChangePasswordInteral, setLoadingChangePasswordInternal} = changePasswordInternalSlice.actions
export const updateChangePasswordInternal = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingChangePasswordInternal(true))
    try {
        const response = await axiosInstance.patch(`${process.env.REACT_APP_CHANGE_PASSWORD_INTERNAL_URL}`, data, config)
        dispatch(setSuccessChangePasswordInternal(response?.data?.success))
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

        dispatch(setErrorChangePasswordInteral({
            error: error.response?.data?.error,
            password: error.response?.data?.ErrorFields?.Password,
            newPassword: error.response?.data?.ErrorFields?.NewPassword
        }));
    } finally {
        dispatch(setLoadingChangePasswordInternal(false))
    }
}

const {setSuccessChangePasswordEmployee, setErrorChangePasswordEmployee, setLoadingChangePasswordEmployee} = changePasswordEmployeeSlice.actions
export const changePasswordEmployee = (data) => async (dispatch) => {
    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            "API_KEY": process.env.REACT_APP_API_KEY,
        },
        withCredentials: true,
    }
    dispatch(setLoadingChangePasswordEmployee(true))
    try {
        const response = await axiosInstance.patch(`${process.env.REACT_APP_CHANGE_PASSWORD_EMPLOYEE}`, data, config)
        dispatch(setSuccessChangePasswordEmployee(response?.data?.success))
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

        dispatch(setErrorChangePasswordEmployee({ 
            error: error?.response?.data?.error,
            errorField: error?.response?.data?.ErrorField,
        }))
    } finally {
        dispatch(setLoadingChangePasswordEmployee(false))
    }
}




