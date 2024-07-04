'use client';

import { RootState } from '@/features/store';
import { setAddOns } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn, Subscription } from '@/types';
import { useDispatch, useSelector } from 'react-redux';

export default function AddOnsList() {
  const dispatch = useDispatch();

  const { subscription, addOns: addOnsData } = useSelector((state: RootState) => state.subscriptionSlice);

  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const addOns = data?.data?.filter((item: Subscription) => item.type === 'addon');

  const handleAddOnSelect = (addOn: AddOn) => {
    dispatch(setAddOns(addOn));
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {addOns?.map((addOn: AddOn, index: number) => (
        <div key={index}>
          {subscription?.slug !== 'trial' ? (
            <div
              onClick={() => handleAddOnSelect(addOn)}
              className={`relative cursor-pointer rounded-lg border p-4 ${
                addOnsData?.find((item: any) => item._id === addOn._id)?.isAddOnsSelect ? 'border-red-600 ring-1 ring-red-400' : 'border'
              } hover:border-red-600`}
            >
              <h3 className="mb-2 text-base font-semibold">{addOn.title}</h3>
              <p className="mb-2 text-xl font-bold">{addOn.price} CAD/month</p>
            </div>
          ) : (
            <div className={`relative cursor-not-allowed rounded-lg border p-4 opacity-50 `}>
              <h3 className="mb-2 text-base font-semibold">{addOn.title}</h3>
              <p className="mb-2 text-xl font-bold">{addOn.price} CAD/month</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
