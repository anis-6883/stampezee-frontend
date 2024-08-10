// CouponForm.tsx
'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import { SerializedError } from '@/features/api/apiSlice';
import { RootState } from '@/features/store';
import { applyCoupon, removeCoupon, setCode } from '@/features/subscription/subscriptionSlice';
import { useCreateCouponMutation } from '@/features/super-admin/subscription/subscriptionApi';
import { checkedMinPurchaseAmount } from '@/utils';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

const CouponForm = () => {
  const dispatch = useDispatch();
  const { coupon, total, subscription, activeSubscription, planChangeType } = useSelector((state: RootState) => state.subscriptionSlice);
  const [isCouponSubmitting, setIsCouponSubmitting] = useState<boolean>(false);
  const [createCoupon, { data: couponResponse, error: couponError, isSuccess: couponSuccess }] = useCreateCouponMutation();

  const initialValues = { code: '' };
  const validationSchema = Yup.object().shape({
    code: Yup.string().required(''),
  });

  useEffect(() => {
    if (couponError) {
      const myError = couponError as SerializedError;
      setIsCouponSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (couponSuccess) {
      setIsCouponSubmitting(false);
      if (checkedMinPurchaseAmount(Math.abs(total), couponResponse?.data?.minPurchaseAmount)) {
        toast.success(couponResponse?.message);

        dispatch(applyCoupon(couponResponse?.data));
      } else {
        toast.error(`Min. ${couponResponse?.data?.minPurchaseAmount}CAD required to apply coupon!`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [couponError, couponResponse?.data, couponResponse?.message, couponSuccess, dispatch]);

  useEffect(() => {
    if (!checkedMinPurchaseAmount(Math.abs(total), coupon?.minPurchaseAmount ? coupon?.minPurchaseAmount : 0)) {
      toast.error(`Min. ${coupon?.minPurchaseAmount}CAD required to apply coupon!`);
      dispatch(removeCoupon());
    }
  }, [coupon?.minPurchaseAmount, dispatch, total]);

  const handleCoupon = async (values: any) => {
    setIsCouponSubmitting(true);
    const { data }: any = await createCoupon(values);

    if (data?.status) {
      dispatch(setCode(values.code));
    }
  };

  return (
    <div className="my-5">
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleCoupon}>
        {() => (
          <Form className="grid grid-cols-12 justify-between gap-x-2">
            <div className="col-span-7">
              <InputField
                disabled={activeSubscription?.slug == subscription?.slug || subscription?.slug === 'trial' || coupon ? true : false}
                label=""
                placeholder="X1Y2Z3"
                required={false}
                name="code"
              />
            </div>
            <div className="col-span-5">
              <Button
                disabled={
                  activeSubscription?.slug == subscription?.slug ||
                  subscription?.slug === 'trial' ||
                  coupon ||
                  planChangeType === 'downgrade'
                    ? true
                    : false
                }
                color="danger"
                text="Apply"
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
