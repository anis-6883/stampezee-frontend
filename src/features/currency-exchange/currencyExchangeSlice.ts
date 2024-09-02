import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrencyExchangeState {
  currencyExchangeRates: [];
}
const initialState: CurrencyExchangeState = {
  currencyExchangeRates: [],
};

const currencyExchangeSlice = createSlice({
  name: 'currencyExchange',
  initialState,
  reducers: {
    setCurrencyExchangeRates: (state: CurrencyExchangeState, action: PayloadAction<[]>) => {
      state.currencyExchangeRates = action.payload;
    },
  },
});

export const { setCurrencyExchangeRates } = currencyExchangeSlice.actions;

export default currencyExchangeSlice;
