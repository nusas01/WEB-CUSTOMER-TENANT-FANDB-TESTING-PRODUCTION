import { configureStore } from '@reduxjs/toolkit';
import { cartSlice } from './cartSlice';
import { persistReducer, persistStore } from 'redux-persist';
import sessionStorage from 'redux-persist/lib/storage/session'; // Menggunakan sessionStorage
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  cart: cartSlice.reducer,
});

const persistConfig = {
  key: 'root',
  storage: sessionStorage, 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer, 
});


export const persistor = persistStore(store);

export default store;
