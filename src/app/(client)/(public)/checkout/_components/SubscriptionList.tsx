'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/features/store';
import {
  activeSubscription,
  downgradePlan,
  resetAddOns,
  setActiveSubscription,
  setSubscription,
  upgradePlan,
} from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { Subscription } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { MdStar } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const packages = ['basic', 'pro', 'advanced'];

export default function SubscriptionList({ isMemberShip }: { isMemberShip?: boolean }) {
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const { data: session }: any = useSession();
  const { subscription, downgradeRefund, activeSubscription } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data, isLoading } = useGetSubscriptionQuery(undefined);

  useEffect(() => {
    let transformPlans = [];
    if (session?.user?.takeFreeTrial) {
      transformPlans = data?.data?.reduce((acc: Subscription[], item: Subscription) => {
        if (item.type === 'subscription') {
          if (item?.slug === 'trial' || item?.slug === session?.user?.plan) {
            acc.push({ ...item, isBlocked: true });
          } else {
            acc.push({ ...item, isBlocked: false });
          }
        }
        return acc;
      }, []);
    } else {
      transformPlans = data?.data?.filter((item: Subscription) => {
        if (item.type === 'subscription') {
          return {
            ...item,
            isBlocked: false,
          };
        }
      });
    }
    setPlans(transformPlans);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data, dispatch, session?.user, session?.user?.plan, session?.user?.takeFreeTrial]);

  const handleSubscription = (plan: Subscription) => {
    const currentPlanIndex = packages.indexOf(session?.user?.plan);
    const targetPlanIndex = packages.indexOf(plan?.slug);

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
  };

  useEffect(() => {
    if (session?.user?.takeFreeTrial && !subscription?.slug) {
      const pursedSubscription = data?.data?.find((item: Subscription) => {
        if (item?.type === 'subscription' && item?.slug === session?.user?.plan) {
          return true;
        }
        return false;
      });
      dispatch(setSubscription(pursedSubscription));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, session?.user?.plan, session?.user?.takeFreeTrial]);

  return (
    <div>
      {(!session?.user?.plan || session?.user?.plan === 'trial') && (
        <div className="mb-6 border-l-4 border-blue-400 bg-blue-50 p-4">
          <p className="font-medium text-blue-700">Change Plan</p>
          <p className="text-blue-700">You will be billed immediately when switching plans</p>
        </div>
      )}
      {session?.user?.plan && session?.user?.plan !== 'trial' && (
        <div className="mb-6 border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <p className="font-medium text-yellow-500">Upgrade or downgrade plan</p>
          <p className="text-yellow-500">You will be charged 1 CAD when switching plans</p>
        </div>
      )}

      {isLoading ? (
        <div className={`grid grid-cols-1 gap-4 ${isMemberShip ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          <Skeleton className="w-68 h-48 rounded" />
          <Skeleton className="w-68 h-48 rounded" />
          <Skeleton className="w-68 h-48 rounded" />
          <Skeleton className="w-68 h-48 rounded" />
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-4 ${isMemberShip ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          {plans?.map((item: Subscription, index: number) => {
            return item?.isBlocked ? (
              <div key={item._id} className={`relative cursor-not-allowed rounded-lg border p-4`}>
                {session?.user?.plan === item?.slug && (
                  <div className="absolute right-2 top-2 z-50 flex items-center justify-center space-x-1 rounded-lg border bg-red-600 px-2 py-1 text-white">
                    <span className="font-medium">
                      <MdStar />
                    </span>
                    <span className="text-sm font-medium">Active</span>
                  </div>
                )}
                <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                <p className="mb-2 text-xl font-bold">
                  {item.price} CAD/{item.duration === 30 ? 'Month' : `${item.duration} Days`}
                </p>
                <ul className="text-gray-600">
                  {item.descriptions.map((info, idx) => (
                    <li className="flex items-center space-x-3" key={idx}>
                      <IoCheckmarkDoneCircle className="text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div
                onClick={() => handleSubscription(item)}
                key={index}
                className={`relative cursor-pointer rounded-lg border p-4 ${
                  subscription?._id === item._id ? 'scale-105 border-2 border-red-600 ring-1 ring-red-400' : 'border'
                } hover:border-red-600`}
              >
                <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                <p className="mb-2 text-xl font-bold">
                  {item.price} CAD/{item.duration === 30 ? 'Month' : `${item.duration} Days`}
                </p>
                <ul className="text-gray-600">
                  {item.descriptions.map((info, idx) => (
                    <li className="flex items-center space-x-3" key={idx}>
                      <IoCheckmarkDoneCircle className="text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
