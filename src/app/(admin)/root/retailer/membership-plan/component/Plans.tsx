'use client';

import AddOnsList from '@/app/(client)/(public)/checkout/_components/AddOnsList';
import SubscriptionList from '@/app/(client)/(public)/checkout/_components/SubscriptionList';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import { resetAddOns, setAddOns, setSubscription } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn, Subscription } from '@/types';
import 'aos/dist/aos.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

export const Plans = () => {
  const dispatch = useDispatch();
  const { data } = useGetSubscriptionQuery(undefined);
  const { data: session }: any = useSession();
  const { subscription, addOns } = useSelector((state: RootState) => state.subscriptionSlice);

  useEffect(() => {
    if (session?.user?.takeFreeTrial) {
      const pursedSubscription = data?.data?.find((item: Subscription) => {
        if (item?.type === 'subscription' && item?.slug === session?.user?.plan) {
          return true;
        }
        return false;
      });
      dispatch(setSubscription(pursedSubscription));
    }
  }, [data, dispatch, session]);

  const handleSubscription = (plan: Subscription) => {
    if (plan.slug === 'trial') {
      dispatch(resetAddOns());
    }
    dispatch(setSubscription(plan));
  };

  const handleAddOnSelect = (addOn: AddOn) => {
    dispatch(setAddOns(addOn));
  };

  let subscriptions = [];
  if (session?.user?.takeFreeTrial) {
    const newSubscriptions = data?.data?.filter((item: Subscription) => item.type === 'subscription');

    subscriptions = newSubscriptions?.filter((item: Subscription) => {
      if (item?.slug === 'trial') return false;
      if (item?.slug === session?.user?.plan) return false;
      return true;
    });
  } else {
    subscriptions = data?.data?.filter((item: Subscription) => item.type === 'subscription');
  }

  let blockedSubscriptions = [];
  if (session?.user?.takeFreeTrial) {
    blockedSubscriptions = data?.data?.filter((item: Subscription) => {
      if (item?.slug === 'trial') return true;
      if (item?.slug === session?.user?.plan) return true;
      return false;
    });
  }

  const addons = data?.data.filter((item: any) => item?.type === 'addon');

  return (
    <div className="mb-6">
      <div className="rounded-md p-8 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Select Plans</h2>
        <SubscriptionList isMemberShip={true} />

        <hr className="my-6" />

        <h2 className="mb-4 text-xl font-semibold">Select Add-Ons</h2>
        <AddOnsList isMemberShip={true} />
        <hr className="my-3" />
        <div className="mt-10 flex items-center justify-end gap-2">
          <Link href={routes.privateRoutes.checkout}>
            <Button
              disabled={session?.user?.plan === subscription?.slug ? true : false}
              className="text-white"
              color="danger"
              text="Selection Confirm"
              postIcon={<BsCheck2Circle className="text-base" />}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
