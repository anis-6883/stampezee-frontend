import { AddOn, Coupon, Subscription } from '@/types';
import { calculateBalancePrice, calculateCurrencyExchangeRate } from '@/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface activeSubscription extends Subscription {
  planStartAt?: Date;
  planValidAt?: Date;
  takeFreeTrial?: string;
  planPayment?: number;
  planPaymentCurrency?: any;
}

export interface Currency {
  name: string;
  exchangeRate: number;
}

interface SubscriptionState {
  subscription: Subscription;
  activeSubscription: activeSubscription;
  addOn: AddOn;
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
  currency: Currency;
  defaultCurrency: Currency;
  subscriptionType: string;
}

const initialState: SubscriptionState = {
  subscription: { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' },
  activeSubscription: { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' },
  addOn: { _id: '', title: '', price: 0, descriptions: [], slug: '' },
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
  currency: { name: 'CAD', exchangeRate: 1 },
  defaultCurrency: { name: 'CAD', exchangeRate: 1 },
  subscriptionType: '',
};

// Helper functions

//Get Two Decimal Number
export const roundToTwoDecimals = (value: number) => {
  return parseFloat(value.toFixed(2));
};

const calculateTaxAmount = (subTotal: number, taxPercentage: number) => {
  return roundToTwoDecimals((subTotal * taxPercentage) / 100);
};

// Set Remaining Balance
const updateBalance = (state: SubscriptionState) => {
  // If Active Subscription have Then Update Remaining Balance
  if (state?.activeSubscription?.slug) {
    const remainingBalance = calculateBalancePrice(
      state?.activeSubscription?.planStartAt as Date,
      state?.activeSubscription?.planValidAt as Date,
      state?.activeSubscription?.planPayment as number
    );
    state.remainingBalance = roundToTwoDecimals(remainingBalance);
  }
};

const calculateTax = (state: SubscriptionState) => {
  if (state.taxStatus === 'on') {
    if (state.subscriptionType === 'plan') {
      state.tax = calculateTaxAmount(Math.abs(state?.subscription?.price), state.taxPercentage);
    } else {
      state.tax = calculateTaxAmount(Math.abs(state?.addOn?.price), state.taxPercentage);
    }
  }
};

const calculateDiscount = (state: SubscriptionState) => {
  if (state?.coupon && state?.subscription?.slug) {
    state.couponDiscount =
      state.coupon.discountType === 'percentage'
        ? roundToTwoDecimals((Math.abs(state?.subscription?.price) * state.coupon.discount) / 100)
        : roundToTwoDecimals(state.coupon.discount * state.currency?.exchangeRate);
  }
};

// Calculate Upgrade Cost
const calculateUpgradeCost = (state: SubscriptionState, targetPlan: Subscription) => {
  // Calculate Remaining Balance with Current Currency and Plan Payment Currency
  const remainingBalance =
    calculateCurrencyExchangeRate({
      selectedCurrencyExchangeRate: state.currency,
      defaultCurrencyExchangeRate: state.activeSubscription?.planPaymentCurrency,
      price: state.remainingBalance,
    }) || 0;
  return roundToTwoDecimals(targetPlan.price - remainingBalance);
};

// Calculate Downgrade Cost
const calculateDowngradeRefund = (state: SubscriptionState, targetPlan: Subscription) => {
  // Calculate Remaining Balance with Current Currency and Plan Payment Currency
  const remainingBalance =
    calculateCurrencyExchangeRate({
      selectedCurrencyExchangeRate: state.currency,
      defaultCurrencyExchangeRate: state.activeSubscription?.planPaymentCurrency,
      price: state.remainingBalance,
    }) || 0;
  const refundAmount = roundToTwoDecimals(remainingBalance - state.subscription.price);
  return refundAmount >= 0
    ? roundToTwoDecimals(remainingBalance - targetPlan.price)
    : roundToTwoDecimals(remainingBalance - (targetPlan.price + state.tax + state.planChangeCost));
};

// Calculate Total and SubTotal And Updated State
const calculateSubTotal = (state: SubscriptionState) => {
  const planPrice = state.subscription?.price || 0;
  const addOnsPrice = state?.addOn?.price;

  // Calculate Plan Change Cost with Current Currency
  const planSwitchCharge =
    calculateCurrencyExchangeRate({ selectedCurrencyExchangeRate: state.currency, price: state?.planChangeCost }) || 0;
  const couponDiscount = state.couponDiscount || 0;

  // Calculate Remaining Balance with Current Currency and Plan Payment Currency
  const remainingBalance =
    calculateCurrencyExchangeRate({
      selectedCurrencyExchangeRate: state.currency,
      defaultCurrencyExchangeRate: state.activeSubscription?.planPaymentCurrency,
      price: state.remainingBalance,
    }) || 0;

  // when select a addOn
  if (state.subscriptionType === 'addOn') {
    state.subTotal = addOnsPrice;
    calculateTax(state);
    state.total = state.subTotal + state.tax;
    state.downgradeRefund = 0;
  }

  // when select a plan
  if (state.subscriptionType === 'plan') {
    // upgrade or downgrade plan
    if (state.planChangeType === 'upgrade') {
      state.subTotal = Math.abs(roundToTwoDecimals(remainingBalance - planPrice));
      state.downgradeRefund = 0;
      calculateTax(state);
      state.total = roundToTwoDecimals(state.subTotal + state.tax + planSwitchCharge - couponDiscount);
    } else if (state.planChangeType === 'downgrade') {
      state.subTotal = Math.abs(roundToTwoDecimals(remainingBalance - planPrice));
      // downgrade and refundable
      const refundAmount = roundToTwoDecimals(remainingBalance - state.subscription.price);
      if (refundAmount >= 0) {
        state.total = roundToTwoDecimals(state.subTotal);
      }
      // downgrade and payment in stripe
      else {
        calculateTax(state);
        state.total = roundToTwoDecimals(state.subTotal + state.tax + planSwitchCharge);
      }
    }
    // when purchase a plan first time
    else {
      state.subTotal = planPrice;
      state.downgradeRefund = 0;
      calculateTax(state);
      state.total =
        state?.subscription?.slug === 'trial'
          ? roundToTwoDecimals(remainingBalance - (planPrice - couponDiscount))
          : roundToTwoDecimals(remainingBalance - (planPrice + state.tax - couponDiscount));
    }
  }
};

// Redux slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<Subscription>) => {
      // plan toggle handle
      if (state?.subscription?.slug === action?.payload?.slug) {
        if (state.activeSubscription?.slug) {
          state.subscription = state.activeSubscription;
        } else {
          state.subscription = { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' };
        }
      } else {
        state.subscription = action.payload;
      }
      state.subscriptionType = 'plan';
      updateBalance(state);
      calculateSubTotal(state);
      if (state?.coupon) {
        calculateDiscount(state);
        calculateSubTotal(state);
      }
    },
    resetSubscription: (state) => {
      state.subscription = { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' };
      updateBalance(state);
      // calculateSubTotal(state);
      if (state?.coupon) {
        calculateDiscount(state);
        calculateSubTotal(state);
      }
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
      // add-on toggle handle
      if (state.addOn.slug === action.payload.slug) {
        state.addOn = { _id: '', title: '', price: 0, descriptions: [], slug: '' };
      } else {
        state.addOn = action.payload;
      }
      state.subscriptionType = 'addOn';

      calculateSubTotal(state);
    },
    setRemainingBalance: (state) => {
      updateBalance(state);
    },
    setCurrency: (state, action: PayloadAction<Currency>) => {
      state.subscription = {
        ...state.subscription,
        price: calculateCurrencyExchangeRate({
          selectedCurrencyExchangeRate: action.payload,
          defaultCurrencyExchangeRate: state.currency,
          price: state?.subscription?.price,
        }),
      };
      state.addOn = {
        ...state.addOn,
        price: calculateCurrencyExchangeRate({
          selectedCurrencyExchangeRate: action.payload,
          defaultCurrencyExchangeRate: state.currency,
          price: state?.addOn?.price,
        }),
      };
      state.tax = calculateCurrencyExchangeRate({
        selectedCurrencyExchangeRate: action.payload,
        defaultCurrencyExchangeRate: state.currency,
        price: state.tax,
      });
      state.subTotal = calculateCurrencyExchangeRate({
        selectedCurrencyExchangeRate: action.payload,
        defaultCurrencyExchangeRate: state.currency,
        price: state.subTotal,
      });
      state.total = calculateCurrencyExchangeRate({
        selectedCurrencyExchangeRate: action.payload,
        defaultCurrencyExchangeRate: state.currency,
        price: state.total,
      });
      state.couponDiscount = calculateCurrencyExchangeRate({
        selectedCurrencyExchangeRate: action.payload,
        defaultCurrencyExchangeRate: state.currency,
        price: state.couponDiscount,
      });
      state.downgradeRefund = calculateCurrencyExchangeRate({
        selectedCurrencyExchangeRate: action.payload,
        defaultCurrencyExchangeRate: state.currency,
        price: state.downgradeRefund,
      });
      state.planChangeCost = calculateCurrencyExchangeRate({
        selectedCurrencyExchangeRate: action.payload,
        defaultCurrencyExchangeRate: state.currency,
        price: state.planChangeCost,
      });
      state.refundableThreshold = calculateCurrencyExchangeRate({
        selectedCurrencyExchangeRate: action.payload,
        defaultCurrencyExchangeRate: state.currency,
        price: state.refundableThreshold,
      });
      state.remainingBalance = calculateCurrencyExchangeRate({
        selectedCurrencyExchangeRate: action.payload,
        defaultCurrencyExchangeRate: state.currency,
        price: state.remainingBalance,
      });
      state.currency = action.payload;
    },
    setDefaultCurrency: (state, action: PayloadAction<Currency>) => {
      state.defaultCurrency = action.payload;
    },
    setSubscriptionType: (state, action: PayloadAction<string>) => {
      state.subscriptionType = action.payload;
      calculateTax(state);
    },
    resetAddOns: (state) => {
      state.addOn = { _id: '', title: '', price: 0, descriptions: [], slug: '' };
      // calculateSubTotal(state);
    },
    removeAddOns: (state, action: PayloadAction<string>) => {
      state.addOn = { _id: '', title: '', price: 0, descriptions: [], slug: '' };
      // calculateSubTotal(state);
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
      state.subscriptionType = 'plan';
      // plan toggle handle
      if (state?.subscription?.slug === action?.payload?.slug) {
        state.planChangeType = '';
        if (state.activeSubscription?.slug) {
          state.subscription = state.activeSubscription;
        } else {
          state.subscription = { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' };
        }
      } else {
        state.subscription = action.payload;
      }
      if (state.coupon) {
        calculateDiscount(state);
      }
      calculateSubTotal(state);
    },
    downgradePlan: (state, action: PayloadAction<Subscription>) => {
      state.planChangeType = 'downgrade';
      state.subscriptionType = 'plan';
      // plan toggle handle
      if (state?.subscription?.slug === action?.payload?.slug) {
        state.planChangeType = '';
        if (state.activeSubscription?.slug) {
          state.subscription = state.activeSubscription;
        } else {
          state.subscription = { _id: '', title: '', price: 0, duration: 0, descriptions: [], slug: '', type: '', image: '' };
        }
      } else {
        state.subscription = action.payload;
      }
      calculateSubTotal(state);
      state.downgradeRefund = calculateDowngradeRefund(state, action.payload);
    },
    resetState: (state) => {
      const { planChangeCost, taxPercentage, taxStatus, currency, refundableThreshold, defaultCurrency } = state;
      Object.assign(state, initialState, { planChangeCost, taxPercentage, taxStatus, currency, refundableThreshold, defaultCurrency });
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
  setCurrency,
  setDefaultCurrency,
  resetAddOns,
  removeAddOns,
  applyCoupon,
  removeCoupon,
  removeCode,
  upgradePlan,
  downgradePlan,
  setCode,
  setSubscriptionType,
  resetState,
  resetSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice;
