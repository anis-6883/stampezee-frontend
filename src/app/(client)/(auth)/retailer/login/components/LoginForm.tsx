'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import InputPassword from '@/components/Formik/InputPassword';
import { ROLE } from '@/config/constants';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerLoginMutation } from '@/features/auth/authApi';
import { userLoggedIn } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { activeSubscription, setActiveSubscription, setRemainingBalance, setSubscription } from '@/features/subscription/subscriptionSlice';
import { useGetSubscriptionQuery } from '@/features/super-admin/subscription/subscriptionApi';
import useCurrencyExchange from '@/hooks/use-currency-exchange';
import { Subscription } from '@/types';
import { calculateCurrencyExchangeRate } from '@/utils';
import { translateText } from '@/utils/GoogleTranslate';
import { Form, Formik } from 'formik';
import { signIn } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { SlEnvolope, SlLock } from 'react-icons/sl';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

export default function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations('LoginPage');
  const tCommon = useTranslations('RetailerCommon');
  const { replace } = useRouter();
  const dispatch = useDispatch();
  const { data: currencyExchanges } = useCurrencyExchange({ page: 1, limit: 20 });
  const { activeSubscription, currency, defaultCurrency } = useSelector((state: RootState) => state.subscriptionSlice);
  const { data, isLoading } = useGetSubscriptionQuery(undefined);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('callback');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retailerLogin, { data: loginResponse, isSuccess: loginSuccess, error: loginError }] = useRetailerLoginMutation();

  const initialValues = {
    email: '',
    password: '',
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .test('email', t('invalidEmail'), (value: any) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(value);
      })
      .required(tCommon('required')),
    password: Yup.string().required(tCommon('required')),
  });

  useEffect(() => {
    if (loginError) {
      setIsSubmitting(false);
      const myError = loginError as SerializedError;
      setIsSubmitting(false);
      if (locale === 'en') {
        toast.error(myError?.data?.message || 'Something went wrong!');
      } else {
        (async () => {
          const translatedMessage = await translateText([myError?.data?.message], locale, 'en');
          const errorMessage = translatedMessage[0] || tCommon('errorMessage');
          toast.error(errorMessage);
        })();
      }
    }

    if (loginSuccess) {
      dispatch(userLoggedIn(loginResponse?.data));

      const activePlan: activeSubscription = data?.data?.find((item: Subscription) => item?.slug === loginResponse?.data?.plan);
      const purchaseCurrencyExchange: any = currencyExchanges?.find((item: any) => item?.name === loginResponse?.data?.planPaymentCurrency);

      let updateActiveSubscription: any = {};
      if (activePlan) {
        updateActiveSubscription = {
          ...activePlan,
          price: calculateCurrencyExchangeRate({
            selectedCurrencyExchangeRate: currency,
            defaultCurrencyExchangeRate: defaultCurrency,
            price: activePlan?.price,
          }),
          takeFreeTrial: loginResponse?.data.takeFreeTrial,
          planStartAt: loginResponse?.data.planStartAt,
          planValidAt: loginResponse?.data.planValidAt,
          planPaymentCurrency: purchaseCurrencyExchange,
        };
      } else {
        updateActiveSubscription = {
          ...activeSubscription,
          takeFreeTrial: loginResponse?.data.takeFreeTrial,
          planStartAt: loginResponse?.data.planStartAt,
          planValidAt: loginResponse?.data.planValidAt,
          planPaymentCurrency: purchaseCurrencyExchange,
        };
      }

      if (loginResponse?.data.takeFreeTrial) {
        dispatch(setSubscription(activePlan));
      }

      dispatch(setActiveSubscription(updateActiveSubscription as activeSubscription));
      dispatch(setRemainingBalance());

      signIn('credentials', {
        userData: JSON.stringify(loginResponse?.data),
        redirect: false,
      }).then((callback) => {
        if (callback?.error) {
          setIsSubmitting(false);
          toast.error(callback?.error);
        }
        if (callback?.ok && !callback?.error) {
          toast.success(t('loginSuccessMessage'));
          if (loginResponse?.data?.role === ROLE.RETAILER) {
            if (searchQuery === 'checkout') {
              replace(routes.privateRoutes.checkout);
            } else {
              replace(routes.privateRoutes.retailer.dashboard);
            }
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, loginError, loginSuccess, replace, searchQuery]);

  const handleSubmit = (values: { email: string; password: string }) => {
    setIsSubmitting(true);
    retailerLogin({
      email: values.email,
      password: values.password,
    });
  };

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleSubmit}>
      {() => (
        <Form>
          <div className="mx-auto mt-8 w-full space-y-4">
            <InputField
              autoComplete="off"
              prefix={<SlEnvolope className="text-xl" />}
              name="email"
              label={t('email')}
              placeholder="retailer@email.com"
            />
            <InputPassword prefix={<SlLock className="text-xl" />} name="password" label={t('password')} placeholder="********" />

            <p className="text-end text-xs font-semibold">
              <span dangerouslySetInnerHTML={{ __html: tCommon.raw('mandatoryFieldsMessage') }} />
            </p>
            <Button
              color="danger"
              className="w-full"
              type="submit"
              text={t('submit')}
              postIcon={<BsCheck2Circle className="text-base" />}
              isSubmitting={isSubmitting}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
