'use client';

import { RootState } from '@/features/store';
import { setAddOns } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn, Subscription } from '@/types';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from 'rizzui';

export default function AddOnsList({ isMemberShip }: { isMemberShip?: boolean }) {
  const dispatch = useDispatch();
  const { subscription, addOns: addOnsData } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const addOns = data?.data?.filter((item: Subscription) => item.type === 'addon');

  const handleAddOnSelect = (addOn: AddOn) => {
    dispatch(setAddOns(addOn));
  };

  return isLoading ? (
    <div>
      <Loader variant="spinner" />
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
