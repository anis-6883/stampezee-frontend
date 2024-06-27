'use client';
import { RootState } from '@/features/store';
import { useGetSubscriptionQuery } from '@/features/super-admin/Subscription/stampImageApi';
import { AddOn, Subscription } from '@/types';
import 'aos/dist/aos.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button } from 'rizzui';

export const Plans = () => {
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, AddOn & { quantity: number }>>({});

  console.log('selectedSub', selectedSub);
  console.log('selectedAddOns', selectedAddOns);
  const { authSlice }: any = useSelector((state) => state);
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector(
    (state: RootState) => ({
      user: state.authSlice.user,
    }),
    shallowEqual
  );
  console.log('user', user);
  const handleSubscription = (plan: Subscription) => {
    setSelectedSub(plan);
  };

  const handleAddOnSelect = (addOn: AddOn) => {
    setSelectedAddOns((prev) => {
      const newAddOns = { ...prev };
      if (newAddOns[addOn._id]) {
        newAddOns[addOn._id].quantity += 1;
      } else {
        newAddOns[addOn._id] = { ...addOn, quantity: 1 };
      }
      return newAddOns;
    });
  };

  const subscription = data?.data.filter((item: any) => item?.type === 'subscription');

  const addons = data?.data.filter((item: any) => item?.type === 'addon');

  return (
    <div className="mb-6">
      <div className="rounded-md p-4 shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Plans</h2>
        <div className="grid-cols grid gap-4 lg:grid-cols-3">
          {subscription?.map((plan: any, index: number) => (
            <div onClick={() => handleSubscription(plan)} key={index} className=" rounded-md border">
              {/* Pricing Card */}
              <div className="relative mx-auto flex h-full w-full max-w-md flex-col rounded-lg border-gray-100 bg-white p-3 text-gray-900 opacity-80  dark:bg-gray-800 dark:text-white xl:p-4">
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
                {/* List */}
              </div>
            </div>
          ))}
        </div>
        <hr className="my-3" />
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button color="primary" className="text-white">
            Confirm
          </Button>
        </div>
      </div>
      <div className="rounded-md p-4 shadow-md">
        <h2 className="my-4 text-xl font-semibold">Plans & Addons</h2>
        <div className="grid-cols grid gap-4 lg:grid-cols-4">
          {addons?.map((addon: any, index: any) => (
            <div onClick={() => handleAddOnSelect(addon)} key={index}>
              <div className={`relative cursor-pointer rounded-lg border p-4  hover:border-blue-600`}>
                <h3 className="mb-2 text-lg font-semibold">{addon.title}</h3>
                <p className="text-md mb-2 font-bold">{addon.price} CAD/mo</p>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-3" />
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button color="primary" className="text-white">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};
