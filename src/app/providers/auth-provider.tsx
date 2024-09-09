'use client';

import { userLoggedIn, userLoggedOut } from '@/features/auth/authSlice';
import { setCurrencyExchangeRates } from '@/features/currency-exchange/currencyExchangeSlice';
import { RootState } from '@/features/store';
import {
  activeSubscription,
  setActiveSubscription,
  setCurrency,
  setDefaultCurrency,
  setPlanChangeCost,
  setRefundableThreshold,
  setRemainingBalance,
  setSubscription,
  setTaxPercentage,
  setTaxStatus,
} from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import useCurrencyExchange from '@/hooks/use-currency-exchange';
import { Subscription } from '@/types';
import { calculateCurrencyExchangeRate } from '@/utils';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
  const { activeSubscription, subscription, addOn } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });
  const { data, isLoading } = useGetSubscriptionQuery(undefined);

  // Stripe data and currency update into redux state
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

    // Active Subscription update into redux state
    const activePlan: activeSubscription = data?.data?.find((item: Subscription) => item?.slug === session?.user?.plan);
    let updateActiveSubscription = {};
    if (activePlan) {
      updateActiveSubscription = {
        ...activePlan,
        price: calculateCurrencyExchangeRate({
          selectedCurrencyExchangeRate: currencyExchange,
          defaultCurrencyExchangeRate: defaultCurrencyExchange,
          price: activePlan?.price,
        }),
        takeFreeTrial: session?.user?.takeFreeTrial,
        planStartAt: session?.user?.planStartAt,
        planValidAt: session?.user?.planValidAt,
        planPayment: session?.user?.planPayment,
      };
    } else {
      updateActiveSubscription = {
        ...activeSubscription,
        price: calculateCurrencyExchangeRate({
          selectedCurrencyExchangeRate: currencyExchange,
          defaultCurrencyExchangeRate: defaultCurrencyExchange,
          price: activeSubscription?.price,
        }),
        takeFreeTrial: session?.user?.takeFreeTrial,
        planStartAt: session?.user?.planStartAt,
        planValidAt: session?.user?.planValidAt,
        planPayment: session?.user?.planPayment,
      };
    }
    dispatch(setActiveSubscription(updateActiveSubscription as activeSubscription));

    // subscription update into redux state
    if (session?.user?.takeFreeTrial && !subscription?.slug && !addOn?.slug) {
      const pursedSubscription = data?.data?.find((item: Subscription) => {
        if (item?.type === 'subscription' && item?.slug === session?.user?.plan) {
          return true;
        }
        return false;
      });
      dispatch(setSubscription(pursedSubscription));
    }
    dispatch(setRemainingBalance());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyExchanges, data?.data, dispatch, session?.user, stripeInfo]);

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
