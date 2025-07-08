import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

import { cartSlice, cartCashierSlice } from './cartSlice';
import {
  orderTypeSlice,
  buttonActivityCustomerSlice,
  filterGeneralJournalInternalSlice,
  filterDateLabaRugiInternalSlice,
  filterDateNeracaInternalSlice,
} from './reducers'
import { 
  getProductsCustomerSlice, 
  getDataCustomerSlice,
  getTransactionOnGoingCustomerSlice,
  getTransactionsHistoryCustomerSlice,
  getPaymentMethodsCustomerSlice,
  logoutCustomerSlice,
  loginStatusCustomerSlice,
  loginStatusInternalSlice,
  logoutInternalSlice,
  transactionCashOnGoingInternalSlice,
  transactionNonCashOnGoingInternalSlice,
  checkTransactionNonCashInternalSlice,
  transactionHistoryInternalSlice,
  dataFilteringTransactionHistorySlice,
  getAllCreateTransactionInternalSlice,
  getPaymentMethodsInternalSlice,
  getCategoryAndProductInternalSlice,
  getCategoryInternalSlice,
  getLabaRugiInternalSlice,
  getGeneralJournalByEventAllInternalSlice,
  getGeneralJournalByEventPerDayInternalSlice,
  getGeneralJournalVoidInternalSlice,
  getGeneralJournalDrafInternalSlice,
  getAssetsStoreInternalSlice,
  getOrdersInternalSlice,
  getOrdersFinishedInternalSlice,
  getTablesInternalSlice,
  getNeracaInternalSlice,
} from './get'
import {
  signupCustomerSlice,
  verificationSignupCustomerSlice,
  loginCustomerSlice,
  loginGoogleCustomerSlice,
  createTransactionCustomerSlice,
  loginInternalSlice,
  createTransactionInternalSlice,
  createCategoryInternalSlice,
  createProductInternalSlice,
  deleteProductInternalSlice,
  inputGeneralJournalInternalSlice,
  createTableInternalSlice,
} from './post'
import {
  updateInternalSlice,
  updateGeneralJournalInternalSlice,
} from './put'
import {
  changePasswordCustomerSlice,
  setPasswordCustomerSlice,
  setUsernameCustomerSlice,
  buyTransactionCashOnGoingInternalSlice,
  availbaleProductlSlice,
  voidGeneralJournalInternalSlice,
  toProgressOrderInternalSlice,
  toFinishedOrderInternalSlice,
} from './patch'
import {
  statusExpiredTokenSlice
} from './expToken'
import {
  paymentSuccessTransactionCashierSlice,
  dataTempUpdateProductSlice,
} from './notif'
import {
  deleteTableInternalSlice
} from './delete'


// 1. Reducer yang ingin dipersist
const persistedReducers = combineReducers({
  cart: cartSlice.reducer,
  productsCustomer: getProductsCustomerSlice.reducer,
  dataCustomer: getDataCustomerSlice.reducer,
  paymentMethodsCustomer: getPaymentMethodsCustomerSlice.reducer,
  orderType: orderTypeSlice.reducer,
  loginStatusCustomer: loginStatusCustomerSlice.reducer,
  transactionOnGoingCustomer: getTransactionOnGoingCustomerSlice.reducer,
  transactionsHistoryCustomer: getTransactionsHistoryCustomerSlice.reducer,
  buttonActivityCustomer: buttonActivityCustomerSlice.reducer,
  loginStatusInternal: loginStatusInternalSlice.reducer,
  transactionCashOnGoingInternal: transactionCashOnGoingInternalSlice.reducer,
  transactionNonCashOnGoingInternal: transactionNonCashOnGoingInternalSlice.reducer,
  transactionHistoryInternal: transactionHistoryInternalSlice.reducer,
  dataFilteringTransactionHistoryState: dataFilteringTransactionHistorySlice.reducer,
  getAllCreateTransactionInternal: getAllCreateTransactionInternalSlice.reducer,
  paymentMethodsInternal: getPaymentMethodsInternalSlice.reducer,
  getCategoryInternal: getCategoryInternalSlice.reducer,
  getCategoryAndProductInternal: getCategoryAndProductInternalSlice.reducer,
  getGeneralJournalByEventInternal: getGeneralJournalByEventAllInternalSlice.reducer,
  getGeneralJournalByEventPerDayInternal: getGeneralJournalByEventPerDayInternalSlice.reducer,
  getGeneralJournalVoidInternal: getGeneralJournalVoidInternalSlice.reducer,
  getGeneralJournalDrafInternal: getGeneralJournalDrafInternalSlice.reducer,
  getAssetsStoreInternal: getAssetsStoreInternalSlice.reducer,
  filterGeneralJournalInternal: filterGeneralJournalInternalSlice.reducer,
  dataOrdersInternal: getOrdersInternalSlice.reducer,
  dataOrdersFinishedInternal: getOrdersFinishedInternalSlice.reducer,
  getTablesInternal: getTablesInternalSlice.reducer, 
  getLabaRugiInternal: getLabaRugiInternalSlice.reducer,
  filterDateLabaRugiInternal: filterDateLabaRugiInternalSlice.reducer,
  getNeracaInternal: getNeracaInternalSlice.reducer,
  filterDateNeracaInternal: filterDateNeracaInternalSlice.reducer,
})

// 2. Konfigurasi persist
const persistConfig = {
  key: 'persisted',
  storage: sessionStorage,
}

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
  createTransactionCustomerState: createTransactionCustomerSlice.reducer,
  loginInternalState: loginInternalSlice.reducer,
  logoutInternalState: logoutInternalSlice.reducer,
  checkTransactionNonCashInternalState: checkTransactionNonCashInternalSlice.reducer,
  buyTransactionCashOnGoingInternalState: buyTransactionCashOnGoingInternalSlice.reducer,
  statusExpiredTokenState: statusExpiredTokenSlice.reducer, 
  createTransactionInternalState: createTransactionInternalSlice.reducer,
  cartCashierState: cartCashierSlice.reducer,
  paymentSuccessTransactionCashierState: paymentSuccessTransactionCashierSlice.reducer,
  createCategoryInternalState: createCategoryInternalSlice.reducer,
  createProductInternalState: createProductInternalSlice.reducer,
  updateInternalState: updateInternalSlice.reducer,
  dataTempUpdateProductState: dataTempUpdateProductSlice.reducer,
  availbaleProductState: availbaleProductlSlice.reducer,
  deleteProductInternalState: deleteProductInternalSlice.reducer,
  inputGeneralJournalInternalState: inputGeneralJournalInternalSlice.reducer,
  updateGeneralJournalInternalState: updateGeneralJournalInternalSlice.reducer, 
  voidGeneralJournalInternalState: voidGeneralJournalInternalSlice.reducer,
  toProgressOrderInternalState: toProgressOrderInternalSlice.reducer, 
  toFinishedOrderInternalState: toFinishedOrderInternalSlice.reducer,
  createTableInternalState: createTableInternalSlice.reducer,
  deleteTableInternalState: deleteTableInternalSlice.reducer,
}

const rootReducer = combineReducers({
  persisted: persistReducer(persistConfig, persistedReducers), 
  ...nonPersistedReducers,
})

export const store = configureStore({
  reducer: rootReducer,
})

export const persistor = persistStore(store)

export default store
