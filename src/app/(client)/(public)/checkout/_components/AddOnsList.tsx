'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/features/store';
import { resetSubscription, setAddOns } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn, Subscription } from '@/types';
import { calculateCurrencyExchangeRate } from '@/utils';
import { useSession } from 'next-auth/react';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

export default function AddOnsList({ isMemberShip }: { isMemberShip?: boolean }) {
  const dispatch = useDispatch();
  const {
    subscription,
    addOn: addOnData,
    defaultCurrency: defaultCurrencyExchangeRate,
    currency: selectedCurrencyExchangeRate,
  } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const { data: session }: any = useSession();

  const addOns = data?.data?.reduce((acc: Subscription[], item: Subscription) => {
    if (item.type === 'addon') {
      acc.push({
        ...item,
        price: calculateCurrencyExchangeRate({ selectedCurrencyExchangeRate, defaultCurrencyExchangeRate, price: item?.price }),
      });
    }
    return acc;
  }, []);

  const handleAddOnSelect = (addOn: AddOn) => {
    dispatch(setAddOns(addOn));
    dispatch(resetSubscription());
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
          {session?.user?.plan && session?.user?.plan !== 'trial' ? (
            <div
              onClick={() => handleAddOnSelect(addOn)}
              className={`relative cursor-pointer rounded-lg border p-4 ${
                addOnData?.slug === addOn.slug ? '!border-danger !ring-1 ring-danger' : 'border'
              } hover:border-red-600`}
            >
              <h3 className="mb-2 text-base font-semibold">{addOn.title}</h3>
              {!selectedCurrencyExchangeRate?.name ? (
                <Skeleton className="w-50 h-8 rounded" />
              ) : (
                <p className="mb-2 text-xl font-bold">
                  {addOn?.price?.toFixed(2)}
                  {` ${selectedCurrencyExchangeRate?.name}/month`}
                </p>
              )}

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
              {!selectedCurrencyExchangeRate?.name ? (
                <Skeleton className="w-50 h-8 rounded" />
              ) : (
                <p className="mb-2 text-xl font-bold">
                  {addOn?.price?.toFixed(2)}
                  {` ${selectedCurrencyExchangeRate?.name}/month`}
                </p>
              )}
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
