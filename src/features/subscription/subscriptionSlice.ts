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
  addOns: [],
  coupon: null,
  subTotal: 0,
  couponDiscount: 0,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      state.subscription = action.payload;
      calculateSubTotal(state);
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
  },
});

const calculateSubTotal = (state: any) => {
  const planPrice = state.subscription ? state.subscription.price : 0;
  const addOnsPrice = state.addOns.reduce((total: number, addOn: any) => total + addOn.price, 0);
  state.subTotal = planPrice + addOnsPrice - state.couponDiscount;
};

const calculateDiscount = (state: any) => {
  if (state.coupon) {
    if (state.coupon.discountType === 'percentage') {
      state.couponDiscount = (state.subTotal * state.coupon.discount) / 100;
    } else {
      state.couponDiscount = state.coupon.discount;
    }
  }
};

export const calculateConsumedPrice = (startDate: Date, expirationDate: Date, planPrice: number) => {
  const start = new Date(startDate);
  const end = new Date(expirationDate);
  // const today = new Date('2024-07-23T10:16:45.281+00:00');

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    throw 'Invalid start date or expiration date !';
  }

  const totalDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  const elapsedDuration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  // Ensure the elapsed duration is not negative or exceeding the total duration
  const effectiveElapsedDuration = Math.min(Math.max(elapsedDuration, 0), totalDuration);
  const consumedPrice = (effectiveElapsedDuration / totalDuration) * planPrice;

  return Math.abs(consumedPrice);

  // return parseFloat(consumedPrice.toFixed(2)); // Return the consumed price rounded to 2 decimal places
};

export const { setSubscription, setAddOns, removeAddOns, resetAddOns, applyCoupon, removeCoupon } = subscriptionSlice.actions;
export default subscriptionSlice;
