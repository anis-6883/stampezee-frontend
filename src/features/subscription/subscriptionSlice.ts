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
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      state.subscription = action.payload;
    },
    setAddOns: (state, action) => {
      const newAddOns = state.addOns.find((item: any) => item._id === action.payload._id);
      if (newAddOns) {
        state.addOns = state.addOns.filter((item: any) => item._id !== newAddOns?._id);
      } else {
        state.addOns.push({ ...action.payload, isAddOnsSelect: true });
      }
    },
    resetAddOns: (state) => {
      state.addOns = [];
    },
    removeAddOns: (state, action) => {
      state.addOns = state.addOns.filter((item: any) => item._id !== action.payload);
    },
  },
});

export const { setSubscription, setAddOns, removeAddOns, resetAddOns } = subscriptionSlice.actions;
export default subscriptionSlice;
