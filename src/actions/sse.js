import axios from "axios";
import { sseTransactionOnGoingCustomerSlice } from "../reducers/reducers";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const { Message } = sseTransactionOnGoingCustomerSlice.actions;

export const SSETransactionOnGoingCustomer = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const url = `${process.env.SSE_TRANSACTION_ON_GOING_URL}?API_KEY=${process.env.SSE_TRANSACTION_ON_GOING_TOKEN}`
        const evtSource = new EventSource(url)

        evtSource.onmessage = (event) => {
            const data = JSON.parse(event.data)
            dispatch(Message(data))
        }
    
        evtSource.onerror = (err) => {
            console.error("SSE error:", err);
            evtSource.close();
        };
    
        return () => {
            evtSource.close();
        };
    }, [dispatch])

    return null
}