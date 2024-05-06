'use client';

import { useGetOwnProfileQuery } from '@/features/auth/authApi';
import { userLoggedIn, userLoggedOut } from '@/features/auth/authSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function AuthProvider({ children, tokenExist }: { children: React.ReactNode; tokenExist: boolean }): React.ReactNode {
  const dispatch = useDispatch();
  const { data, isLoading, isError } = useGetOwnProfileQuery(undefined, {
    skip: !tokenExist,
  });

  useEffect(() => {
    if (tokenExist && !isLoading && !isError) {
      dispatch(userLoggedIn(data?.data));
    } else {
      dispatch(userLoggedOut(undefined));
    }
  }, [data, dispatch, isError, isLoading, tokenExist]);

  return <>{children}</>;
}
