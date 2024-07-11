'use client';

import Button from '@/components/Formik/Button';
import { routes } from '@/config/routes';
import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { removeAddOns, setPlanChangeCost, setTaxPercentage, setTaxStatus } from '@/features/subscription/subscriptionSlice';
import { useCreateCheckOutMutation } from '@/features/super-admin/subscription/subscriptionApi';
import { AddOn } from '@/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2Circle } from 'react-icons/bs';
import { ImBin } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';
import CouponForm from './CouponForm';
import LoginAlert from './LoginAlert';
import OrderBalance from './OrderBalance';
import PlanAddOns from './PlanAddons';

export default function OrderSummary({ stripeInfo }: any) {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const { data: session, update }: any = useSession();
  const [isCouponSubmitting, setIsCouponSubmitting] = useState<boolean>(false);

  const { code, subscription, addOns, coupon, couponDiscount, subTotal, total, tax, activeSubscription, remainingBalance } = useSelector(
    (state: RootState) => state.subscriptionSlice
  );

  const [modalState, setModalState] = useState(false);
  const { isLoggedIn, user } = useSelector((state: RootState) => state.authSlice);

  const subSlugs = [subscription?.slug, ...addOns?.map((item: AddOn) => item.slug)];
  const [checkOut, { data: checkOutResponse, isLoading: checkOutLoading, error: checkoutError }] = useCreateCheckOutMutation();
  const { data: profile, isSuccess: profileSuccess, refetch } = useRetailerGetProfileQuery(null, { skip: !isLoggedIn });

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
      return;
    }
    if (subscription?.slug === activeSubscription?.slug && addOns?.length > 0) {
      checkOut({ slugs: addOns?.map((item: AddOn) => item.slug) });
      return;
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

  return (
    <>
      <div className="rounded-lg border p-4">
        <h2 className="pb-2 text-lg font-medium">Coupon</h2>
        <hr className=" text-lg font-bold" />
        <CouponForm />
        {activeSubscription?.slug && activeSubscription?.slug !== 'trial' && <OrderBalance />}
        {subscription?.slug === activeSubscription?.slug && addOns?.length > 0 && (
          <div>
            <h2 className="pb-2 text-lg font-medium">Add-Ons</h2>
            <hr className="p-2 text-lg font-bold" />
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
            {stripeInfo?.taxStatus === 'on' && subscription?.slug !== 'trial' && (
              <div className="mb-2 flex justify-between">
                <span>
                  <span className="font-semibold">{stripeInfo?.taxTitle}</span> ({stripeInfo?.taxCost}%)
                </span>
                <span className="text-red-500">{tax.toFixed(2)} CAD</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-red-500">{Math.abs(total).toFixed(2)} CAD</span>
            </div>
          </div>
        )}
        {subscription?.slug !== activeSubscription?.slug && <PlanAddOns stripeInfo={stripeInfo} />}
        {subscription?.slug === activeSubscription?.slug && addOns?.length === 0 && (
          <div className="py-4 text-center font-medium text-red-500">Your cart is currently empty. Select a plan!</div>
        )}
      </div>
      {total > 0 && subscription?.slug !== activeSubscription?.slug && (
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
      {subscription?.slug === activeSubscription?.slug && addOns?.length > 0 ? (
        <Button
          disabled={false}
          color="danger"
          text="Checkout Confirm"
          className="mt-5 w-full"
          isSubmitting={checkOutLoading}
          onClick={handleCheckOut}
          postIcon={<BsCheck2Circle className="text-base" />}
        />
      ) : (
        <Button
          disabled={subscription?.slug === activeSubscription?.slug ? true : false}
          color="danger"
          text="Checkout Confirm"
          className="mt-5 w-full"
          isSubmitting={checkOutLoading}
          onClick={handleCheckOut}
          postIcon={<BsCheck2Circle className="text-base" />}
        />
      )}

      <LoginAlert modalState={modalState} setModalState={setModalState} />
    </>
  );
}

// 'use client';

// import Button from '@/components/Formik/Button';
// import { routes } from '@/config/routes';
// import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
// import { setValue } from '@/features/auth/authSlice';
// import { RootState } from '@/features/store';
// import { setPlanChangeCost, setTaxPercentage, setTaxStatus } from '@/features/subscription/subscriptionSlice';
// import { useCreateCheckOutMutation } from '@/features/super-admin/subscription/subscriptionApi';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { BsCheck2Circle } from 'react-icons/bs';
// import { useDispatch, useSelector } from 'react-redux';
// import CouponForm from './CouponForm';
// import LoginAlert from './LoginAlert';
// import OrderBalance from './OrderBalance';
// import OrderSummaryDetails from './OrderSummaryDetails';
// import PlanAddOns from './PlanAddons';

// const OrderSummary = ({ stripeInfo }: any) => {
//   const { push } = useRouter();
//   const dispatch = useDispatch();
//   const { data: session, update }: any = useSession();
//   const [modalState, setModalState] = useState(false);
//   const { subscription, addOns, total, activeSubscription, remainingBalance, code } = useSelector(
//     (state: RootState) => state.subscriptionSlice
//   );
//   const { isLoggedIn, user } = useSelector((state: RootState) => state.authSlice);

//   const subSlugs = [subscription?.slug, ...addOns?.map((item: any) => item.slug)];
//   const [checkOut, { data: checkOutResponse, isLoading: checkOutLoading, error: checkoutError }] = useCreateCheckOutMutation();
//   const { data: profile, isSuccess: profileSuccess, refetch } = useRetailerGetProfileQuery(null, { skip: !isLoggedIn });
//   useEffect(() => {
//     dispatch(setPlanChangeCost(stripeInfo?.planChangeCost));
//     dispatch(setTaxPercentage(stripeInfo?.taxCost));
//     dispatch(setTaxStatus(stripeInfo?.taxStatus));
//   }, [dispatch, stripeInfo?.planChangeCost, stripeInfo?.taxCost, stripeInfo?.taxStatus]);

//   useEffect(() => {
//     if (checkOutResponse) {
//       if (subscription?.slug === 'trial') {
//         toast.success('Free trial activated!');
//         update({ ...session?.user, ...checkOutResponse?.data });
//         dispatch(
//           setValue({
//             target: 'user',
//             value: { ...user, ...profile?.data },
//           })
//         );
//         push(routes.retailer.dashboard);
//       } else {
//         push(checkOutResponse.data.url);
//       }
//     }
//   }, [checkOutResponse, push, subscription, profileSuccess, session, update, user, profile?.data, dispatch]);

//   const handleCheckOut = () => {
//     if (!isLoggedIn) {
//       setModalState(true);
//     }
//     if (subSlugs.length > 0) {
//       checkOut({ slugs: subSlugs, code });
//     }
//   };

//   return (
//     <>
//       <div className="rounded-lg border p-4">
//         <h2 className="pb-2 text-lg font-medium">Coupon</h2>
//         <hr className="text-lg font-bold" />
//         <CouponForm />
//         <OrderBalance />
//         <PlanAddOns stripeInfo={stripeInfo} />
//         <OrderSummaryDetails stripeInfo={stripeInfo} />
//       </div>
//       {total > 0 && (
//         <div className="mt-3 rounded-lg border p-4">
//           <h2 className=" text-lg font-medium">We will be return {Math.abs(total).toFixed(2)} CAD</h2>
//         </div>
//       )}
//       {Math.abs(total) < 1 && activeSubscription?.slug && activeSubscription?.slug !== 'trial' && (
//         <div className="my-3 border-l-4 border-yellow-400 bg-yellow-50 p-4">
//           <p className="font-medium text-yellow-500">Upgrade or downgrade plan</p>
//           <p className="text-yellow-500">Your order needs to be at least 1 CAD. Please add more items to continue</p>
//         </div>
//       )}
//       <Button
//         disabled={session?.user?.plan == subscription?.slug}
//         color="danger"
//         text="Checkout Confirm"
//         className="mt-5 w-full"
//         isSubmitting={checkOutLoading}
//         onClick={handleCheckOut}
//         postIcon={<BsCheck2Circle className="text-base" />}
//       />
//       <LoginAlert modalState={modalState} setModalState={setModalState} />
//     </>
//   );
// };

// export default OrderSummary;
