'use client';

import Button from '@/components/Formik/Button';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { activeSubscription, setActiveSubscription, setRemainingBalance } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { Subscription } from '@/types';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function OrderSession() {
  const { data: session, update }: any = useSession();
  const dispatch = useDispatch();
  const { user, isLoggedIn, accessToken } = useSelector((state: RootState) => state.authSlice);
  const { activeSubscription } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data: profile, isSuccess: profileSuccess } = useRetailerGetProfileQuery(null, { skip: !accessToken });
  const { data, isLoading } = useGetSubscriptionQuery(undefined);

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
  return (
    <Link href="/root/retailer/dashboard">
      <Button color="danger" text="Go to Dashboard" />
    </Link>
  );
}
