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

export const useSSE = (url, onMessage) => {
  const sourceRef = useRef(null);
  const handlerRef = useRef(onMessage);

  // selalu sync handler terbaru
  useEffect(() => {
    handlerRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!url || sourceRef.current) return;

    const evtSource = new EventSource(url, { withCredentials: true });
    sourceRef.current = evtSource;

    evtSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (handlerRef.current) {
          handlerRef.current(data);
        }
      } catch (err) {
      }
    };

    evtSource.onerror = (err) => {
    };

    return () => {
      if (sourceRef.current) {
        sourceRef.current.close();
        sourceRef.current = null;
      }
    };
  }, [url]);
};


const { updateTransactionOnGoingStatusById } = getTransactionOnGoingCustomerSlice.actions;
const SSETransactionOnGoingCustomer = () => {
    const dispatch = useDispatch()
    const encodedApiKey = encodeURIComponent(process.env.REACT_APP_API_KEY)
    const encodedApiKeyMaintanance = encodeURIComponent(process.env.REACT_APP_API_KEY_MAINTANANCE)
    const url = `${process.env.REACT_APP_SSE_TRANSACTION_ON_GOING_URL}?x-api-key=${encodedApiKey}&x-api-key-maintanance=${encodedApiKeyMaintanance}`

    useSSE(url, (data) => {
        dispatch(updateTransactionOnGoingStatusById(data))
    })

    return null
}


const { addTransactionCashOnGoingInternal } = transactionCashOnGoingInternalSlice.actions;
const SSETransactionCashOnGoingInternal = () => {
    const dispatch = useDispatch()
    const encodedApiKey = encodeURIComponent(process.env.REACT_APP_API_KEY)
    const encodedApiKeyMaintanance = encodeURIComponent(process.env.REACT_APP_API_KEY_MAINTANANCE)
    const url = `${process.env.REACT_APP_SSE_TRANSACTION_CASH_ON_GOING_INTERNAL_URL}?x-api-key=${encodedApiKey}&x-api-key-maintanance=${encodedApiKeyMaintanance}`

    useSSE(url, (data) => {
        dispatch(addTransactionCashOnGoingInternal(data))
    })

    return null
}


const { addTransactionNonCashOnGoingInternal, removeTransactionNonCashOnGoingInternalById } = transactionNonCashOnGoingInternalSlice.actions;
const SSETransactionNonCashOnGoingInternal = () => {
    const dispatch = useDispatch()
    const encodedApiKey = encodeURIComponent(process.env.REACT_APP_API_KEY)
    const encodedApiKeyMaintanance = encodeURIComponent(process.env.REACT_APP_API_KEY_MAINTANANCE)
    const url = `${process.env.REACT_APP_SSE_TRANSACTION_NON_CASH_ON_GOING_INTERNAL_URL}?x-api-key=${encodedApiKey}&x-api-key-maintanance=${encodedApiKeyMaintanance}`

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
    const encodedApiKeyMaintanance = encodeURIComponent(process.env.REACT_APP_API_KEY_MAINTANANCE)
    const url = `${process.env.REACT_APP_SSE_ORDER_INTERNAL_URL}?x-api-key=${encodedApiKey}&x-api-key-maintanance=${encodedApiKeyMaintanance}`

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




