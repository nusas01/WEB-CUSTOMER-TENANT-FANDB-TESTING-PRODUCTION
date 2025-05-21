import axios from "axios";
import { getTransactionOnGoingCustomerSlice } from "../reducers/get";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const { updateTransactionOnGoingStatusById } = getTransactionOnGoingCustomerSlice.actions;

export const SSETransactionOnGoingCustomer = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const url = `${process.env.REACT_APP_SSE_TRANSACTION_ON_GOING_URL}?API_KEY=${process.env.REACT_APP_API_KEY}`
        const evtSource = new EventSource(url, { withCredentials: true })

        evtSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            dispatch(updateTransactionOnGoingStatusById(data))
            console.log("successfully sse transaction on going: ", data)
        }
    
        evtSource.onerror = (err) => {
            console.error("SSE Transaction customer error:", err)
            evtSource.close()
        }
    
        return () => {
            evtSource.close()
        }
    }, [dispatch])

    return null
}