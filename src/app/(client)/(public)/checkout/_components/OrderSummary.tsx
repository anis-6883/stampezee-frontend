'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import { routes } from '@/config/routes';
import { SerializedError } from '@/features/api/apiSlice';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import {
  applyCoupon,
  removeAddOns,
  removeCoupon,
  setPlanChangeCost,
  setTaxPercentage,
  setTaxStatus,
} from '@/features/subscription/subscriptionSlice';
import { useCreateCheckOutMutation, useCreateCouponMutation } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn } from '@/types';
import { checkedMinPurchaseAmount } from '@/utils';
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

export default function OrderSummary({ stripeInfo }: any) {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const { data: session, update }: any = useSession();
  const [isCouponSubmitting, setIsCouponSubmitting] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');
  const { subscription, addOns, coupon, couponDiscount, subTotal, total, tax, activeSubscription, remainingBalance } = useSelector(
    (state: RootState) => state.subscriptionSlice
  );

  const [modalState, setModalState] = useState(false);
  const { isLoggedIn, user } = useSelector((state: RootState) => state.authSlice);

  const subSlugs = [subscription?.slug, ...addOns?.map((item: AddOn) => item.slug)];
  const [checkOut, { data: checkOutResponse, isLoading: checkOutLoading, error: checkoutError }] = useCreateCheckOutMutation();
  const [createCoupon, { data: couponResponse, error: couponError, isSuccess: couponSuccess }] = useCreateCouponMutation();
  const { data: profile, isSuccess: profileSuccess, refetch } = useRetailerGetProfileQuery(null, { skip: !isLoggedIn });

  const initialValues = {
    code: '',
  };

  const validationSchema = Yup.object().shape({
    code: Yup.string().required('Required!'),
  });

  useEffect(() => {
    dispatch(setPlanChangeCost(stripeInfo?.planChangeCost));
    dispatch(setTaxPercentage(stripeInfo?.taxCost));
    dispatch(setTaxStatus(stripeInfo?.taxStatus));
  }, [dispatch, stripeInfo?.planChangeCost, stripeInfo?.taxCost, stripeInfo?.taxStatus]);

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
      if (code) {
        checkOut({ slugs: subSlugs, code });
      } else {
        checkOut({ slugs: subSlugs });
      }
    }
  };

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

  const handleCoupon = (values: any) => {
    setIsCouponSubmitting(true);
    createCoupon(values);
    setCode(values.code);
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
        {activeSubscription?.slug && activeSubscription?.slug !== 'trial' && (
          <div className="my-5">
            <h2 className="pb-2 text-lg font-medium">Balance</h2>
            <hr className="p-2 text-lg font-bold" />
            <div className="mb-2 flex justify-between">
              <span>Current Amount</span>
              <span className="text-red-500">{remainingBalance.toFixed(2)} CAD</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Usage Amount</span>
              <span className="text-red-500">{Math.abs(remainingBalance - activeSubscription?.price).toFixed(2)} CAD</span>
            </div>
          </div>
        )}
        {subscription?.slug !== activeSubscription?.slug || addOns?.length > 0 ? (
          <div>
            <h2 className="pb-2 text-lg font-medium">{addOns?.length > 0 ? 'Plan & Add-Ons' : 'Plan'}</h2>
            <hr className="p-2 text-lg font-bold" />
            <div className="mb-2 flex justify-between">
              <span>{subscription?.title}</span>
              <span className="text-red-500">{subscription ? parseFloat(subscription?.price).toFixed(2) : 0} CAD</span>
            </div>

            {activeSubscription?.slug && activeSubscription?.slug !== 'trial' && (
              <div className="mb-2 flex justify-between">
                <span>Remaining Amount</span>
                <span className="text-red-500">-{remainingBalance.toFixed(2)} CAD</span>
              </div>
            )}

            {activeSubscription?.slug && activeSubscription?.slug !== 'trial' && (
              <div className="mb-2 flex justify-between">
                <span>Change Cost</span>
                <span className="text-red-500">{stripeInfo?.planChangeCost} CAD</span>
              </div>
            )}

            {addOns?.length > 0 && (
              <div>
                {addOns.map((addOn: AddOn, index: number) => (
                  <div key={index} className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                    <span className="col-span-6">{addOn.title}</span>
                    <button onClick={() => handleRemoveAddOn(addOn._id)} className="col-span-2 text-red-500">
                      <ImBin />
                    </button>
                    <span className="col-span-4 justify-self-end">{addOn ? parseFloat(addOn?.price?.toFixed(2)).toFixed(2) : 0} CAD</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-2 flex justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="text-red-500">{Math.abs(subTotal).toFixed(2)} CAD</span>
            </div>
            <hr className="p-2 text-lg font-bold" />
            {stripeInfo?.taxStatus === 'on' && (
              <div className="mb-2 flex justify-between">
                <span>
                  <span className="font-semibold">{stripeInfo?.taxTitle}</span> ({stripeInfo?.taxCost}%)
                </span>
                <span className="text-red-500">{tax.toFixed(2)} CAD</span>
              </div>
            )}

            {coupon && (
              <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
                <span className="col-span-6">
                  <span className="font-semibold">Coupon:</span>{' '}
                  {`${coupon?.title.length > 10 ? `${coupon?.title.slice(0, 10)}...` : coupon?.title} ${coupon?.discountType === 'percentage' ? `(${coupon?.discount}%)` : ''}`}
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
                  {coupon?.discountType === 'percentage' ? `-${couponDiscount?.toFixed(2)}` : `-${coupon?.discount}`} CAD
                </span>
              </div>
            )}

            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-red-500">{Math.abs(total).toFixed(2)} CAD</span>
            </div>
          </div>
        ) : (
          <div className="text-center font-medium text-red-500">Your cart is currently empty!</div>
        )}
      </div>
      {total > 0 && (
        <div className="mt-3 rounded-lg border p-4">
          <h2 className=" text-lg font-medium">We will be return {Math.abs(total).toFixed(2)} CAD</h2>
        </div>
      )}
      {Math.abs(total) < 1 && activeSubscription?.slug && activeSubscription?.slug !== 'trial' && (
        <div className="my-3 border-l-4 border-yellow-400 bg-yellow-50 p-4">
          <p className="font-medium text-yellow-500">Upgrade or downgrade plan</p>
          <p className="text-yellow-500">Your order needs to be at least 1 CAD. Please add more items to continue</p>
        </div>
      )}
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
