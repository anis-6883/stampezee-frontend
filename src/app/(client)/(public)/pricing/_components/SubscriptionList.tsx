'use client';

import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import {
  activeSubscription,
  setActiveSubscription,
  setPlanChangeCost,
  setRemainingBalance,
  setTaxPercentage,
  setTaxStatus,
} from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { Subscription } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from 'rizzui';
import PricingCard from './PricingCard';

export default function SubscriptionList({ stripeInfo }: any) {
  const dispatch = useDispatch();
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const subscription = data?.data.filter((item: any) => item.type === 'subscription');

  const { data: session, update }: any = useSession();
  const { user, isLoggedIn, accessToken } = useSelector((state: RootState) => state.authSlice);
  const { activeSubscription } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data: profile, isSuccess: profileSuccess } = useRetailerGetProfileQuery(null, { skip: !accessToken });

  useEffect(() => {
    if (profileSuccess) {
      update({ ...session?.user, ...profile?.data });
      dispatch(
        setValue({
          target: 'user',
          value: { ...user, ...profile?.data },
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
        };
      } else {
        updateActiveSubscription = {
          ...activeSubscription,
          takeFreeTrial: session?.user?.takeFreeTrial,
          planStartAt: session?.user?.planStartAt,
          planValidAt: session?.user?.planValidAt,
        };
      }
      dispatch(setActiveSubscription(updateActiveSubscription as activeSubscription));
      dispatch(setRemainingBalance());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.data, profileSuccess, data?.data]);

  useEffect(() => {
    dispatch(setPlanChangeCost(stripeInfo?.planChangeCost));
    dispatch(setTaxPercentage(stripeInfo?.taxCost));
    dispatch(setTaxStatus(stripeInfo?.taxStatus));
  }, [dispatch, stripeInfo?.planChangeCost, stripeInfo?.taxCost, stripeInfo?.taxStatus]);

  return (
    <div>
      <div className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-4">
          {isLoading === false ? (
            subscription?.map((item: any) => <PricingCard key={item._id} item={item} />)
          ) : (
            <Loader variant="spinner" />
          )}
        </div>
      </div>
    </div>
  );
}
