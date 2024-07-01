import { IAuthState, IUser } from '@/types';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState: IAuthState = {
  user: null,
  isLoggedIn: false,
  role: '',
  accessToken: null,
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
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
    },
    userLoggedOut: (state) => {
      state.isLoggedIn = false;
      state.accessToken = null;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});

export const { userLoggedIn, userLoggedOut, setValue, setAccessToken } = authSlice.actions;

export default authSlice;
