'use client';

import Button from '@/components/Formik/Button';
import InputField from '@/components/Formik/InputField';
import { routes } from '@/config/routes';
import { RootState } from '@/features/store';
import { removeAddOns } from '@/features/subscription/subscriptionSlice';
import { useCreateCheckOutMutation } from '@/features/super-admin/Subscription/stampImageApi';
import { AddOn } from '@/types';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BsCheck2Circle } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import LoginAlert from './LoginAlert';

export default function OrderSummary() {
  const dispatch = useDispatch();

  const [isCouponSubmitting, setIsCouponSubmitting] = useState<boolean>(false);
  const [subTotal, setSubTotal] = useState<number>(0);
  const { subscription, addOns } = useSelector((state: RootState) => state.subscriptionSlice);

  const [modalState, setModalState] = useState(false);
  const { isLoggedIn } = useSelector((state: RootState) => state.authSlice);

  const subSlugs = [subscription.slug, ...addOns?.map((item: AddOn) => item.slug)];
  const { push } = useRouter();
  const [checkOut, { isSuccess: checkOutSuccess, error: checkOutError, data: checkOutResponse, isLoading: checkOutLoading }] =
    useCreateCheckOutMutation();

  useEffect(() => {
    if (checkOutResponse) {
      if (subscription?.slug === 'trial') {
        push(routes.retailer.dashboard);
      } else {
        push(checkOutResponse.data.url);
      }
    }
  }, [checkOutResponse, push, subscription]);

  const handleCheckOut = () => {
    if (!isLoggedIn) {
      setModalState(true);
    }
    if (subSlugs.length > 0) {
      checkOut({ slugs: subSlugs });
    }
  };

  const couponDiscount = 10;
  const discount = 10;
  const tax = 20;
  const handleRemoveAddOn = (addOnId: string) => {
    dispatch(removeAddOns(addOnId));
  };

  useEffect(() => {
    const total = subscription ? subscription.price + addOns.reduce((total: number, addOn: AddOn) => total + addOn.price, 0) : 0;
    setSubTotal(total);
  }, [addOns, subscription]);

  const handleCoupon = (values: any) => {
    setIsCouponSubmitting(true);
    if (values.coupon === 'coupon1234') {
      setSubTotal((prev) => prev - couponDiscount);
      setIsCouponSubmitting(false);
    }
  };
  return (
    <>
      <div className="rounded-lg border p-4">
        <h2 className="pb-2 text-lg font-medium">Coupon</h2>
        <hr className=" text-lg font-bold" />
        <div className="mb-10">
          <Formik initialValues={{ coupon: '' }} onSubmit={handleCoupon}>
            {() => (
              <Form className="grid grid-cols-12 items-center justify-between gap-x-2">
                <div className="col-span-7">
                  <InputField label="" placeholder="X1Y2Z3" required={false} name="coupon" />
                </div>
                <div className="col-span-5">
                  <Button
                    color="danger"
                    text="Apply"
                    className="mt-4 w-full"
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
          <>
            {/* <h2 className="pb-2 text-lg font-medium">Add-Ons</h2>
          <hr className="p-2 text-lg font-bold" /> */}
            <div>
              {addOns.map((addOn: AddOn, index: number) => (
                <div key={index} className="mb-2 grid w-full grid-cols-5">
                  <span className="col-span-2">{addOn.title}</span>
                  <button onClick={() => handleRemoveAddOn(addOn._id)} className="col-span-2 text-red-500">
                    Remove
                  </button>
                  <span className="justify-self-end">{addOn.price} CAD</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mb-2 flex justify-between">
          <span>Subtotal</span>
          <span className="text-red-500">{subTotal.toFixed(2)} CAD</span>
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
          <span className="text-red-500">{subTotal.toFixed(2)} CAD</span>
        </div>
      </div>
      <Button
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
