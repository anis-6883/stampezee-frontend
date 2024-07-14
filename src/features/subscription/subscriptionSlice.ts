// import { calculateBalancePrice } from '@/utils';
// import { createSlice } from '@reduxjs/toolkit';

// const initialState: any = {
//   subscription: {
//     // _id: '6667f260136c8cd72c7af8a2',
//     // title: 'Pro',
//     // slug: 'pro',
//     // descriptions: ['Benefit 1', 'Benefit 2', 'tests', 'testse'],
//     // price: 19.99,
//     // duration: 30,
//     // type: 'subscription',
//     // limit: 10,
//     // allowTotalBranch: 5,
//     // allowTotalTeamMember: 5,
//     // image: null,
//     // status: true,
//   },
//   activeSubscription: {},
//   addOns: [],
//   coupon: null,
//   subTotal: 0,
//   total: 0,
//   couponDiscount: 0,
//   tax: 10,
//   upgradeCost: 0,
//   downgradeRefund: 0,
//   remainingBalance: 0,
// };

// const subscriptionSlice = createSlice({
//   name: 'subscription',
//   initialState,
//   reducers: {
//     setSubscription: (state, action) => {
//       if (state?.activeSubscription?.slug) {
//         const remainingAmount = calculateBalancePrice(
//           state?.activeSubscription?.planStartAt,
//           state?.activeSubscription?.planValidAt,
//           state?.activeSubscription?.price
//         );
//         state.remainingBalance = remainingAmount;
//       }
//       state.subscription = action.payload;
//       calculateSubTotal(state);
//     },
//     setActiveSubscription: (state, action) => {
//       state.activeSubscription = action.payload;
//     },
//     setAddOns: (state, action) => {
//       const newAddOns = state.addOns.find((item: any) => item._id === action.payload._id);
//       if (newAddOns) {
//         state.addOns = state.addOns.filter((item: any) => item._id !== newAddOns?._id);
//       } else {
//         state.addOns.push({ ...action.payload, isAddOnsSelect: true });
//       }
//       calculateSubTotal(state);
//     },
//     resetAddOns: (state) => {
//       state.addOns = [];
//       calculateSubTotal(state);
//     },
//     removeAddOns: (state, action) => {
//       state.addOns = state.addOns.filter((item: any) => item._id !== action.payload);
//       calculateSubTotal(state);
//     },
//     applyCoupon: (state, action) => {
//       state.coupon = action.payload;
//       calculateDiscount(state);
//       calculateSubTotal(state);
//     },
//     removeCoupon: (state) => {
//       state.coupon = null;
//       state.couponDiscount = 0;
//       calculateSubTotal(state);
//     },
//     upgradePlan: (state, action) => {
//       const targetPlan = action.payload;
//       const upgradeCost = calculateUpgradeCost(state, targetPlan);
//       state.subscription = targetPlan;
//       state.upgradeCost = upgradeCost;
//       calculateSubTotal(state, 'upgrade');
//     },
//     downgradePlan: (state, action) => {
//       const targetPlan = action.payload;
//       const downgradeRefund = calculateDowngradeRefund(state, targetPlan);
//       state.subscription = targetPlan;
//       state.downgradeRefund = downgradeRefund;
//       calculateSubTotal(state, 'downgrade');
//     },
//   },
// });

// const calculateSubTotal = (state: any, planType?: string) => {
//   const planPrice = state.subscription ? state.subscription.price : 0;
//   const addOnsPrice = state.addOns.reduce((total: number, addOn: any) => total + addOn.price, 0);
//   let subTotal = 0;
//   if (planType === 'upgrade') {
//     subTotal = planPrice + state?.activeSubscription?.planSwitchCharge + addOnsPrice - state.couponDiscount;
//     state.subTotal = state.remainingBalance - subTotal;
//     state.total = state.remainingBalance - (subTotal + state.tax);
//   } else if (planType === 'downgrade') {
//     subTotal = planPrice + state?.activeSubscription?.planSwitchCharge + addOnsPrice - state.couponDiscount;
//     state.subTotal = state.remainingBalance - subTotal;
//     state.total = state.remainingBalance - (subTotal + state.tax);
//   } else {
//     if (state?.activeSubscription?.slug !== 'trial') {
//       subTotal = planPrice + state?.activeSubscription?.planSwitchCharge + addOnsPrice - state.couponDiscount;
//       state.subTotal = state.remainingBalance - subTotal;
//       state.total = state.remainingBalance - (subTotal + state.tax);
//     } else {
//       if (state?.subscription?.slug === 'trial') {
//         state.total = state.remainingBalance - (planPrice + addOnsPrice - state.couponDiscount);
//       } else {
//         state.total = state.remainingBalance - (planPrice + addOnsPrice + state.tax - state.couponDiscount);
//       }
//       state.subTotal = planPrice + addOnsPrice - state.couponDiscount;
//     }
//   }
// };

// const calculateDiscount = (state: any) => {
//   if (state.coupon) {
//     if (state.coupon.discountType === 'percentage') {
//       state.couponDiscount = (Math.abs(state.subTotal) * state.coupon.discount) / 100;
//     } else {
//       state.couponDiscount = state.coupon.discount;
//     }
//   }
// };

// const calculateUpgradeCost = (state: any, targetPlan: any) => {
//   const remainingAmount = calculateBalancePrice(
//     state?.activeSubscription?.planStartAt,
//     state?.activeSubscription?.planValidAt,
//     state?.activeSubscription?.price
//   );
//   state.remainingBalance = remainingAmount;
//   const upgradeCost = targetPlan.price - remainingAmount;
//   return upgradeCost;
// };

// const calculateDowngradeRefund = (state: any, targetPlan: any) => {
//   const remainingAmount = calculateBalancePrice(
//     state?.activeSubscription?.planStartAt,
//     state?.activeSubscription?.planValidAt,
//     state?.activeSubscription?.price
//   );
//   state.remainingBalance = remainingAmount;
//   const downgradeRefund = remainingAmount - targetPlan.price;
//   return downgradeRefund;
// };

// export const {
//   setSubscription,
//   setActiveSubscription,
//   setAddOns,
//   removeAddOns,
//   resetAddOns,
//   applyCoupon,
//   removeCoupon,
//   upgradePlan,
//   downgradePlan,
// } = subscriptionSlice.actions;
// export default subscriptionSlice;

import { calculateBalancePrice } from '@/utils';
import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  subscription: {},
  activeSubscription: {},
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
};

// Helper functions
const calculateAddOnsPrice = (addOns: any[]) => {
  return addOns.reduce((total: number, addOn: any) => total + addOn.price, 0);
};

const calculateSubTotalAmount = (planPrice: number, addOnsPrice: number) => {
  return planPrice + addOnsPrice;
};

const calculateTotalAmount = (
  remainingBalance: number,
  subTotal: number,
  tax: number,
  planSwitchCharge: number,
  couponDiscount: number
) => {
  return remainingBalance + couponDiscount - (subTotal + tax + planSwitchCharge);
};

const calculateTaxAmount = (subTotal: number, taxPercentage: number) => {
  return (subTotal * taxPercentage) / 100;
};

const updateBalance = (state: any) => {
  if (state?.activeSubscription?.slug) {
    state.remainingBalance = calculateBalancePrice(
      state?.activeSubscription?.planStartAt,
      state?.activeSubscription?.planValidAt,
      state?.activeSubscription?.price
    );
  }
};

const calculateTax = (state: any) => {
  state.tax = calculateTaxAmount(Math.abs(state.subTotal), state.taxPercentage);
};

const calculateDiscount = (state: any) => {
  if (state.coupon) {
    state.couponDiscount =
      state.coupon.discountType === 'percentage' ? (Math.abs(state.total) * state.coupon.discount) / 100 : state.coupon.discount;
  }
};

const calculateUpgradeCost = (state: any, targetPlan: any) => {
  updateBalance(state);
  return targetPlan.price - state.remainingBalance;
};

const calculateDowngradeRefund = (state: any, targetPlan: any) => {
  updateBalance(state);
  return state.remainingBalance - targetPlan.price;
};

const calculateSubTotal = (state: any, planType?: string) => {
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
    if (state?.activeSubscription?.slug === state?.subscription?.slug && state?.addOns?.length > 0) {
      state.subTotal = addOnsPrice;
      if (state.taxStatus === 'on') {
        calculateTax(state);
      }
      state.total = state.subTotal + state.tax - couponDiscount;
    } else {
      subTotal = calculateSubTotalAmount(planPrice, addOnsPrice);
      state.subTotal = remainingBalance - subTotal;
      if (state.taxStatus === 'on') {
        calculateTax(state);
      }
      state.total = calculateTotalAmount(remainingBalance, subTotal, state.tax, planSwitchCharge, couponDiscount);
    }
  } else {
    state.subTotal = planPrice + addOnsPrice;
    if (state.taxStatus === 'on') {
      calculateTax(state);
    }
    state.total =
      state?.subscription?.slug === 'trial'
        ? remainingBalance - (planPrice + addOnsPrice - couponDiscount)
        : remainingBalance - (planPrice + addOnsPrice + state.tax - couponDiscount);
  }
};

// Redux slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      updateBalance(state);
      state.subscription = action.payload;
      calculateSubTotal(state);
    },
    setActiveSubscription: (state, action) => {
      state.activeSubscription = action.payload;
    },
    setPlanChangeCost: (state, action) => {
      state.planChangeCost = action.payload;
    },
    setCode: (state, action) => {
      state.code = action.payload;
    },
    setTaxPercentage: (state, action) => {
      state.taxPercentage = action.payload;
    },
    setTaxStatus: (state, action) => {
      state.taxStatus = action.payload;
    },
    setAddOns: (state, action) => {
      const newAddOn = state.addOns.find((item: any) => item._id === action.payload._id);
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
      state.upgradeCost = calculateUpgradeCost(state, action.payload);
      state.subscription = action.payload;
      calculateSubTotal(state, 'upgrade');
    },
    downgradePlan: (state, action) => {
      state.downgradeRefund = calculateDowngradeRefund(state, action.payload);
      state.subscription = action.payload;
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
  setTaxPercentage,
  setTaxStatus,
  setAddOns,
  setRemainingBalance,
  resetAddOns,
  removeAddOns,
  applyCoupon,
  removeCoupon,
  upgradePlan,
  downgradePlan,
  setCode,
  resetState,
} = subscriptionSlice.actions;

export default subscriptionSlice;
