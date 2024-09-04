'use client';

import AddOnsList from '@/app/(client)/(public)/checkout/_components/AddOnsList';
import SubscriptionList from '@/app/(client)/(public)/checkout/_components/SubscriptionList';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { isCheckoutButtonDisabled } from '@/utils';
import 'aos/dist/aos.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { BsCheck2Circle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

export const Plans = () => {
  const dispatch = useDispatch();
  const { data } = useGetSubscriptionQuery(undefined);
  const { data: session }: any = useSession();
  const { activeSubscription, subscription, addOn, planChangeType, total, refundableThreshold } = useSelector(
    (state: RootState) => state.subscriptionSlice
  );
  const { isLoggedIn } = useSelector((state: RootState) => state.authSlice);

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
              disabled={isCheckoutButtonDisabled({
                plan: subscription,
                activePlan: activeSubscription,
                addOn,
                isLoggedIn,
                hasPurchasePlan: session?.user?.plan ? true : false,
                planChangeType,
                total,
                refundableThreshold,
              })}
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
