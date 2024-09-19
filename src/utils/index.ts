import { activeSubscription } from '@/features/subscription/subscriptionSlice';
import { AddOn, Subscription } from '@/types';
import moment from 'moment';

export const countDaysLeft = (date: Date) => {
  var now = moment();
  var inputDate = moment(date);
  var difference = inputDate.diff(now, 'days');
  return difference;
};

export const calculateBalancePrice = (startDate: Date, expirationDate: Date, planPrice: number) => {
  const start = new Date(startDate);
  const end = new Date(expirationDate);
  const today = new Date(); /* '2024-07-28T10:16:45.281+00:00' */

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    throw 'Invalid start date or expiration date !';
  }

  const totalDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const elapsedDuration = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  // Ensure the elapsed duration is not negative or exceeding the total duration
  const effectiveElapsedDuration = Math.min(Math.max(elapsedDuration, 0), totalDuration);
  const consumedPrice = (effectiveElapsedDuration / totalDuration) * planPrice;

  return planPrice - consumedPrice;
  // return parseFloat(consumedPrice.toFixed(2)); // Return the consumed price rounded to 2 decimal places
};

export const checkedMinPurchaseAmount = (total: number, minPurchaseAmount: number) => {
  if (typeof total !== 'number' || typeof minPurchaseAmount !== 'number') {
    throw 'Invalid total or minPurchaseAmount !';
  }

  return parseFloat(total.toFixed(2)) >= minPurchaseAmount ? true : false;
};

export const isCheckoutButtonDisabled = ({
  plan,
  activePlan,
  addOn,
  isLoggedIn,
  hasPurchasePlan,
  planChangeType,
  total,
  refundableThreshold,
}: {
  plan: Subscription;
  isLoggedIn: boolean;
  hasPurchasePlan: boolean;
  activePlan: activeSubscription;
  addOn: AddOn;
  planChangeType: string;
  total: number;
  refundableThreshold: number;
}) => {
  // if (!plan?.slug || activePlan?.slug === plan?.slug) {
  //   if (plan?.slug && plan?.slug !== 'trial' && plan?.slug === activePlan?.slug) {
  //     return false;
  //   }
  //   return true;
  // }
  if (isLoggedIn) {
    if (hasPurchasePlan) {
      if (plan?.slug === activePlan?.slug && !addOn?.slug) {
        return true;
      }
      if (Math.abs(total) < refundableThreshold && activePlan?.slug && activePlan?.slug !== 'trial' && planChangeType !== 'downgrade') {
        return true;
      }
      if (Math.abs(total) < refundableThreshold && !planChangeType && plan?.slug !== 'trial') {
        return true;
      }
      return false;
    } else {
      return !plan?.slug && !addOn?.slug;
    }
  } else {
    return !plan?.slug;
  }
};

export const isCheckCouponDisabled = ({
  subscription,
  activeSubscription,
  coupon,
  isLoggedIn,
  addOn,
  planChangeType,
}: {
  subscription: Subscription;
  activeSubscription: activeSubscription;
  coupon: any;
  addOn: AddOn;
  isLoggedIn: boolean;
  planChangeType: string;
}) => {
  if (!isLoggedIn) {
    return true;
  }
  if (
    activeSubscription?.slug == subscription?.slug ||
    subscription?.slug === 'trial' ||
    coupon ||
    planChangeType === 'downgrade' ||
    addOn?.slug
  ) {
    return true;
  }

  return false;
};

export const hasCheckedPurchaseAlert = ({
  subscription,
  activeSubscription,
  total,
  refundableThreshold,
}: {
  subscription: Subscription;
  activeSubscription: activeSubscription;
  total: number;
  refundableThreshold: number;
}) => {
  if (
    Math.abs(total) < refundableThreshold &&
    subscription?.slug &&
    activeSubscription?.slug &&
    subscription?.slug !== activeSubscription?.slug &&
    activeSubscription?.slug !== 'trial'
  ) {
    return true;
  }
  if (
    subscription?.slug &&
    subscription?.slug !== activeSubscription?.slug &&
    subscription?.slug !== 'trial' &&
    Math.abs(total) < refundableThreshold
  ) {
    return true;
  }
  return false;
};

export const calculateCurrencyExchangeRate = ({
  selectedCurrencyExchangeRate,
  defaultCurrencyExchangeRate = { name: 'CAD', exchangeRate: 1 },
  price,
}: {
  selectedCurrencyExchangeRate: any;
  defaultCurrencyExchangeRate?: any;
  price: number;
}) => {
  return Number(((selectedCurrencyExchangeRate?.exchangeRate / defaultCurrencyExchangeRate?.exchangeRate) * price).toFixed(2));
};
