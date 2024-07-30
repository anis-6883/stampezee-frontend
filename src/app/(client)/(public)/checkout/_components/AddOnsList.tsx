'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/features/store';
import { setAddOns } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn, Subscription } from '@/types';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

export default function AddOnsList({ isMemberShip }: { isMemberShip?: boolean }) {
  const dispatch = useDispatch();
  const { subscription, addOns: addOnsData } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const addOns = data?.data?.filter((item: Subscription) => item.type === 'addon');

  const handleAddOnSelect = (addOn: AddOn) => {
    dispatch(setAddOns(addOn));
  };

  return isLoading ? (
    <div className={`grid grid-cols-1 gap-4 ${isMemberShip ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
      <Skeleton className="w-68 h-40 rounded" />
      <Skeleton className="w-68 h-40 rounded" />
      <Skeleton className="w-68 h-40 rounded" />
      <Skeleton className="w-68 h-40 rounded" />
    </div>
  ) : (
    <div className={`grid grid-cols-1 gap-4 ${isMemberShip ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
      {addOns?.map((addOn: AddOn, index: number) => (
        <div key={index}>
          {subscription?.slug !== 'trial' ? (
            <div
              onClick={() => handleAddOnSelect(addOn)}
              className={`relative cursor-pointer rounded-lg border p-4 ${
                addOnsData?.find((item: any) => item._id === addOn._id)?.isAddOnsSelect ? '!border-danger !ring-1 ring-danger' : 'border'
              } hover:border-red-600`}
            >
              <h3 className="mb-2 text-base font-semibold">{addOn.title}</h3>
              <p className="mb-2 text-xl font-bold">{addOn.price} CAD/month</p>
              <ul className="text-gray-600">
                {addOn.descriptions.map((info, idx) => (
                  <li className="flex items-center space-x-3" key={idx}>
                    <IoCheckmarkDoneCircle className="text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={`relative cursor-not-allowed rounded-lg border p-4 opacity-50 `}>
              <h3 className="mb-2 text-base font-semibold">{addOn.title}</h3>
              <p className="mb-2 text-xl font-bold">{addOn.price} CAD/month</p>
              <ul className="text-gray-600">
                {addOn.descriptions.map((info, idx) => (
                  <li className="flex items-center space-x-3" key={idx}>
                    <IoCheckmarkDoneCircle className="text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
