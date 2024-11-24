// PlanAddOns.tsx
'use client';

import { RootState } from '@/features/store';
import { removeAddOns, removeCode, removeCoupon } from '@/features/subscription/subscriptionSlice';
import { AddOn } from '@/types';
import { calculateCurrencyExchangeRate } from '@/utils';
import { useTranslations } from 'next-intl';
import { ImBin } from 'react-icons/im';
import { useDispatch, useSelector } from 'react-redux';

const PlanAddOns = ({ stripeInfo, selectedCurrency }: { stripeInfo: any; selectedCurrency: string }) => {
  const dispatch = useDispatch();
  const t = useTranslations('CheckoutPage');
  const {
    subscription,
    addOns,
    activeSubscription,
    remainingBalance,
    subTotal,
    total,
    code,
    tax,
    coupon,
    couponDiscount,
    planChangeCost,
    downgradeRefund,
    currency,
  } = useSelector((state: RootState) => state.subscriptionSlice);

  const remainingAmount = calculateCurrencyExchangeRate({
    selectedCurrencyExchangeRate: currency,
    defaultCurrencyExchangeRate: activeSubscription?.planPaymentCurrency,
    price: remainingBalance,
  }).toFixed(2);

  const handleRemoveAddOn = (addOnId: string) => {
    dispatch(removeAddOns(addOnId));
    if (code) {
      dispatch(removeCode());
      dispatch(removeCoupon());
    }
  };

  return (
    <div>
      <h2 className="pb-2 text-lg font-medium">{addOns?.length > 0 ? t('planAndAddons') : t('plan')}</h2>
      <hr className="p-2 text-lg font-bold" />
      <div className="mb-2 flex justify-between">
        <span>
          {subscription?.title}
          {coupon?.appliedSlugs?.includes(subscription?.slug) && (
            <span>{` (${coupon?.discountType === 'percentage' ? `${coupon?.discount}%` : coupon?.discount} off)`}</span>
          )}
        </span>
        <span className="text-red-500">
          {subscription?.price ? `${subscription?.price?.toFixed(2)}` : Number(0).toFixed(2)} {selectedCurrency}
        </span>
      </div>
      {addOns?.length > 0 && (
        <div>
          {addOns.map((addOn: AddOn, index: number) => (
            <div key={index} className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
              <span className="col-span-6">
                {addOn.title}{' '}
                {coupon?.appliedSlugs?.includes(addOn?.slug) && (
                  <span>{` (${coupon?.discountType === 'percentage' ? `${coupon?.discount}%` : coupon?.discount} off)`}</span>
                )}
              </span>
              <button onClick={() => handleRemoveAddOn(addOn._id)} className="col-span-2 text-red-500">
                <ImBin />
              </button>
              <span className="col-span-4 justify-self-end text-red-500">
                {addOn?.price ? addOn?.price?.toFixed(2) : Number(0).toFixed(2)} {selectedCurrency}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="mb-2 flex justify-between">
        <span className="font-semibold">{t('subtotal')}</span>
        <span className="text-red-500">
          {Math.abs(subTotal).toFixed(2)} {selectedCurrency}
        </span>
      </div>
      <hr className="p-2 text-lg font-bold" />
      {stripeInfo?.taxStatus === 'on' && subscription?.slug !== 'trial' && downgradeRefund <= 0 && total !== 0 && (
        <div className="mb-2 flex justify-between">
          <span>
            <span className="font-semibold">{stripeInfo?.taxTitle}</span> ({stripeInfo?.taxCost}%)
          </span>
          <span className="text-red-500">
            {tax.toFixed(2)} {selectedCurrency}
          </span>
        </div>
      )}

      {activeSubscription?.slug && activeSubscription?.slug !== 'trial' && (
        <div className="mb-2 flex justify-between">
          <span>{t('remainingAmount')}</span>
          <span className="text-red-500">
            -{remainingAmount ? remainingAmount : 0}
            {` ${selectedCurrency}`}
          </span>
        </div>
      )}

      {activeSubscription?.slug && activeSubscription?.slug !== 'trial' && downgradeRefund <= 0 && total !== 0 && (
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">{t('planChangeCost')}</span>
          <span className="text-red-500">
            {calculateCurrencyExchangeRate({ selectedCurrencyExchangeRate: currency, price: stripeInfo?.planChangeCost })}
            {` ${selectedCurrency}`}
          </span>
        </div>
      )}

      {coupon && (
        <div className="mb-2 grid w-full grid-cols-12 items-center gap-x-3">
          <span className="col-span-7">
            <span className="font-semibold">{t('coupon')}:</span>{' '}
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
          <span className="col-span-4 justify-self-end text-red-500">
            {`-${couponDiscount?.toFixed(2)}`} {selectedCurrency}
          </span>
        </div>
      )}

      <div className="flex justify-between text-xl font-bold">
        <span>{t('total')}</span>
        <span className="text-red-500">
          {Math.abs(total).toFixed(2)} {selectedCurrency}
        </span>
      </div>
    </div>
  );
};

export default PlanAddOns;
