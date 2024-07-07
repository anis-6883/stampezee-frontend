'use client';

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
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { MdStar } from 'react-icons/md';
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
        <div className="grid-cols mb-3 grid gap-4 lg:grid-cols-4">
          {blockedSubscriptions?.map((plan: Subscription) => (
            <div key={plan?._id} className={`relative cursor-not-allowed rounded-lg border`}>
              {session?.user?.plan === plan?.slug && (
                <div className="absolute right-2 top-2 z-50 flex items-center justify-center space-x-1 rounded-lg border bg-red-600 px-2 py-1 text-white">
                  <span className="font-medium">
                    <MdStar />
                  </span>
                  <span className="text-sm font-medium">Active</span>
                </div>
              )}
              <div className="relative mx-auto flex h-full w-full max-w-md flex-col rounded-lg border-gray-100 bg-white opacity-80 dark:bg-gray-800 dark:text-white xl:p-4">
                <h3 className="mb-3 text-lg font-semibold">{plan.title}</h3>
                <p className="mb-2 text-xl font-bold">
                  {plan.price} CAD/{plan.duration === 30 ? 'Month' : `${plan.duration} Days`}
                </p>

                <ul>
                  {plan.descriptions.map((info: string, idx: number) => (
                    <li className="flex items-center space-x-3" key={idx}>
                      <IoCheckmarkDoneCircle className="text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {subscriptions?.map((plan: any, index: number) => (
            <div
              onClick={() => handleSubscription(plan)}
              key={index}
              className={`rounded-md border hover:border-red-600 ${subscription?.slug === plan?.slug && 'border-red-600 ring-1 ring-red-400'}`}
            >
              <div className="relative mx-auto flex h-full w-full max-w-md cursor-pointer flex-col rounded-lg border-gray-100 bg-white p-3 xl:p-4">
                <h3 className="mb-3 text-lg font-semibold">{plan.title}</h3>
                <p className="mb-2 text-xl font-bold">
                  {plan.price} CAD/{plan.duration === 30 ? 'Month' : `${plan.duration} Days`}
                </p>
                <ul>
                  {plan.descriptions.map((info: string, idx: number) => (
                    <li className="flex items-center space-x-3" key={idx}>
                      <IoCheckmarkDoneCircle className="text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold">Select Add-Ons</h2>
        <div className="grid-cols mt-3 grid gap-4 lg:grid-cols-4">
          {addons?.map((addon: any, index: any) => (
            <div key={addon?._id}>
              {subscription?.slug !== 'trial' ? (
                <div onClick={() => handleAddOnSelect(addon)} key={index}>
                  <div
                    className={`relative cursor-pointer rounded-lg border p-4  hover:border-red-600 ${
                      addOns?.find((item: any) => item._id === addon._id)?.isAddOnsSelect ? 'border-red-600 ring-2 ring-danger' : 'border'
                    }`}
                  >
                    <h3 className="mb-4 text-lg font-semibold">{addon.title}</h3>
                    <div className="text-md my-2 flex items-baseline">
                      <span className="mr-1 text-xl  font-bold xl:font-extrabold ">
                        <sup className=" font-medium capitalize">CAD</sup>
                        {addon.price}
                      </span>
                      <span>
                        /{addon?.duration === 30 ? 1 : addon?.duration} {addon?.duration === 30 ? 'mo' : 'Days'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={addon._id}>
                  <div className={`relative cursor-not-allowed rounded-lg border p-4 opacity-80 `}>
                    <h3 className="mb-4 text-lg font-semibold">{addon.title}</h3>
                    <div className="text-md my-2 flex items-baseline">
                      <span className="mr-1 text-xl  font-bold xl:font-extrabold ">
                        <sup className=" font-medium capitalize">CAD</sup>
                        {addon.price}
                      </span>
                      <span>
                        /{addon?.duration === 30 ? 1 : addon?.duration} {addon?.duration === 30 ? 'mo' : 'Days'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <hr className="my-3" />
        <div className="mt-10 flex items-center justify-end gap-2">
          <Link href={routes.privateRoutes.checkout}>
            <Button className="text-white" color="danger" text="Selection Confirm" postIcon={<BsCheck2Circle className="text-base" />} />
          </Link>
        </div>
      </div>
    </div>
  );
};
