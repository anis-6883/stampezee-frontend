'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { SUBSCRIPTIONS } from '@/config/constants';
import { RootState } from '@/features/store';
import {
  downgradePlan,
  removeCode,
  removeCoupon,
  resetAddOns,
  setSubscription,
  upgradePlan,
} from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import { Subscription } from '@/types';
import { calculateCurrencyExchangeRate } from '@/utils';
import { translateData } from '@/utils/GoogleTranslate';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { MdStar } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

export default function SubscriptionList({ isMemberShip, locale }: { isMemberShip?: boolean; locale?: string }) {
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const t = useTranslations('pricingPage');
  const isRtl = locale === 'ar';
  const [translateLoading, setTranslateLoading] = useState(false);
  const { data: session }: any = useSession();
  const {
    subscription,
    code,
    planChangeCost,
    currency: selectedCurrencyExchangeRate,
  } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data, isLoading } = useGetSubscriptionQuery(undefined);

  useEffect(() => {
    setTranslateLoading(true);
    let transformPlans = [];
    if (session?.user?.takeFreeTrial) {
      transformPlans = data?.data?.reduce((acc: Subscription[], item: Subscription) => {
        if (item.type === 'subscription') {
          if (item?.slug === 'trial' || item?.slug === session?.user?.plan) {
            acc.push({
              ...item,
              isBlocked: true,
              price: calculateCurrencyExchangeRate({ selectedCurrencyExchangeRate, price: item?.price }),
            });
          } else {
            acc.push({
              ...item,
              isBlocked: false,
              price: calculateCurrencyExchangeRate({ selectedCurrencyExchangeRate, price: item?.price }),
            });
          }
        }
        return acc;
      }, []);
    } else {
      transformPlans = data?.data?.reduce((acc: Subscription[], item: Subscription) => {
        if (item.type === 'subscription') {
          acc.push({
            ...item,
            isBlocked: false,
            price: calculateCurrencyExchangeRate({ selectedCurrencyExchangeRate, price: item?.price }),
          });
        }
        return acc;
      }, []);
    }
    (async () => {
      if (transformPlans?.length > 0 && locale !== 'en') {
        const translatedSubscription = await translateData(transformPlans, locale as string, 'en');
        setPlans(translatedSubscription);
      } else {
        setPlans(transformPlans);
      }
      setTranslateLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.data, dispatch, selectedCurrencyExchangeRate, locale]);

  const handleSubscription = (plan: Subscription) => {
    const currentPlanIndex = SUBSCRIPTIONS.indexOf(session?.user?.plan);
    const targetPlanIndex = SUBSCRIPTIONS.indexOf(plan?.slug);

    if (plan.slug === 'trial') {
      dispatch(resetAddOns());
      dispatch(setSubscription(plan));
      return;
    }
    if (session?.user?.plan && session?.user?.plan !== 'trial') {
      if (targetPlanIndex > currentPlanIndex) {
        dispatch(upgradePlan(plan));
      } else if (targetPlanIndex < currentPlanIndex) {
        dispatch(downgradePlan(plan));
      }
    } else {
      dispatch(setSubscription(plan));
    }
    if (code) {
      dispatch(removeCode());
      dispatch(removeCoupon());
    }
    // dispatch(resetAddOns());
  };

  return (
    <div>
      {isLoading || translateLoading ? (
        <div className={`grid grid-cols-1 gap-4 ${isMemberShip ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          <Skeleton className="w-68 h-48 rounded" />
          <Skeleton className="w-68 h-48 rounded" />
          <Skeleton className="w-68 h-48 rounded" />
          <Skeleton className="w-68 h-48 rounded" />
        </div>
      ) : (
        <div className={`grid grid-cols-1 gap-4 ${isMemberShip ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          {plans?.map((item: Subscription, index: number) => {
            // && session?.user?.plan !== 'trial'
            if (session?.user?.takeFreeTrial && item?.slug === 'trial') return null;
            return item?.isBlocked ? (
              <div key={item._id} className={`relative cursor-not-allowed rounded-lg border p-4`}>
                {session?.user?.plan === item?.slug && (
                  <div
                    className={`absolute z-0 ${isRtl ? 'left-2' : 'right-2'} top-2 flex items-center justify-center space-x-1 rounded-lg border bg-red-600 px-2 py-1 text-white`}
                  >
                    <span className="font-medium">
                      <MdStar />
                    </span>
                    <span className="text-sm font-medium">{t('active')}</span>
                  </div>
                )}

                <h3 className="mb-2 text-base font-semibold capitalize">{item.title}</h3>
                {!selectedCurrencyExchangeRate?.name ? (
                  <Skeleton className="w-50 h-8 rounded" />
                ) : (
                  <p className="mb-2 text-xl font-bold">
                    {item?.price ? item?.price?.toFixed(2) : Number(0).toFixed(2)}
                    {` ${selectedCurrencyExchangeRate?.name}/${
                      item?.slug === 'trial'
                        ? item?.isUnlimited
                          ? item?.unlimitedFieldName
                          : item.duration === 30
                            ? 'month'
                            : `${item?.duration} days`
                        : item.duration === 30
                          ? 'month'
                          : `${item?.duration} days`
                    }`}
                  </p>
                )}
                <ul className="text-gray-600">
                  {item.descriptions.map((info, idx) => (
                    <li className="flex items-center space-x-3" key={idx}>
                      <IoCheckmarkDoneCircle className="text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div
                onClick={() => handleSubscription(item)}
                key={index}
                className={`relative cursor-pointer rounded-lg border p-4 ${
                  subscription?._id === item._id ? 'scale-105 border-2 border-red-600 ring-1 ring-red-400' : 'border'
                } hover:border-red-600`}
              >
                <h3 className="mb-2 text-base font-semibold capitalize">{item.title}</h3>
                {!selectedCurrencyExchangeRate?.name ? (
                  <Skeleton className="w-50 h-8 rounded" />
                ) : (
                  <p className="mb-2 text-xl font-bold">
                    {item?.price ? item?.price?.toFixed(2) : Number(0).toFixed(2)}
                    {` ${selectedCurrencyExchangeRate?.name}/${
                      item?.slug === 'trial'
                        ? item?.isUnlimited
                          ? item?.unlimitedFieldName
                          : item.duration === 30
                            ? 'month'
                            : `${item?.duration} days`
                        : item.duration === 30
                          ? 'month'
                          : `${item?.duration} days`
                    }`}
                  </p>
                )}
                <ul className="text-gray-600">
                  {item.descriptions.map((info, idx) => (
                    <li className="flex items-center space-x-3" key={idx}>
                      <IoCheckmarkDoneCircle className="text-2xl text-danger" /> <span className="mx-1 my-1">{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
