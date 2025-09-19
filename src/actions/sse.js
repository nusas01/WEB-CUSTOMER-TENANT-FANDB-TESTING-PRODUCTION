import { 
    getTransactionOnGoingCustomerSlice,
    transactionCashOnGoingInternalSlice,
    transactionNonCashOnGoingInternalSlice,
    getAllDataOrderInternalSlice,
    getAllCreateTransactionInternalSlice,
    getOrdersInternalSlice,
 } from "../reducers/get"
import {
    paymentSuccessTransactionCashierSlice
} from "../reducers/notif"
import { useDispatch } from "react-redux"
import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"
import { data } from "react-router-dom"

export const UsedSSEContainer = () => {
    const { loggedIn: loggedInCustomer } = useSelector((state) => state.persisted.loginStatusCustomer)
    const { loggedIn: loggedInInternal } = useSelector((state) => state.persisted.loginStatusInternal)

    return (
        <>
            {loggedInCustomer && <SSETransactionOnGoingCustomer />}
            {loggedInInternal && <SSETransactionNonCashOnGoingInternal />}
            {loggedInInternal && <SSETransactionCashOnGoingInternal />}
            {loggedInInternal && <SSEOrderInternal />}
        </>
    )
}

const useSSE = (url, onMessage) => {
    const sourceRef = useRef(null);

    useEffect(() => {
        if (!url || sourceRef.current) return;

        const evtSource = new EventSource(url, { withCredentials: true });
        sourceRef.current = evtSource;

        evtSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (err) {
            }
        };

        // evtSource.onerror = (err) => {
        //     console.error("SSE connection error:", err);
        //     evtSource.close();
        // };

        return () => {
            if (sourceRef.current) {
                sourceRef.current.close();
                sourceRef.current = null;
            }
        };
    }, [url, onMessage]);
};


const { updateTransactionOnGoingStatusById } = getTransactionOnGoingCustomerSlice.actions;
const SSETransactionOnGoingCustomer = () => {
    const dispatch = useDispatch()
    const encodedApiKey = encodeURIComponent(process.env.REACT_APP_API_KEY)
    const url = `${process.env.REACT_APP_SSE_TRANSACTION_ON_GOING_URL}?API_KEY=${encodedApiKey}`

    useSSE(url, (data) => {
        dispatch(updateTransactionOnGoingStatusById(data))
    })

    return null
}


const { addTransactionCashOnGoingInternal } = transactionCashOnGoingInternalSlice.actions;
const SSETransactionCashOnGoingInternal = () => {
    const dispatch = useDispatch()
    const encodedApiKey = encodeURIComponent(process.env.REACT_APP_API_KEY)
    const url = `${process.env.REACT_APP_SSE_TRANSACTION_CASH_ON_GOING_INTERNAL_URL}?API_KEY=${encodedApiKey}`

    useSSE(url, (data) => {
        dispatch(addTransactionCashOnGoingInternal(data))
    })

    return null
}


const { addTransactionNonCashOnGoingInternal, removeTransactionNonCashOnGoingInternalById } = transactionNonCashOnGoingInternalSlice.actions;
const SSETransactionNonCashOnGoingInternal = () => {
    const dispatch = useDispatch()
    const encodedApiKey = encodeURIComponent(process.env.REACT_APP_API_KEY)
    const url = `${process.env.REACT_APP_SSE_TRANSACTION_NON_CASH_ON_GOING_INTERNAL_URL}?API_KEY=${encodedApiKey}`

    useSSE(url, (data) => {
        dispatch(addTransactionNonCashOnGoingInternal(data))
    })


    return null
}

const { addPaymentSuccessTransactionCashier } = paymentSuccessTransactionCashierSlice.actions
const { removeGetAllCreateTransactionById } = getAllCreateTransactionInternalSlice.actions
const {  appendOrdersInternal } = getOrdersInternalSlice.actions
const SSEOrderInternal = () => {
    const dispatch = useDispatch()
    const encodedApiKey = encodeURIComponent(process.env.REACT_APP_API_KEY)
    const url = `${process.env.REACT_APP_SSE_ORDER_INTERNAL_URL}?API_KEY=${encodedApiKey}`

    useSSE(url, (data) => {
        dispatch(appendOrdersInternal(data))

        if (!data.email || data.email !== '') {
            dispatch(removeGetAllCreateTransactionById(data.id))
            dispatch(addPaymentSuccessTransactionCashier(data))
        }

        if (!data.username || data.username !== '') {
            dispatch(removeTransactionNonCashOnGoingInternalById(data.id))
        }
    })

    return null
}




