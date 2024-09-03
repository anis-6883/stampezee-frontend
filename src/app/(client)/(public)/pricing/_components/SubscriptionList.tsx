'use client';

import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { activeSubscription, setActiveSubscription, setRemainingBalance } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { Subscription } from '@/types';
import { calculateCurrencyExchangeRate } from '@/utils';
import { Skeleton } from '@mantine/core';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PricingCard from './PricingCard';

export default function SubscriptionList() {
  const dispatch = useDispatch();
  const { accessToken } = useSelector((state: RootState) => state.authSlice);
  const { activeSubscription, currency, defaultCurrency } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const subscription = data?.data.reduce((acc: any, curr: any) => {
    if (curr.type === 'subscription') {
      acc.push({
        ...curr,
        price: calculateCurrencyExchangeRate({
          selectedCurrencyExchangeRate: currency,
          defaultCurrencyExchangeRate: defaultCurrency,
          price: curr.price,
        }),
      });
    }
    return acc;
  }, []);

  const { data: session, update }: any = useSession();
  const { data: profile, isSuccess: profileSuccess } = useRetailerGetProfileQuery(null, { skip: !accessToken });

  useEffect(() => {
    if (profileSuccess) {
      update({ ...session?.user, ...profile?.data });
      dispatch(
        setValue({
          target: 'user',
          value: { ...session?.user, ...profile?.data },
        })
      );
      const activePlan: activeSubscription = data?.data?.find((item: Subscription) => item?.slug === session?.user?.plan);

      let updateActiveSubscription = {};
      if (activePlan) {
        updateActiveSubscription = {
          ...activePlan,
          takeFreeTrial: session?.user?.takeFreeTrial,
          planStartAt: session?.user?.planStartAt,
          planValidAt: session?.user?.planValidAt,
          planPayment: session?.user?.planPayment,
        };
      } else {
        updateActiveSubscription = {
          ...activeSubscription,
          takeFreeTrial: session?.user?.takeFreeTrial,
          planStartAt: session?.user?.planStartAt,
          planValidAt: session?.user?.planValidAt,
          planPayment: session?.user?.planPayment,
        };
      }
      dispatch(setActiveSubscription(updateActiveSubscription as activeSubscription));
      dispatch(setRemainingBalance());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.data, profileSuccess, data?.data]);

  return (
    <div>
      <div className="mx-auto max-w-screen-xl">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-4">
            <Skeleton className="w-68 h-96 rounded" />
            <Skeleton className="w-68 h-96 rounded" />
            <Skeleton className="w-68 h-96 rounded" />
            <Skeleton className="w-68 h-96 rounded" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {subscription?.map((item: any) => <PricingCard key={item._id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  );
}
