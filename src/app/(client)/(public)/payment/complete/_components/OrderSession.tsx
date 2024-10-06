'use client';

import Button from '@/components/Formik/Button';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { activeSubscription, setActiveSubscription, setRemainingBalance } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import useCurrencyExchange from '@/hooks/use-currency-exchange';
import { Subscription } from '@/types';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function OrderSession() {
  const t = useTranslations('PaymentCompletePage');
  const { data: session, update }: any = useSession();
  const dispatch = useDispatch();
  const { user, isLoggedIn, accessToken } = useSelector((state: RootState) => state.authSlice);
  const { activeSubscription, subscription, addOn } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data: profile, isSuccess: profileSuccess } = useRetailerGetProfileQuery(null, { skip: !accessToken });
  const { data, isLoading } = useGetSubscriptionQuery(undefined);
  const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });

  useEffect(() => {
    if (profileSuccess) {
      update({ ...session?.user, ...profile?.data });
      dispatch(
        setValue({
          target: 'user',
          value: { ...session?.user, ...profile?.data },
        })
      );
      const activePlan: activeSubscription = data?.data?.find((item: Subscription) => item?.slug === session?.user?.plan);
      const purchaseCurrencyExchange: any = currencyExchanges?.find((item: any) => item?.name === session?.user?.planPaymentCurrency);

      let updateActiveSubscription = {};
      if (activePlan) {
        updateActiveSubscription = {
          ...activePlan,
          takeFreeTrial: session?.user?.takeFreeTrial,
          planStartAt: session?.user?.planStartAt,
          planValidAt: session?.user?.planValidAt,
          planPaymentCurrency: purchaseCurrencyExchange,
        };
      } else {
        updateActiveSubscription = {
          ...activeSubscription,
          takeFreeTrial: session?.user?.takeFreeTrial,
          planStartAt: session?.user?.planStartAt,
          planValidAt: session?.user?.planValidAt,
          planPaymentCurrency: purchaseCurrencyExchange,
        };
      }
      dispatch(setActiveSubscription(updateActiveSubscription as activeSubscription));
      dispatch(setRemainingBalance());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.data, profileSuccess, data?.data]);
  return (
    <Link href="/root/retailer/dashboard">
      <Button color="danger" text={t('buttonText')} />
    </Link>
  );
}
