// OrderSummaryDetails.tsx
'use client';

import { RootState } from '@/features/store';
import { removeCoupon } from '@/features/subscription/subscriptionSlice';
import { ImBin } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';

const OrderSummaryDetails = ({ stripeInfo }: { stripeInfo: any }) => {
  const dispatch = useDispatch();
  const { coupon, couponDiscount, subTotal, total, tax } = useSelector((state: RootState) => state.subscriptionSlice);

  return (
    <>
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
    </>
  );
};

export default OrderSummaryDetails;
