'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/features/store';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn, Subscription } from '@/types';
import { translateData } from '@/utils/GoogleTranslate';
import { useEffect, useState } from 'react';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { useSelector } from 'react-redux';

export default function AddOnListForPricing({ locale }: { locale?: string }) {
  const [translateLoading, setTranslateLoading] = useState(false);
  const [addOnList, setAddOnList] = useState([]);
  const { currency: selectedCurrencyExchangeRate } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data, isLoading } = useGetSubscriptionQuery(undefined);

  useEffect(() => {
    setTranslateLoading(true);
    const addOns = data?.data?.reduce((acc: Subscription[], item: Subscription) => {
      if (item.type === 'addon') {
        acc.push({
          ...item,
          price: Number((item?.price * selectedCurrencyExchangeRate?.exchangeRate).toFixed(2)),
        });
      }
      return acc;
    }, []);
    (async () => {
      if (addOns?.length > 0 && locale !== 'en') {
        const translatedSubscription = await translateData(addOns, locale as string, 'en');
        setAddOnList(translatedSubscription);
      } else {
        setAddOnList(addOns);
      }
      setTranslateLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data, locale, selectedCurrencyExchangeRate]);

  return isLoading || translateLoading ? (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-4`}>
      <Skeleton className="w-68 h-40 rounded" />
      <Skeleton className="w-68 h-40 rounded" />
      <Skeleton className="w-68 h-40 rounded" />
      <Skeleton className="w-68 h-40 rounded" />
    </div>
  ) : (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-4`}>
      {addOnList?.map((addOn: AddOn, index: number) => (
        <div key={index}>
          <div className={`relative rounded-lg border p-4`}>
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
        </div>
      ))}
    </div>
  );
}
