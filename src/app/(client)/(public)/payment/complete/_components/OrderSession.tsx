'use client';

import { useRetailerGetProfileQuery } from '@/features/auth/authApi';
import { setValue } from '@/features/auth/authSlice';
import { RootState } from '@/features/store';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function OrderSession() {
  const { data: session, update } = useSession();
  const dispatch = useDispatch();
  const { user, isLoggedIn, accessToken } = useSelector((state: RootState) => state.authSlice);
  const { data: profile, isSuccess: profileSuccess } = useRetailerGetProfileQuery(null, { skip: !accessToken });

  useEffect(() => {
    if (profileSuccess) {
      update({ ...session?.user, ...profile?.data });
      dispatch(
        setValue({
          target: 'user',
          value: { ...user, ...profile?.data },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.data, profileSuccess]);
  return (
    <Link href="/root/retailer/dashboard" className="rounded-xl bg-red-500 px-4 py-2 text-white">
      Go to Dashboard
    </Link>
  );
}
