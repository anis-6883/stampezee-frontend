// PlanAddOns.tsx
'use client';

import { RootState } from '@/features/store';
import { removeAddOns, removeCode, removeCoupon } from '@/features/subscription/subscriptionSlice';
import { ImBin } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';

const PlanAddOns = ({ stripeInfo, selectedCurrency }: { stripeInfo: any; selectedCurrency: string }) => {
  const dispatch = useDispatch();
  const { subscription, addOn, activeSubscription, remainingBalance, subTotal, total, tax, coupon, couponDiscount } = useSelector(
    (state: RootState) => state.subscriptionSlice
  );

  const { currency, defaultCurrency } = useSelector((state: RootState) => state.subscriptionSlice);

  const handleRemoveAddOn = (addOnId: string) => {
    dispatch(removeAddOns(addOnId));
  };

  return (
    <div>
      <h2 className="pb-2 text-lg font-medium">{addOn.slug ? 'Add-On' : 'Plan'}</h2>
      <hr className="p-2 text-lg font-bold" />
      {addOn.slug ? (
        <div className="mb-2 flex justify-between">
          <span>{addOn?.title}</span>
          <span className="text-red-500">
            {addOn?.price ? addOn?.price?.toFixed(2) : 0} {selectedCurrency}
          </span>
        </div>
      ) : (
        <div className="mb-2 flex justify-between">
          <span>{subscription?.title}</span>
          <span className="text-red-500">
            {subscription?.price ? subscription?.price?.toFixed(2) : 0} {selectedCurrency}
          </span>
        </div>
      )}

      {activeSubscription?.slug && activeSubscription?.slug !== 'trial' && !addOn.slug && (
        <div className="mb-2 flex justify-between">
          <span>Remaining Amount</span>
          <span className="text-red-500">
            -{remainingBalance.toFixed(2)} {selectedCurrency}
          </span>
        </div>
      )}

      <div className="mb-2 flex justify-between">
        <span className="font-semibold">Subtotal</span>
        <span className="text-red-500">
          {Math.abs(subTotal).toFixed(2)} {selectedCurrency}
        </span>
      </div>
      <hr className="p-2 text-lg font-bold" />
      {stripeInfo?.taxStatus === 'on' && subscription?.slug !== 'trial' && (
        <div className="mb-2 flex justify-between">
          <span>
            <span className="font-semibold">{stripeInfo?.taxTitle}</span> ({stripeInfo?.taxCost}%)
          </span>
          <span className="text-red-500">
            {tax.toFixed(2)} {selectedCurrency}
          </span>
        </div>
      )}

      {activeSubscription?.slug && activeSubscription?.slug !== 'trial' && !addOn.slug && (
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Plan Change Cost</span>
          <span className="text-red-500">
            {stripeInfo?.planChangeCost} {selectedCurrency}
          </span>
        </div>
      )}

      {coupon && (
        <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
          <span className="col-span-7">
            <span className="font-semibold">Coupon:</span>{' '}
            {`${coupon?.title.length > 10 ? `${coupon?.title.slice(0, 10)}...` : coupon?.title} ${coupon?.discountType === 'percentage' ? `(${coupon?.discount}%)` : ''}`}
          </span>
          <button
            onClick={() => {
              dispatch(removeCoupon());
              dispatch(removeCode());
            }}
            className="col-span-1 text-red-500"
          >
            <ImBin />
          </button>
          <span className="col-span-4 justify-self-end">
            {coupon?.discountType === 'percentage' ? `-${couponDiscount?.toFixed(2)}` : `-${coupon?.discount}`} {selectedCurrency}
          </span>
        </div>
      )}

      <div className="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span className="text-red-500">
          {Math.abs(total).toFixed(2)} {selectedCurrency}
        </span>
      </div>
    </div>
  );
};

export default PlanAddOns;
