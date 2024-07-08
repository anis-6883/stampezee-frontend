'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { applyCoupon, removeAddOns, removeCoupon } from '@/features/subscription/subscriptionSlice';
import { useCreateCheckOutMutation, useCreateCouponMutation } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn } from '@/types';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { ImBin } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import LoginAlert from './LoginAlert';

export default function OrderSummary() {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const { data: session, update }: any = useSession();
  const [isCouponSubmitting, setIsCouponSubmitting] = useState<boolean>(false);
  // const [isCouponItem, setIsCouponItem] = useState<boolean>(true);
  // const [couponDiscount, setCouponDiscount] = useState<number>(0);
  // const [subTotal, setSubTotal] = useState<number>(0);
  const { subscription, addOns, coupon, couponDiscount, subTotal } = useSelector((state: RootState) => state.subscriptionSlice);

  const [modalState, setModalState] = useState(false);
  const { isLoggedIn, user } = useSelector((state: RootState) => state.authSlice);

  const subSlugs = [subscription?.slug, ...addOns?.map((item: AddOn) => item.slug)];
  const [checkOut, { data: checkOutResponse, isLoading: checkOutLoading, error: checkoutError }] = useCreateCheckOutMutation();
  const [createCoupon, { data: couponResponse, error: couponError, isSuccess: couponSuccess }] = useCreateCouponMutation();
  const { data: profile, isSuccess: profileSuccess, refetch } = useRetailerGetProfileQuery(null);

  const initialValues = {
    code: '',
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required('Required!'),
  });

  useEffect(() => {
    // if (checkoutError) {
    //   const myError = checkoutError as SerializedError;
    //   toast.error(myError?.data?.message || 'Something went wrong!');
    // }

    if (checkOutResponse) {
      if (subscription?.slug === 'trial') {
        toast.success('Free trial activated!');
        update({ ...session?.user, ...checkOutResponse?.data });
        dispatch(
          setValue({
            target: 'user',
            value: { ...user, ...profile?.data },
          })
        );
        push(routes.retailer.dashboard);
      } else {
        push(checkOutResponse.data.url);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkOutResponse, push, subscription, profileSuccess]);

  const handleCheckOut = () => {
    if (!isLoggedIn) {
      setModalState(true);
    }
    if (subSlugs.length > 0) {
      checkOut({ slugs: subSlugs });
    }
  };

  const discount = 10;
  const tax = 20;
  const handleRemoveAddOn = (addOnId: string) => {
    dispatch(removeAddOns(addOnId));
  };

  useEffect(() => {
    if (couponError) {
      const myError = couponError as SerializedError;
      setIsCouponSubmitting(false);
      toast.error(myError?.data?.message || 'Something went wrong!');
    }

    if (couponSuccess) {
      setIsCouponSubmitting(false);
      toast.success(couponResponse?.message);
      dispatch(applyCoupon(couponResponse?.data));
    }
  }, [couponError, couponResponse?.data, couponResponse?.message, couponSuccess, dispatch]);

  const handleCoupon = (values: any) => {
    setIsCouponSubmitting(true);
    createCoupon(values);
  };

  return (
    <>
      <div className="rounded-lg border p-4">
        <h2 className="pb-2 text-lg font-medium">Coupon</h2>
        <hr className=" text-lg font-bold" />
        <div className="my-5">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleCoupon}>
            {() => (
              <Form className="grid grid-cols-12 justify-between gap-x-2">
                <div className="col-span-7">
                  <InputField
                    disabled={session?.user?.plan == subscription?.slug || subscription?.slug === 'trial' || coupon ? true : false}
                    label=""
                    placeholder="X1Y2Z3"
                    required={false}
                    name="code"
                  />
                </div>
                <div className="col-span-5">
                  <Button
                    disabled={session?.user?.plan == subscription?.slug || subscription?.slug === 'trial' || coupon ? true : false}
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
        <h2 className="pb-2 text-lg font-medium">{addOns?.length > 0 ? 'Plan & Add-Ons' : 'Plan'}</h2>
        <hr className="p-2 text-lg font-bold" />
        <div className="mb-2 flex justify-between">
          <span>{subscription?.title}</span>
          <span className="text-red-500">{subscription ? subscription?.price : 0} CAD</span>
        </div>

        {addOns?.length > 0 && (
          <div>
            {addOns.map((addOn: AddOn, index: number) => (
              <div key={index} className="mb-2 grid w-full grid-cols-5 items-center gap-x-4">
                <span className="col-span-2">{addOn.title}</span>
                <button onClick={() => handleRemoveAddOn(addOn._id)} className="col-span-2 text-red-500">
                  <ImBin />
                </button>
                <span className="justify-self-end">{addOn.price} CAD</span>
              </div>
            ))}
          </div>
        )}

        {couponResponse?.status && coupon && (
          <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
            <span className="col-span-6">
              {`${coupon?.title} ${coupon?.discountType === 'percentage' ? `(${coupon?.discount}%)` : ''}`}
            </span>
            <button
              onClick={() => {
                dispatch(removeCoupon());
              }}
              className="col-span-2 text-red-500"
            >
              <ImBin />
            </button>
            <span className="col-span-4 justify-self-end">
              {couponResponse?.data?.discountType === 'percentage' ? couponDiscount?.toFixed(2) : couponResponse?.data?.discount} CAD
            </span>
          </div>
        )}

        <div className="mb-2 flex justify-between">
          <span>Subtotal</span>
          <span className="text-red-500">{subTotal ? subTotal.toFixed(2) : 0} CAD</span>
        </div>

        {/* <div className="mb-2 flex justify-between">
        <span>Discount</span>
        <span className="text-red-500">-{discount} CAD</span>
      </div>
      <div className="mb-2 flex justify-between">
        <span>Tax</span>
        <span>{tax} CAD</span>
      </div> */}
        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-red-500">{subTotal ? subTotal.toFixed(2) : 0} CAD</span>
        </div>
      </div>
      <Button
        disabled={session?.user?.plan == subscription?.slug ? true : false}
        color="danger"
        text="Checkout Confirm"
        className="mt-5 w-full"
        isSubmitting={checkOutLoading}
        onClick={handleCheckOut}
        postIcon={<BsCheck2Circle className="text-base" />}
      />
      <LoginAlert modalState={modalState} setModalState={setModalState} />
    </>
  );
}
