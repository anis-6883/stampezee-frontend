import { calculateBalancePrice } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  subscription: {
    // _id: '6667f260136c8cd72c7af8a2',
    // title: 'Pro',
    // slug: 'pro',
    // descriptions: ['Benefit 1', 'Benefit 2', 'tests', 'testse'],
    // price: 19.99,
    // duration: 30,
    // type: 'subscription',
    // limit: 10,
    // allowTotalBranch: 5,
    // allowTotalTeamMember: 5,
    // image: null,
    // status: true,
  },
  activeSubscription: {},
  addOns: [],
  coupon: null,
  subTotal: 0,
  couponDiscount: 0,
  upgradeCost: 0,
  downgradeRefund: 0,
  remainingBalance: 0,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      if (state?.activeSubscription?.slug) {
        const remainingAmount = calculateBalancePrice(
          state?.activeSubscription?.planStartAt,
          state?.activeSubscription?.planValidAt,
          state?.activeSubscription?.price
        );
        state.remainingBalance = remainingAmount;
      }
      state.subscription = action.payload;
      calculateSubTotal(state);
    },
    setActiveSubscription: (state, action) => {
      state.activeSubscription = action.payload;
    },
    setAddOns: (state, action) => {
      const newAddOns = state.addOns.find((item: any) => item._id === action.payload._id);
      if (newAddOns) {
        state.addOns = state.addOns.filter((item: any) => item._id !== newAddOns?._id);
      } else {
        state.addOns.push({ ...action.payload, isAddOnsSelect: true });
      }
      calculateSubTotal(state);
    },
    resetAddOns: (state) => {
      state.addOns = [];
      calculateSubTotal(state);
    },
    removeAddOns: (state, action) => {
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
    upgradePlan: (state, action) => {
      const targetPlan = action.payload;
      const upgradeCost = calculateUpgradeCost(state, targetPlan);
      state.subscription = targetPlan;
      state.upgradeCost = upgradeCost;
      calculateSubTotal(state, 'upgrade');
    },
    downgradePlan: (state, action) => {
      const targetPlan = action.payload;
      const downgradeRefund = calculateDowngradeRefund(state, targetPlan);
      state.subscription = targetPlan;
      state.downgradeRefund = downgradeRefund;
      calculateSubTotal(state, 'downgrade');
    },
  },
});

const calculateSubTotal = (state: any, planType?: string) => {
  const planPrice = state.subscription ? state.subscription.price : 0;
  const addOnsPrice = state.addOns.reduce((total: number, addOn: any) => total + addOn.price, 0);
  if (planType === 'upgrade') {
    state.subTotal = state.remainingBalance - (planPrice + 1 + addOnsPrice - state.couponDiscount);
  } else if (planType === 'downgrade') {
    state.subTotal = state.remainingBalance - (planPrice + 1 + addOnsPrice - state.couponDiscount);
  } else {
    state.subTotal = state.remainingBalance - (planPrice + addOnsPrice - state.couponDiscount);
  }
};

const calculateDiscount = (state: any) => {
  if (state.coupon) {
    if (state.coupon.discountType === 'percentage') {
      state.couponDiscount = (Math.abs(state.subTotal) * state.coupon.discount) / 100;
    } else {
      state.couponDiscount = state.coupon.discount;
    }
  }
};

const calculateUpgradeCost = (state: any, targetPlan: any) => {
  const remainingAmount = calculateBalancePrice(
    state?.activeSubscription?.planStartAt,
    state?.activeSubscription?.planValidAt,
    state?.activeSubscription?.price
  );
  state.remainingBalance = remainingAmount;
  const upgradeCost = targetPlan.price - remainingAmount;
  return upgradeCost;
};

const calculateDowngradeRefund = (state: any, targetPlan: any) => {
  const remainingAmount = calculateBalancePrice(
    state?.activeSubscription?.planStartAt,
    state?.activeSubscription?.planValidAt,
    state?.activeSubscription?.price
  );
  state.remainingBalance = remainingAmount;
  const downgradeRefund = remainingAmount - targetPlan.price;
  return downgradeRefund;
};

export const {
  setSubscription,
  setActiveSubscription,
  setAddOns,
  removeAddOns,
  resetAddOns,
  applyCoupon,
  removeCoupon,
  upgradePlan,
  downgradePlan,
} = subscriptionSlice.actions;
export default subscriptionSlice;
