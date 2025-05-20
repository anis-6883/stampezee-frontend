'use client';

import RadioInput from '@/components/ui/RadioInput';
import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/features/store';
import { removeCode, removeCoupon, setAddOns } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn, Subscription } from '@/types';
import { translateData } from '@/utils/GoogleTranslate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { MdStar } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

const checkedAddonSelect = (addOns: AddOn[], addOn: AddOn) => addOns?.find((item: any) => item._id === addOn._id)?.isAddOnsSelect;

export default function AddOnsList({ isMemberShip, locale }: { isMemberShip?: boolean; locale?: string }) {
  const dispatch = useDispatch();
  const t = useTranslations('pricingPage');
  const isRtl = locale === 'ar';
  const [translateLoading, setTranslateLoading] = useState(false);
  const [addOnList, setAddOnList] = useState([]);
  const {
    subscription,
    code,
    addOns: addOnsData,
    currency: selectedCurrencyExchangeRate,
  } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const { data: session }: any = useSession();

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

  const handleAddOnSelect = (addOn: AddOn) => {
    dispatch(setAddOns(addOn));
    if (code) {
      dispatch(removeCode());
      dispatch(removeCoupon());
    }
    // dispatch(resetSubscription());
  };

  const isCheckedAddonBlock = (slug: string) => {
    const blockedAddonSlugs = ['push_notification_location', 'push_notification_user'];

    return blockedAddonSlugs?.includes(slug) && session?.user?.activeAddonSlugs?.includes(slug);
  };

  return isLoading || translateLoading ? (
    <div className={`grid grid-cols-1 gap-4 ${isMemberShip ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
      <Skeleton className="w-68 h-40 rounded" />
      <Skeleton className="w-68 h-40 rounded" />
      <Skeleton className="w-68 h-40 rounded" />
      <Skeleton className="w-68 h-40 rounded" />
    </div>
  ) : (
    <div className={`grid grid-cols-1 gap-4 ${isMemberShip ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
      {addOnList?.map((addOn: AddOn, index: number) => (
        <div key={index} className="grid h-full">
          {subscription?.slug && subscription?.slug !== 'trial' && !isCheckedAddonBlock(addOn?.slug) ? (
            <div
              onClick={() => handleAddOnSelect(addOn)}
              className={`relative cursor-pointer rounded-lg border p-4 ${
                checkedAddonSelect(addOnsData, addOn) ? '!border-danger !ring-1 ring-danger' : 'border'
              } hover:border-red-600`}
            >
              {session?.user?.activeAddonSlugs?.includes(addOn?.slug) && (
                <div
                  className={`absolute z-0 ${isRtl ? 'left-2' : 'right-2'} top-2 flex items-center justify-center space-x-1 rounded-lg border bg-red-600 px-2 py-1 text-white`}
                >
                  <span className="font-medium">
                    <MdStar />
                  </span>
                  <span className="text-sm font-medium">{t('active')}</span>
                </div>
              )}

              <div className={`absolute z-0 ${isRtl ? 'left-2' : 'right-2'} bottom-2`}>
                <RadioInput checked={checkedAddonSelect(addOnsData, addOn) || false} onChange={() => {}} />
              </div>

              {isMemberShip ? (
                <h3 className="mb-2 pr-10 text-base font-semibold">{addOn.title}</h3>
              ) : (
                <div className="w-[180px]">
                  <h3 className="mb-2 pr-10 text-base font-semibold">{addOn.title}</h3>
                </div>
              )}
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
                    <IoCheckmarkDoneCircle className="flex-shrink-0 text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={`relative cursor-not-allowed rounded-lg border p-4 opacity-50 `}>
              {session?.user?.activeAddonSlugs?.includes(addOn?.slug) && (
                <div
                  className={`absolute z-0 ${isRtl ? 'left-2' : 'right-2'} top-2 flex items-center justify-center space-x-1 rounded-lg border bg-red-600 px-2 py-1 text-white`}
                >
                  <span className="font-medium">
                    <MdStar />
                  </span>
                  <span className="text-sm font-medium">{t('active')}</span>
                </div>
              )}
              {isMemberShip ? (
                <h3 className="mb-2 pr-10 text-base font-semibold">{addOn.title}</h3>
              ) : (
                <div className="w-[180px]">
                  <h3 className="mb-2 pr-10 text-base font-semibold">{addOn.title}</h3>
                </div>
              )}
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
                    <IoCheckmarkDoneCircle className="flex-shrink-0 text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
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
