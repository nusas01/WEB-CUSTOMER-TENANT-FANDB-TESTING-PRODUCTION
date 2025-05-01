import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

import { cartSlice } from './cartSlice';
import {
  orderTypeSlice,
} from './reducers'
import { 
  getProductsCustomerSlice, 
  getDataCustomerSlice,
  getTransactionOnGoingCustomerSlice,
  getTransactionsHistoryCustomerSlice,
  getPaymentMethodsCustomerSlice,
  logoutCustomerSlice,
  loginStatusCustomerSlice,
} from './get'
import {
  signupCustomerSlice,
  verificationSignupCustomerSlice,
  loginCustomerSlice,
  loginGoogleCustomerSlice,
  createTransactionCustomerSlice,
} from './post'
import {
  changePasswordCustomerSlice,
  setPasswordCustomerSlice,
  setUsernameCustomerSlice,
} from './patch'
import {
  sseTransactionOnGoingCustomerSlice
} from './sse'


// 1. Reducer yang ingin dipersist
const persistedReducers = combineReducers({
  cart: cartSlice.reducer,
  productsCustomer: getProductsCustomerSlice.reducer,
  dataCustomer: getDataCustomerSlice.reducer,
  paymentMethodsCustomer: getPaymentMethodsCustomerSlice.reducer,
  orderType: orderTypeSlice.reducer,
  loginStatusCustomer: loginStatusCustomerSlice.reducer,
  transactionOnGoingCustomer: getTransactionOnGoingCustomerSlice.reducer,
});

// 2. Konfigurasi persist
const persistConfig = {
  key: 'persisted',
  storage: sessionStorage,
};

// 3. Reducer yang tidak ingin dipersist
const nonPersistedReducers = {
  loginCustomerState: loginCustomerSlice.reducer,
  loginGoogleCustomerState: loginGoogleCustomerSlice.reducer,
  signupCustomerState: signupCustomerSlice.reducer,
  verificationSignupCustomerState: verificationSignupCustomerSlice.reducer,
  logoutCustomerState: logoutCustomerSlice.reducer,
  changePasswordCustomerState: changePasswordCustomerSlice.reducer,
  setPasswordCustomerState: setPasswordCustomerSlice.reducer,
  setUsernameCustomerState: setUsernameCustomerSlice.reducer,
  transactionsHistoryCustomerState: getTransactionsHistoryCustomerSlice.reducer,
  createTransactionCustomerState: createTransactionCustomerSlice.reducer,
  sseTransactionOnGoingCustomerState: sseTransactionOnGoingCustomerSlice.reducer,
};

const rootReducer = combineReducers({
  persisted: persistReducer(persistConfig, persistedReducers), 
  ...nonPersistedReducers,
});

export const store = configureStore({
  reducer: rootReducer,
});

export const persistor = persistStore(store);

export default store;
