'use client';

import AddOnsList from '@/app/(client)/(public)/checkout/_components/AddOnsList';
import SubscriptionList from '@/app/(client)/(public)/checkout/_components/SubscriptionList';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import { setPlanChangeCost, setSubscription, setTaxPercentage, setTaxStatus } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { Subscription } from '@/types';
import 'aos/dist/aos.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

export const Plans = ({ stripeInfo }: any) => {
  const dispatch = useDispatch();
  const { data } = useGetSubscriptionQuery(undefined);
  const { data: session }: any = useSession();
  const { activeSubscription, subscription, addOns } = useSelector((state: RootState) => state.subscriptionSlice);

  useEffect(() => {
    dispatch(setPlanChangeCost(stripeInfo?.planChangeCost));
    dispatch(setTaxPercentage(stripeInfo?.taxCost));
    dispatch(setTaxStatus(stripeInfo?.taxStatus));
  }, [dispatch, stripeInfo?.planChangeCost, stripeInfo?.taxCost, stripeInfo?.taxStatus]);

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
          {subscription?.slug && subscription?.slug === activeSubscription?.slug && addOns?.length > 0 ? (
            <Link href={routes.privateRoutes.checkout}>
              <Button
                disabled={false}
                className="text-white"
                color="danger"
                text="Selection Confirm"
                postIcon={<BsCheck2Circle className="text-base" />}
              />
            </Link>
          ) : (
            <Link href={routes.privateRoutes.checkout}>
              <Button
                disabled={!subscription?.slug && subscription?.slug === activeSubscription?.slug ? true : false}
                className="text-white"
                color="danger"
                text="Selection Confirm"
                postIcon={<BsCheck2Circle className="text-base" />}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
