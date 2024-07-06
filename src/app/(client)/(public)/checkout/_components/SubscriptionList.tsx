'use client';

import { RootState } from '@/features/store';
import { resetAddOns, setSubscription } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { Subscription } from '@/types';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { MdStar } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

export default function SubscriptionList() {
  const dispatch = useDispatch();
  const { data: session }: any = useSession();
  const { subscription } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data } = useGetSubscriptionQuery(undefined);

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

  const handleSubscription = (plan: Subscription) => {
    if (plan.slug === 'trial') {
      dispatch(resetAddOns());
    }
    dispatch(setSubscription(plan));
  };

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
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {blockedSubscriptions?.map((item: Subscription) => (
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
      ))}

      {subscriptions?.map((item: Subscription, index: number) => (
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
      ))}
    </div>
  );
}
