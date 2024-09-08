'use client';

import Button from '@/components/Formik/Button';
import { Skeleton } from '@/components/ui/skeleton';
import { SUBSCRIPTIONS } from '@/config/constants';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import { downgradePlan, resetAddOns, setSubscription, upgradePlan } from '@/features/subscription/subscriptionSlice';
import { Subscription } from '@/types';
import 'aos/dist/aos.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { MdStar } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

export default function PricingCard({ item }: { item: any }) {
  const dispatch = useDispatch();
  const { currency } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data: session }: any = useSession();

  const handleSubscription = (plan: Subscription) => {
    const currentPlanIndex = SUBSCRIPTIONS.indexOf(session?.user?.plan);
    const targetPlanIndex = SUBSCRIPTIONS.indexOf(plan?.slug);

    if (plan.slug === 'trial') {
      dispatch(resetAddOns());
      dispatch(setSubscription(plan));
      return;
    }
    if (session?.user?.plan && session?.user?.plan !== 'trial') {
      if (targetPlanIndex > currentPlanIndex) {
        dispatch(upgradePlan(plan));
      } else if (targetPlanIndex < currentPlanIndex) {
        dispatch(downgradePlan(plan));
      }
    } else {
      dispatch(setSubscription(plan));
    }
    dispatch(resetAddOns());
  };

  return (
    <div className="relative mx-auto flex h-full w-full max-w-lg flex-col justify-between rounded-lg border-gray-100 bg-white p-3 text-gray-900 opacity-80 shadow-lg dark:bg-gray-800 dark:text-white xl:p-8">
      {session?.user?.plan === item?.slug && (
        <div className="absolute right-2 top-2 z-50 flex items-center justify-center space-x-1 rounded-lg border bg-red-600 px-2 py-1 text-white">
          <span className="font-medium">
            <MdStar />
          </span>
          <span className="text-sm font-medium">Active</span>
        </div>
      )}
      <div>
        <h3 className="mb-4 text-xl font-semibold">{item.title}</h3>
        {!currency?.name ? (
          <Skeleton className="w-50 h-8 rounded" />
        ) : (
          <div className="my-2 flex items-baseline">
            <span className="mr-2 text-xl font-bold xl:text-3xl xl:font-extrabold">
              <sup className="font-medium capitalize">{currency?.name}</sup>
              {item?.price ? item?.price?.toFixed(2) : 0}
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              /{item.duration === 30 ? 1 : item.duration} {item.duration === 30 ? 'Month' : 'Days'}
            </span>
          </div>
        )}
        <img
          src={item?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${item?.image}` : '/images/layer.png'}
          alt="icon"
          className="mb-5 h-8 w-8"
        />

        <ul role="list" className="mb-[75px] space-y-4 text-left ">
          {item.descriptions.map((info: any) => (
            <li className="flex items-center space-x-3" key={info}>
              <IoCheckmarkDoneCircle className="text-2xl text-danger" />
              <span>{info}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        {session?.user?.plan === item?.slug || (session?.user?.takeFreeTrial === true && item?.slug === 'trial') ? (
          <>
            <Button color="danger" text="Get started" className="w-full cursor-not-allowed" />
          </>
        ) : (
          <>
            {' '}
            <Link href={routes.privateRoutes.checkout}>
              <Button onClick={() => handleSubscription(item)} color="danger" text="Get started" className="w-full" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
