'use client';

import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import { setAddOns, setSubscription } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn, Subscription } from '@/types';
import 'aos/dist/aos.css';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { MdStar } from 'react-icons/md';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

export const Plans = () => {
  const { data } = useGetSubscriptionQuery(undefined);
  const { data: session }: any = useSession();
  const { subscription, addOns } = useSelector((state: RootState) => state.subscriptionSlice);

  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector(
    (state: RootState) => ({
      user: state.authSlice.user,
    }),
    shallowEqual
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.takeFreeTrial]);

  const handleSubscription = (plan: Subscription) => {
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
        <h2 className="mb-4 text-xl font-semibold">Plans</h2>
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
              <div className="relative mx-auto flex h-full w-full max-w-md flex-col rounded-lg border-gray-100 bg-white text-gray-900 opacity-80 dark:bg-gray-800 dark:text-white xl:p-4">
                <h3 className="mb-4 text-lg font-semibold">{plan.title}</h3>
                <div className="text-md my-2 flex items-baseline">
                  <span className="mr-1 text-xl  font-bold xl:font-extrabold ">
                    <sup className=" font-medium capitalize">CAD</sup>
                    {plan.price}
                  </span>
                  <span className=" text-gray-500 dark:text-gray-400">
                    /{plan?.duration === 30 ? 1 : plan?.duration} {plan?.duration === 30 ? 'mo' : 'Days'}
                  </span>
                </div>
                <img
                  src={plan?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${plan?.image}` : '/images/layer.png'}
                  alt="icon"
                  className="mb-5 h-8 w-8"
                />

                <ul role="list" className="mb-[75px] space-y-4 text-left ">
                  {plan?.descriptions.map((info: any) => (
                    <li className="flex items-center space-x-3" key={info}>
                      <IoCheckmarkDoneCircle className="text-2xl text-danger" />
                      <span>{info}</span>
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
              className={`rounded-md  border hover:border-red-600 ${subscription?.slug === plan?.slug ? 'border-red-600 ring-1 ring-red-400' : 'border'}`}
            >
              <div className="relative mx-auto flex h-full w-full max-w-md cursor-pointer flex-col rounded-lg border-gray-100 bg-white p-3 text-gray-900 opacity-80 dark:bg-gray-800 dark:text-white xl:p-4">
                <h3 className="mb-4 text-lg font-semibold">{plan.title}</h3>
                <div className="text-md my-2 flex items-baseline">
                  <span className="mr-1 text-xl  font-bold xl:font-extrabold ">
                    <sup className=" font-medium capitalize">CAD</sup>
                    {plan.price}
                  </span>
                  <span className=" text-gray-500 dark:text-gray-400">
                    /{plan?.duration === 30 ? 1 : plan?.duration} {plan?.duration === 30 ? 'mo' : 'Days'}
                  </span>
                </div>
                <img
                  src={plan?.image ? `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${plan?.image}` : '/images/layer.png'}
                  alt="icon"
                  className="mb-5 h-8 w-8"
                />

                <ul role="list" className="mb-[75px] space-y-4 text-left ">
                  {plan.descriptions.map((info: any) => (
                    <li className="flex items-center space-x-3" key={info}>
                      <IoCheckmarkDoneCircle className="text-2xl text-danger" />
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-6" />
        <h2 className="text-xl font-semibold">Add-Ons</h2>
        <div className="grid-cols mt-3 grid gap-4 lg:grid-cols-4">
          {addons?.map((addon: any, index: any) => (
            <div key={addon?._id}>
              {subscription?.slug !== 'trial' ? (
                <div onClick={() => handleAddOnSelect(addon)} key={index}>
                  <div
                    className={`relative cursor-pointer rounded-lg border p-4  hover:border-red-600 ${
                      addOns?.find((item: any) => item._id === addon._id)?.isAddOnsSelect ? 'border-red-600 ring-1 ring-blue-400' : 'border'
                    }`}
                  >
                    <h3 className="mb-4 text-lg font-semibold">{addon.title}</h3>
                    <div className="text-md my-2 flex items-baseline">
                      <span className="mr-1 text-xl  font-bold xl:font-extrabold ">
                        <sup className=" font-medium capitalize">CAD</sup>
                        {addon.price}
                      </span>
                      <span className=" text-gray-500 dark:text-gray-400">
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
                      <span className=" text-gray-500 dark:text-gray-400">
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
        <div className="flex items-center justify-end gap-2">
          <Link href={routes.privateRoutes.checkout}>
            <Button className="text-white" color="primary" text="Confirm" postIcon={<BsCheck2Circle className="text-base" />} />
          </Link>
        </div>
      </div>
    </div>
  );
};
