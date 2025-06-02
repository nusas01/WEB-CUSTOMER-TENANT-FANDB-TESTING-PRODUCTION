import { 
    getTransactionOnGoingCustomerSlice,
    transactionCashOnGoingInternalSlice,
    transactionNonCashOnGoingInternalSlice,
 } from "../reducers/get"
import { useDispatch } from "react-redux"
import { useEffect, useRef } from "react"
import { useSelector } from "react-redux"

export default function SSEContainer() {
  const { loggedIn: loggedInCustomer } = useSelector((state) => state.persisted.loginStatusCustomer)
  const { loggedIn: loggedInInternal } = useSelector((state) => state.persisted.loginStatusInternal)

  return (
    <>
      {loggedInCustomer && <SSETransactionOnGoingCustomer />}
      {loggedInInternal && <SSETransactionCashOnGoingInternal />}
      {loggedInInternal && <SSETransactionNonCashOnGoingInternal />}
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
                console.log("SSE data received:", data);
            } catch (err) {
                console.error("SSE JSON parse error:", err);
            }
        };

        evtSource.onerror = (err) => {
            console.error("SSE connection error:", err);
            evtSource.close();
        };

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

    console.log("SSETransactionOnGoingCustomer rendered", { url })

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

    console.log("SSETransactionCashOnGoingInternal rendered", { url })

    return null
}


const { addTransactionNonCashOnGoingInternal } = transactionNonCashOnGoingInternalSlice.actions;
const SSETransactionNonCashOnGoingInternal = () => {
    const dispatch = useDispatch()
    const encodedApiKey = encodeURIComponent(process.env.REACT_APP_API_KEY)
    const url = `${process.env.REACT_APP_SSE_TRANSACTION_NON_CASH_ON_GOING_INTERNAL_URL}?API_KEY=${encodedApiKey}`

    useSSE(url, (data) => {
        dispatch(addTransactionNonCashOnGoingInternal(data))
    })

    console.log("SSETransactionNonCashOnGoingInternal rendered", { url })

    return null
}