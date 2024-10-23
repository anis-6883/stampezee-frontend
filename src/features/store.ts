import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './api/apiSlice';
import authSlice from './auth/authSlice';
import currencyExchangeSlice from './currency-exchange/currencyExchangeSlice';
import subscriptionSlice from './subscription/subscriptionSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    authSlice: authSlice.reducer,
    subscriptionSlice: subscriptionSlice.reducer,
    currencyExchangeSlice: currencyExchangeSlice.reducer,
  },
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== 'production',
  middleware: (getDefaultMiddlewares) => getDefaultMiddlewares().concat(apiSlice.middleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
