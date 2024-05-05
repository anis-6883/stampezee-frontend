import { IAuthState, IUser } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: IAuthState = {
  user: undefined,
  role: 'admin',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<{ target: string; value: IUser | undefined }>) => {
      // @ts-ignore - Ignore TypeScript error as the types are correct
      state[action.payload.target] = action.payload.value;
    },
    userLoggedIn: (state, action) => {
      state.user = action.payload;
      state.role = action.payload.role;
    },
    userLoggedOut: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { userLoggedIn, userLoggedOut, setValue } = authSlice.actions;

export default authSlice;
