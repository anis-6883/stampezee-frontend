// CouponForm.tsx
'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import { SerializedError } from '@/features/api/apiSlice';
import { RootState } from '@/features/store';
import { applyCoupon, setCode } from '@/features/subscription/subscriptionSlice';
import { useCreateCouponMutation } from '@/features/super-admin/subscription/subscriptionApi';
import { isCheckCouponDisabled } from '@/utils';
import { translateText } from '@/utils/GoogleTranslate';
import { Form, Formik } from 'formik';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { MdBlock } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

const CouponForm = ({ locale }: { locale: string }) => {
  const dispatch = useDispatch();
  const t = useTranslations('CheckoutPage');
  const tCommon = useTranslations('RetailerCommon');
  const { coupon, addOns, subscription, activeSubscription, planChangeType, currency } = useSelector(
    (state: RootState) => state.subscriptionSlice
  );
  const [isCouponSubmitting, setIsCouponSubmitting] = useState<boolean>(false);
  const [createCoupon, { data: couponResponse, error: couponError, isSuccess: couponSuccess }] = useCreateCouponMutation();
  const { isLoggedIn } = useSelector((state: RootState) => state?.authSlice);
  const initialValues = { code: '' };
  const validationSchema = Yup.object().shape({
    code: Yup.string().required(''),
  });

  useEffect(() => {
    if (couponError) {
      const myError = couponError as SerializedError;
      setIsCouponSubmitting(false);
      if (locale === 'en') {
        toast.error(myError?.data?.message || 'Something went wrong!');
      } else {
        (async () => {
          const translatedMessage = await translateText([myError?.data?.message], locale, 'en');
          toast.error(translatedMessage[0] || tCommon('errorMessage'));
        })();
      }
    }

    if (couponSuccess) {
      setIsCouponSubmitting(false);
      if (locale === 'en') {
        toast.success(couponResponse?.message);
      } else {
        (async () => {
          const translatedMessage = await translateText([couponResponse?.message], locale, 'en');
          toast.success(translatedMessage[0]);
        })();
      }

      dispatch(applyCoupon(couponResponse?.data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponError, couponResponse?.data, couponResponse?.message, couponSuccess, dispatch]);

  const handleCoupon = async (values: any) => {
    setIsCouponSubmitting(true);
    if (activeSubscription?.slug && activeSubscription?.slug !== 'trial') {
      const { data }: any = await createCoupon({ code: values?.code, slugs: [...addOns?.map((addOn) => addOn.slug)] });

      if (data?.status) {
        dispatch(setCode(values.code));
      }
    } else {
      const { data }: any = await createCoupon({ code: values?.code, slugs: [subscription?.slug, ...addOns?.map((addOn) => addOn.slug)] });

      if (data?.status) {
        dispatch(setCode(values.code));
      }
    }
  };

  return (
    <div className="my-5">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleCoupon}>
        {() => (
          <Form className="grid grid-cols-12 justify-between gap-x-2">
            <div className="col-span-7 space-y-3">
              <InputField
                disabled={isCheckCouponDisabled({ activeSubscription, subscription, addOns, isLoggedIn, coupon, planChangeType })}
                label=""
                placeholder="X1Y2Z3"
                required={false}
                name="code"
              />
              {subscription?.slug === 'trial' && (
                <div className="flex items-center justify-start gap-x-1">
                  <MdBlock className="text-lg" />{' '}
                  <span className="text-[15px] font-medium text-red-500">{`No coupon for free trial!`}</span>
                </div>
              )}
            </div>
            <div className="col-span-5">
              <Button
                disabled={isCheckCouponDisabled({ activeSubscription, subscription, isLoggedIn, coupon, planChangeType, addOns })}
                color="danger"
                text={t('couponButtonText')}
                className="w-full"
                isSubmitting={isCouponSubmitting}
                type="submit"
                postIcon={<BsCheck2Circle className="text-base" />}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CouponForm;
