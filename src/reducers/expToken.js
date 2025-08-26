import { createSlice } from "@reduxjs/toolkit"

const initialStatusExpiredTokenState = {
    statusExpiredToken: false,
}

export const statusExpiredTokenSlice = createSlice({
    name: "statusExpiredToken",
    initialState: initialStatusExpiredTokenState,
    reducers: {
        setStatusExpiredToken: (state, action) => {
            state.statusExpiredToken = action.payload
        },
        clearStatusExpiredToken: (state) => {
            state.statusExpiredToken = false
        }
    }
})

const initialStatusUserExpiredTokenState = {
    statusExpiredUserToken: false,
}
export const statusExpiredUserTokenSlice = createSlice({
    name: "statusExpiredUserToken",
    initialState: initialStatusUserExpiredTokenState,
    reducers: {
        setStatusExpiredUserToken: (state, action) => {
            state.statusExpiredUserToken = action.payload
        },
        clearStatusExpiredUserToken: (state) => {
            state.statusExpiredUserToken = false
        }
    }
})

const initialStatusInternalExpiredTokenState = {
    statusExpiredInternalToken: false,
}
export const statusExpiredInternalTokenSlice = createSlice({
    name: "statusExpiredInternalToken",
    initialState: initialStatusInternalExpiredTokenState,
    reducers: {
        setStatusExpiredInternalToken: (state, action) => {
            state.statusExpiredInternalToken = action.payload
        },
        clearStatusExpiredInternalToken: (state) => {
            state.statusExpiredInternalToken = false
        }
    }
})

const initialStatusServiceMaintenanceState = {
    statusServiceMaintenance: false,
}
export const statusServiceMaintenanceSlice = createSlice({
    name: "statusServiceMaintenance",
    initialState: initialStatusServiceMaintenanceState,
    reducers: {
        setStatusServiceMaintenance: (state, action) => {
            state.statusServiceMaintenance = action.payload
        },
        clearStatusServiceMaintenance: (state) => {
            state.statusServiceMaintenance = false
        }
    }
})
