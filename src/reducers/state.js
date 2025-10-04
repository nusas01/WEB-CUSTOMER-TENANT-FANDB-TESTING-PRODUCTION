import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session';

import { cartSlice, cartCashierSlice } from './cartSlice';
import {
  orderTypeSlice,
  storeInfoCustomerSlice,
  buttonActivityCustomerSlice,
  filterGeneralJournalInternalSlice,
  filterDateLabaRugiInternalSlice,
  filterDateNeracaInternalSlice,
  dataDrafToVoidInternalSlice,
  filterOrderInternalSlice,
  navbarInternalSlice,
  headerHiddenInternalSlice,
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
  getDataEmployeeInternalSlice,
  searchOrderInternalSlice,
  getSearchTransactionInternalSlice,
  getDetailTransactionsHistoryCustomerSlice,
  getEmployeesSlice,
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
  createQROrderTypeTakeAwaySlice,
  getJournalDrafByJsonInternalSlice,
  createEmployeeSlice,
  forgotPasswordCustomerSlice,
  forgotPasswordInternalSlice,
} from './post'
import {
  updateInternalSlice,
  updateGeneralJournalInternalSlice,
  voidGeneralJournalInternalSlice,
  updatePaymentMethodsInternalSlice,
  updateEmployeeSlice,
} from './put'
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
} from './patch'
import {
  statusExpiredTokenSlice,
  statusExpiredInternalTokenSlice,
  statusExpiredUserTokenSlice,
  statusServiceMaintenanceSlice,
} from './expToken'
import {
  paymentSuccessTransactionCashierSlice,
  dataTempUpdateProductSlice,
} from './notif'
import {
  deleteTableInternalSlice,
  deleteCategoryInternalSlice,
  deleteEmployeeSlice,
} from './delete'

// 1. Reducer yang ingin dipersist
const persistedReducers = combineReducers({
  cart: cartSlice.reducer,
  storeInfoCustomer: storeInfoCustomerSlice.reducer,
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
  getDataEmployeeInternal: getDataEmployeeInternalSlice.reducer, 
  dataDrafToVoidInternal: dataDrafToVoidInternalSlice.reducer,
  filterOrderInternal: filterOrderInternalSlice.reducer, 
  navbarInternal: navbarInternalSlice.reducer,
  getJournalDrafByJsonInternal: getJournalDrafByJsonInternalSlice.reducer,
  getDetailTransactionsHistoryCustomer:  getDetailTransactionsHistoryCustomerSlice.reducer,
  getEmployee: getEmployeesSlice.reducer,
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
  updateDataEmployeeState: updateDataEmployeeSlice.reducer,
  changePasswordInternalState: changePasswordInternalSlice.reducer,
  updatePaymentMethodsInternalState: updatePaymentMethodsInternalSlice.reducer,
  searchOrderInternalState: searchOrderInternalSlice.reducer,
  getSearchTransactionInternalState: getSearchTransactionInternalSlice.reducer, 
  createQROrderTypeTakeAwayState: createQROrderTypeTakeAwaySlice.reducer,
  deleteCategoryInternalState: deleteCategoryInternalSlice.reducer,
  headerHiddenInternalState: headerHiddenInternalSlice.reducer,
  statusExpiredUserTokenState: statusExpiredUserTokenSlice.reducer,
  statusServiceMaintenanceState: statusServiceMaintenanceSlice.reducer,
  statusExpiredInternalTokenState: statusExpiredInternalTokenSlice.reducer,
  createEmployeeState: createEmployeeSlice.reducer,
  updateEmployeeState: updateEmployeeSlice.reducer,
  changePasswordEmployeeState: changePasswordEmployeeSlice.reducer,
  deleteEmployeeState: deleteEmployeeSlice.reducer,
  forgotPasswordCustomerState: forgotPasswordCustomerSlice.reducer,
  forgotPasswordInternalState: forgotPasswordInternalSlice.reducer,
}

const appReducer = combineReducers({
  persisted: persistReducer(persistConfig, persistedReducers), 
  ...nonPersistedReducers,
})

const rootReducer = (state, action) => {
  if (action.type === "RESET_ALL") {
    state = undefined
  }
  return appReducer(state, action)
}

export const store = configureStore({
  reducer: rootReducer,
})

export const persistor = persistStore(store)

export const resetApp = () => {
  persistor.purge()

  window.sessionStorage.clear()

  store.dispatch({ type: "RESET_ALL" })
}

export default store
