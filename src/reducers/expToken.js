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
            state.statusExpiredToken = null
        }
    }
})
