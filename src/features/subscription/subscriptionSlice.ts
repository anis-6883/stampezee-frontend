import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  data: {
    _id: '6667f260136c8cd72c7af8a2',
    title: 'Pro',
    slug: 'pro',
    descriptions: ['Benefit 1', 'Benefit 2', 'tests', 'testse'],
    price: 19.99,
    duration: 30,
    type: 'subscription',
    limit: 10,
    allowTotalBranch: 5,
    allowTotalTeamMember: 5,
    image: null,
    status: true,
  },
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setSubscription } = subscriptionSlice.actions;
export default subscriptionSlice;
