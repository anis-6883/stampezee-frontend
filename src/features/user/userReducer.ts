import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser, IPagination } from '@/types';

interface userState {
  users: IUser[];
  pagination: IPagination;
}

const initialState: userState = {
  users: [],
  pagination: {
    page: 1,
    limit: 10,
    hasNext: false,
    hasPrev: false,
    totalDocs: 0,
  },
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setValue: (
      state,
      action: PayloadAction<{
        target: string;
        value: IUser[] | Boolean | IPagination;
      }>
    ) => {
      // @ts-ignore - Ignore TypeScript error as the types are correct
      state[action.payload.target] = action.payload.value;
    },
    addUser: (state, action: PayloadAction<IUser>) => {
      state.users = [...state.users, action.payload];
    },
    updateUser: (state, action: PayloadAction<IUser>) => {
      state.users = state.users.map((item: IUser) => (item.id === action.payload.id ? { ...item, ...action.payload } : item));
    },
    deleteUser: (state, action: PayloadAction<{ id: string }>) => {
      state.users = state.users.filter((item: IUser) => item.id !== action.payload.id);
    },
  },
});

export const { setValue, addUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
