import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrencyExchangeState {
  currencyExchangeRates: [];
  currentCurrency: string;
}
const initialState: CurrencyExchangeState = {
  currencyExchangeRates: [],
  currentCurrency: '',
};

const currencyExchangeSlice = createSlice({
  name: 'currencyExchange',
  initialState,
  reducers: {
    setCurrencyExchangeRates: (state: CurrencyExchangeState, action: PayloadAction<[]>) => {
      state.currencyExchangeRates = action.payload;
    },
    setCurrentCurrency: (state: CurrencyExchangeState, action: PayloadAction<string>) => {
      state.currentCurrency = action.payload;
    },
  },
});

export const { setCurrencyExchangeRates, setCurrentCurrency } = currencyExchangeSlice.actions;

export default currencyExchangeSlice;
