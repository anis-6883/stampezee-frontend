'use client';

import { useGetOwnProfileMutation } from '@/features/auth/authApi';
import { userLoggedIn, userLoggedOut } from '@/features/auth/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function AuthProvider({ children, tokenExist }: { children: React.ReactNode; tokenExist: boolean }): React.ReactNode {
  const dispatch = useDispatch();
  const [getOwnProfile] = useGetOwnProfileMutation();

  useEffect(() => {
    if (tokenExist) {
      getOwnProfile(null)
        .then((res: any) => {
          dispatch(userLoggedIn(res.data.data));
        })
        .catch((err: any) => {
          dispatch(userLoggedOut(undefined));
        });
    } else {
      dispatch(userLoggedOut(undefined));
    }
  }, [dispatch, getOwnProfile, tokenExist]);

  return <>{children}</>;
}
