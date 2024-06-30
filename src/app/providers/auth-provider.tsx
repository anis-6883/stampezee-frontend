'use client';

import { userLoggedIn, userLoggedOut } from '@/features/auth/authSlice';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function AuthProvider({ children, session }: { children: React.ReactNode; session: any }): React.ReactNode {
  const dispatch = useDispatch();

  // User data and token update into redux state
  useEffect(() => {
    if (session) {
      dispatch(userLoggedIn(session?.user));
    } else {
      dispatch(userLoggedOut(undefined));
    }
  }, [dispatch, session]);

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
