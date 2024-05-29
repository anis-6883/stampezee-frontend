import { Branch, IPagination } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// const initialState: Branch[] = [];
interface DataState {
  data: Branch[];
  pagination: IPagination;
}

const initialState: DataState = {
  data: [],
  pagination: {
    page: 1,
    limit: 10,
    hasNext: false,
    hasPrev: false,
    totalDocs: 0,
  },
};

// name: 'users',
// initialState,
// reducers: {
//   setValue: (
//     state,
//     action: PayloadAction<{
//       target: string;
//       value: IUser[] | Boolean | IPagination;
//     }>
//   ) => {
//     // @ts-ignore - Ignore TypeScript error as the types are correct
//     state[action.payload.target] = action.payload.value;
//   },

const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    setValue: (
      state,
      action: PayloadAction<{
        target: string;
        value: Branch[] | Boolean | IPagination;
      }>
    ) => {
      // @ts-ignore - Ignore TypeScript error as the types are correct
      state[action.payload.target] = action.payload.value;
    },
    allBranch: (state, action: PayloadAction<Branch[]>) => {
      state.data.push(...action.payload);
    },
    createBranch: (state, action: PayloadAction<Branch>) => {
      state.data.push(action.payload);
    },
    // addBranch: (state, action: PayloadAction<Branch>) => {
    //   state.push(action.payload);
    // },

    updateBranch: (state, action: PayloadAction<Branch>) => {
      state.data.map((item: Branch) => (item._id === action.payload._id ? { ...item, ...action.payload } : item));
    },

    deleteBranch: (state, action: PayloadAction<{ id: string }>) => {
      state.data.map((item: Branch) => (item._id !== action.payload.id ? item : undefined));
    },
  },
});

export const { updateBranch, deleteBranch, createBranch, allBranch } = branchSlice.actions;
export default branchSlice;
