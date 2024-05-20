'use client';
import { useGetOwnProfileQuery } from '@/features/auth/authApi';
import { userLoggedIn, userLoggedOut } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { useRouter } from 'next/navigation'; // Import useRouter from next/router
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function AuthCheckMiddleware({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // Initialize useRouter hook
  const userInformation = useSelector((state: RootState) => state.authSlice);
  console.log(userInformation, 'userInformation middleware');

  // const accessToken = cookies().get('act')?.value;
  // const accessToken = document.cookie
  //   .split('; ')
  //   .find((row) => row.startsWith('act='))
  //   ?.split('=')[1];

  const dispatch = useDispatch();
  const { data, isSuccess, isError } = useGetOwnProfileQuery({});
  useEffect(() => {
    console.log(isSuccess, 'AuthCheckMiddleware == isSuccess');

    if (isSuccess) {
      dispatch(userLoggedIn({ ...data?.data, isLoggedIn: true }));
      console.log('AuthCheckMiddleware ==', data);
      console.log('access cossis');
    }
    if (isError) {
      router.push('/retailer/login'); // Redirect to login page if not logged in

      console.log('  ***************===========*********  ');
    }
    // else {
    //   dispatch(userLoggedOut(undefined));
    //   console.log('not cockise');

    //   router.push('/retailer/login'); // Redirect to login page if not logged in
    // }
  }, [isSuccess, isError, dispatch, userLoggedOut, data, userLoggedIn]);

  return <>{children}</>;
}
