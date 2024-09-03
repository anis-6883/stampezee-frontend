'use client';

import { userLoggedIn, userLoggedOut } from '@/features/auth/authSlice';
import { setCurrencyExchangeRates } from '@/features/currency-exchange/currencyExchangeSlice';
import {
  setCurrency,
  setDefaultCurrency,
  setPlanChangeCost,
  setRefundableThreshold,
  setTaxPercentage,
  setTaxStatus,
} from '@/features/subscription/subscriptionSlice';
import useCurrencyExchange from '@/hooks/use-currency-exchange';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function AuthProvider({
  children,
  session,
  stripeInfo,
  currency,
}: {
  children: React.ReactNode;
  session: any;
  stripeInfo: any;
  currency: string;
}): React.ReactNode {
  const dispatch = useDispatch();
  const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });

  useEffect(() => {
    const defaultCurrencyExchange: any = currencyExchanges?.find((item: any) => item?.name === stripeInfo?.defaultCurrency?.currency);
    const currencyExchange: any = currencyExchanges?.find((item: any) => item?.name === currency);
    dispatch(setPlanChangeCost(stripeInfo?.planChangeCost));
    dispatch(setTaxPercentage(stripeInfo?.taxCost));
    dispatch(setTaxStatus(stripeInfo?.taxStatus));
    dispatch(setRefundableThreshold(stripeInfo?.refundableThreshold));
    dispatch(setCurrencyExchangeRates(currencyExchanges as []));
    dispatch(setDefaultCurrency({ name: defaultCurrencyExchange?.name, exchangeRate: defaultCurrencyExchange?.exchangeRate }));
    dispatch(setCurrency({ name: currencyExchange?.name, exchangeRate: currencyExchange?.exchangeRate }));
  }, [currency, currencyExchanges, dispatch, stripeInfo]);

  // User data and token update into redux state
  useEffect(() => {
    if (session) {
      dispatch(userLoggedIn(session?.user));
    } else {
      dispatch(userLoggedOut(undefined));
    }
  }, [dispatch, session]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
