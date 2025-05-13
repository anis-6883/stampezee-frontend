'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { RootState } from '@/features/store';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn, Subscription } from '@/types';
import { translateData } from '@/utils/GoogleTranslate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IoCheckmarkDoneCircle, IoInformationCircleOutline } from 'react-icons/io5';
import { MdStar } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Tooltip } from 'rizzui';

export default function AddOnListForPricing({ locale }: { locale?: string }) {
  const { data: session }: any = useSession();
  const t = useTranslations('pricingPage');
  const isRtl = locale === 'ar';
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
    <div className={`grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(300px,1fr))]`}>
      {addOnList?.map((addOn: AddOn, index: number) => (
        <div key={index}>
          <div className={`relative rounded-lg border p-4`}>
            {session?.user?.activeAddonSlugs?.includes(addOn?.slug) ? (
              <div
                className={`absolute z-0 ${isRtl ? 'left-2' : 'right-2'} top-2 flex items-center justify-center space-x-1 rounded-lg border bg-red-600 px-2 py-1 text-white`}
              >
                <span className="font-medium">
                  <MdStar />
                </span>
                <span className="text-sm font-medium">{t('active')}</span>
              </div>
            ) : (
              <Tooltip
                className="bg-danger text-white"
                placement="top"
                size="md"
                arrowClassName="fill-danger"
                content={'You can select add-on after choosing a plan!'}
              >
                <div className={`absolute z-0 ${isRtl ? 'left-2' : 'right-2'} top-2 `}>
                  <IoInformationCircleOutline className="text-2xl" />
                </div>
              </Tooltip>
            )}
            <h3 className="mb-2 text-base font-semibold">{addOn.title}</h3>
            {!selectedCurrencyExchangeRate?.name ? (
              <Skeleton className="w-50 h-8 rounded" />
            ) : (
              <p className="mb-2 text-xl font-bold">
                {addOn?.price?.toFixed(2)}
                {` ${selectedCurrencyExchangeRate?.name}/month`}
              </p>
            )}

            <ul className="">
              {addOn.descriptions.map((info, idx) => (
                <li className="flex items-center space-x-3" key={idx}>
                  <IoCheckmarkDoneCircle className="text-2xl text-[#e02826]" /> <span className="mx-1 my-1 text-gray-600">{info}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
