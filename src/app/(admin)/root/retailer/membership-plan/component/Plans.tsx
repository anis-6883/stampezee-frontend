'use client';

import AddOnsList from '@/app/(client)/(public)/checkout/_components/AddOnsList';
import SubscriptionList from '@/app/(client)/(public)/checkout/_components/SubscriptionList';
import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import { activeSubscription, setActiveSubscription, setRemainingBalance, setSubscription } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import useCurrencyExchange from '@/hooks/use-currency-exchange';
import { Subscription } from '@/types';
import { calculateCurrencyExchangeRate, isCheckoutButtonDisabled } from '@/utils';
import 'aos/dist/aos.css';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

export const Plans = ({ locale }: { locale: string }) => {
  const t = useTranslations('RetailerMembership');
  const dispatch = useDispatch();
  const { data } = useGetSubscriptionQuery(undefined);
  const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });
  const { data: session }: any = useSession();
  const { activeSubscription, subscription, addOns, planChangeType, total, refundableThreshold, currency, defaultCurrency } = useSelector(
    (state: RootState) => state.subscriptionSlice
  );
  const { isLoggedIn } = useSelector((state: RootState) => state.authSlice);

  useEffect(() => {
    const activePlan: activeSubscription = data?.data?.find((item: Subscription) => item?.slug === session?.user?.plan);
    const purchaseCurrencyExchange: any = currencyExchanges?.find((item: any) => item?.name === session?.user?.planPaymentCurrency);
    let updateActiveSubscription = {};

    if (activePlan) {
      updateActiveSubscription = {
        ...activePlan,
        price: calculateCurrencyExchangeRate({
          selectedCurrencyExchangeRate: currency,
          defaultCurrencyExchangeRate: defaultCurrency,
          price: activePlan?.price,
        }),
        takeFreeTrial: session?.user?.takeFreeTrial,
        planStartAt: session?.user?.planStartAt,
        planValidAt: session?.user?.planValidAt,
        planPayment: session?.user?.planPayment,
        planPaymentCurrency: purchaseCurrencyExchange,
      };
    } else {
      updateActiveSubscription = {
        ...activeSubscription,
        price: calculateCurrencyExchangeRate({
          selectedCurrencyExchangeRate: currency,
          defaultCurrencyExchangeRate: defaultCurrency,
          price: activeSubscription?.price,
        }),
        takeFreeTrial: session?.user?.takeFreeTrial,
        planStartAt: session?.user?.planStartAt,
        planValidAt: session?.user?.planValidAt,
        planPayment: session?.user?.planPayment,
        planPaymentCurrency: purchaseCurrencyExchange,
      };
    }

    dispatch(setActiveSubscription(updateActiveSubscription as activeSubscription));

    // subscription update into redux state
    if (session?.user?.takeFreeTrial && !addOns?.length) {
      const pursedSubscription = data?.data?.find((item: Subscription) => {
        if (item?.type === 'subscription' && item?.slug === session?.user?.plan) {
          return true;
        }
        return false;
      });
      dispatch(setSubscription(pursedSubscription));
    }
    dispatch(setRemainingBalance());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currencyExchanges, data?.data, dispatch, session?.user]);

  return (
    <div className="mb-6">
      <div className="rounded-md p-8 shadow-md">
        {session?.user?.plan && session?.user?.plan !== 'trial' ? (
          <h2 className="mb-4 text-xl font-semibold">{t('switchPlan')}</h2>
        ) : (
          <h2 className="mb-4 text-xl font-semibold">{t('selectPlan')}</h2>
        )}
        <SubscriptionList isMemberShip={true} locale={locale} />

        <hr className="my-6" />

        <h2 className="mb-4 text-xl font-semibold">{t('selectAddOn')}</h2>
        <AddOnsList isMemberShip={true} locale={locale} />
        <hr className="my-3" />
        <div className="mt-10 flex items-center justify-end gap-2">
          <Link href={routes.privateRoutes.checkout}>
            <Button
              disabled={isCheckoutButtonDisabled({
                plan: subscription,
                activePlan: activeSubscription,
                addOns,
                isLoggedIn,
                hasPurchasePlan: session?.user?.plan ? true : false,
                planChangeType,
                total,
                refundableThreshold,
                // isSelectionBtn: false,
              })}
              className="text-white"
              color="danger"
              text={t('buttonText')}
              postIcon={<BsCheck2Circle className="text-base" />}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
