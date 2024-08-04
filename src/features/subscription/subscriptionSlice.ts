import { AddOn, Coupon, Subscription } from '@/types';
import { calculateBalancePrice } from '@/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface activeSubscription extends Subscription {
  planStartAt?: Date;
  planValidAt?: Date;
  takeFreeTrial?: string;
  planPayment?: number;
}

interface SubscriptionState {
  subscription: Subscription;
  activeSubscription: activeSubscription;
  addOns: AddOn[];
  coupon: Coupon | null;
  code: string;
  subTotal: number;
  total: number;
  couponDiscount: number;
  tax: number;
  taxPercentage: number;
  taxStatus: 'on' | 'off';
  upgradeCost: number;
  downgradeRefund: number;
  remainingBalance: number;
  planChangeCost: number;
  planChangeType: string;
  refundableThreshold: number;
}

const initialState: SubscriptionState = {
  subscription: { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' },
  activeSubscription: { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' },
  addOns: [],
  coupon: null,
  code: '',
  subTotal: 0,
  total: 0,
  couponDiscount: 0,
  tax: 0,
  taxPercentage: 0,
  taxStatus: 'on',
  upgradeCost: 0,
  downgradeRefund: 0,
  remainingBalance: 0,
  planChangeCost: 1,
  planChangeType: '',
  refundableThreshold: 0,
};

// Helper functions

export const roundToTwoDecimals = (value: number) => {
  return parseFloat(value.toFixed(2));
};

const calculateAddOnsPrice = (addOns: AddOn[]) => {
  return roundToTwoDecimals(addOns.reduce((total: number, addOn: AddOn) => total + addOn.price, 0));
};

const calculateSubTotalAmount = (planPrice: number, addOnsPrice: number) => {
  return roundToTwoDecimals(planPrice + addOnsPrice);
};

const calculateTotalAmount = (
  remainingBalance: number,
  subTotal: number,
  tax: number,
  planSwitchCharge: number,
  couponDiscount: number
) => {
  return roundToTwoDecimals(remainingBalance + couponDiscount - (subTotal + tax + planSwitchCharge));
};

const calculateTaxAmount = (subTotal: number, taxPercentage: number) => {
  return roundToTwoDecimals((subTotal * taxPercentage) / 100);
};

const updateBalance = (state: SubscriptionState) => {
  if (state?.activeSubscription?.slug) {
    state.remainingBalance = roundToTwoDecimals(
      calculateBalancePrice(
        state?.activeSubscription?.planStartAt as Date,
        state?.activeSubscription?.planValidAt as Date,
        state?.activeSubscription?.planPayment as number
      )
    );
  }
};

const calculateTax = (state: SubscriptionState) => {
  if (state.taxStatus === 'on') {
    state.tax = calculateTaxAmount(Math.abs(state.subTotal), state.taxPercentage);
  }
};

const calculateDiscount = (state: SubscriptionState) => {
  if (state?.coupon && state?.subscription?.slug) {
    state.couponDiscount =
      state.coupon.discountType === 'percentage'
        ? roundToTwoDecimals((Math.abs(state?.subscription?.price) * state.coupon.discount) / 100)
        : roundToTwoDecimals(state.coupon.discount);
  }
};

const calculateUpgradeCost = (state: SubscriptionState, targetPlan: Subscription) => {
  updateBalance(state);
  return roundToTwoDecimals(targetPlan.price - state.remainingBalance);
};

const calculateDowngradeRefund = (state: SubscriptionState, targetPlan: Subscription) => {
  updateBalance(state);
  return roundToTwoDecimals(state.remainingBalance - targetPlan.price);
};

const calculateSubTotal = (state: SubscriptionState, planType?: string) => {
  const planPrice = state.subscription?.price || 0;
  const addOnsPrice = calculateAddOnsPrice(state.addOns);
  const planSwitchCharge = state?.planChangeCost || 0;
  const couponDiscount = state.couponDiscount || 0;
  const remainingBalance = state.remainingBalance || 0;
  let subTotal = 0;

  if (
    planType === 'upgrade' ||
    planType === 'downgrade' ||
    (state?.activeSubscription?.slug && state?.activeSubscription?.slug !== 'trial')
  ) {
    // when buy just addons
    if (state?.activeSubscription?.slug === state?.subscription?.slug && state?.addOns?.length > 0) {
      state.subTotal = addOnsPrice;
      calculateTax(state);
      state.total = state.subTotal + state.tax - couponDiscount;
    }
    // upgrade or downgrade
    else {
      subTotal = calculateSubTotalAmount(planPrice, addOnsPrice);
      state.subTotal = roundToTwoDecimals(remainingBalance - subTotal);
      calculateTax(state);
      // do not add tax when get refund
      state.total = calculateTotalAmount(remainingBalance, subTotal, state.subTotal > 0 ? 0 : state.tax, planSwitchCharge, couponDiscount);
    }
  }
  // when pick plans and addons at first time
  else {
    state.subTotal = planPrice + addOnsPrice;
    calculateTax(state);
    state.total =
      state?.subscription?.slug === 'trial'
        ? roundToTwoDecimals(remainingBalance - (planPrice + addOnsPrice - couponDiscount))
        : roundToTwoDecimals(remainingBalance - (planPrice + addOnsPrice + state.tax - couponDiscount));
  }
};

// Redux slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      if (state?.subscription?.slug === action?.payload?.slug) {
        if (state.activeSubscription?.slug) {
          state.subscription = state.activeSubscription;
        } else {
          state.subscription = { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' };
        }
      } else {
        state.subscription = action.payload;
      }
      updateBalance(state);
      calculateSubTotal(state);
    },
    setActiveSubscription: (state, action: PayloadAction<activeSubscription>) => {
      state.activeSubscription = action.payload;
    },
    setPlanChangeCost: (state, action: PayloadAction<number>) => {
      state.planChangeCost = action.payload;
    },
    setRefundableThreshold: (state, action: PayloadAction<number>) => {
      state.refundableThreshold = action.payload;
    },
    setCode: (state, action: PayloadAction<string>) => {
      state.code = action.payload;
    },
    setTaxPercentage: (state, action: PayloadAction<number>) => {
      state.taxPercentage = action.payload;
    },
    setTaxStatus: (state, action: PayloadAction<'on' | 'off'>) => {
      state.taxStatus = action.payload;
    },
    setAddOns: (state, action: PayloadAction<AddOn>) => {
      const newAddOn: any = state.addOns.find((item: any) => item._id === action.payload._id);
      state.addOns = newAddOn
        ? state.addOns.filter((item: any) => item._id !== newAddOn._id)
        : [...state.addOns, { ...action.payload, isAddOnsSelect: true }];
      calculateSubTotal(state);
    },
    setRemainingBalance: (state) => {
      updateBalance(state);
    },
    resetAddOns: (state) => {
      state.addOns = [];
      calculateSubTotal(state);
    },
    removeAddOns: (state, action: PayloadAction<string>) => {
      state.addOns = state.addOns.filter((item: any) => item._id !== action.payload);
      calculateSubTotal(state);
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
      calculateDiscount(state);
      calculateSubTotal(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.couponDiscount = 0;
      calculateSubTotal(state);
    },
    removeCode: (state) => {
      state.code = '';
    },
    upgradePlan: (state, action: PayloadAction<Subscription>) => {
      state.upgradeCost = calculateUpgradeCost(state, action.payload);
      state.planChangeType = 'upgrade';
      if (state?.subscription?.slug === action?.payload?.slug) {
        if (state.activeSubscription?.slug) {
          state.subscription = state.activeSubscription;
        } else {
          state.subscription = { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' };
        }
      } else {
        state.subscription = action.payload;
      }
      calculateSubTotal(state, 'upgrade');
    },
    downgradePlan: (state, action: PayloadAction<Subscription>) => {
      state.downgradeRefund = calculateDowngradeRefund(state, action.payload);
      state.planChangeType = 'downgrade';
      if (state?.subscription?.slug === action?.payload?.slug) {
        if (state.activeSubscription?.slug) {
          state.subscription = state.activeSubscription;
        } else {
          state.subscription = { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' };
        }
      } else {
        state.subscription = action.payload;
      }
      calculateSubTotal(state, 'downgrade');
    },
    resetState: (state) => {
      const { planChangeCost, taxPercentage, taxStatus } = state;
      Object.assign(state, initialState, { planChangeCost, taxPercentage, taxStatus });
    },
  },
});

export const {
  setSubscription,
  setActiveSubscription,
  setPlanChangeCost,
  setRefundableThreshold,
  setTaxPercentage,
  setTaxStatus,
  setAddOns,
  setRemainingBalance,
  resetAddOns,
  removeAddOns,
  applyCoupon,
  removeCoupon,
  removeCode,
  upgradePlan,
  downgradePlan,
  setCode,
  resetState,
} = subscriptionSlice.actions;

export default subscriptionSlice;
