'use client';
import { useGetOwnProfileQuery } from '@/features/auth/authApi';
import { userLoggedIn } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function AuthCheckMiddleware({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { data, isSuccess, isError } = useGetOwnProfileQuery({});

  useEffect(() => {
    if (isSuccess) {
      dispatch(userLoggedIn({ ...data?.data, isLoggedIn: true }));
    } else if (isError) {
      // dispatch(userLoggedOut());
      router.push('/retailer/login');
    }
  }, [isSuccess, isError, dispatch, router, data]);

  return <>{children}</>;
}
